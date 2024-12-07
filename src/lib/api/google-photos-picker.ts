interface PollingConfig {
    pollInterval: string;
    timeoutIn: string;
}

interface PickingSession {
    id: string;
    pickerUri: string;
    pollingConfig?: PollingConfig;
    expireTime: string;
    mediaItemsSet: boolean;
}

interface PhotoMetadata {
    focalLength: number;
    apertureFNumber: number;
    isoEquivalent: number;
    exposureTime: string;
}

interface MediaFileMetadata {
    width: number;
    height: number;
    cameraMake?: string;
    cameraModel?: string;
    photoMetadata?: PhotoMetadata;
}

interface MediaFile {
    baseUrl: string;
    mimeType: string;
    mediaFileMetadata: MediaFileMetadata;
    filename: string;
}

export class MediaItem {
    readonly id: string;
    readonly createTime: string;
    readonly type: string;
    readonly mediaFile: MediaFile;
    readonly maxWidth: number;
    readonly maxHeight: number;

    constructor(data: any) {
        this.id = data.id;
        this.createTime = data.createTime;
        this.type = data.type;
        this.mediaFile = data.mediaFile;
        this.maxHeight = data.maxHeight || 2268;  // Default to original size
        this.maxWidth = data.maxWidth || 4032;    // Default to original size
    }

    url(width?: number, height?: number): string {
        const w = width || this.maxWidth;
        const h = height || this.maxHeight;
        return `${this.mediaFile.baseUrl}=w${w}-h${h}`;
    }

    get baseUrl(): string {
        return this.mediaFile.baseUrl;
    }

    get mimeType(): string {
        return this.mediaFile.mimeType;
    }

    get filename(): string {
        return this.mediaFile.filename;
    }

    get width(): number {
        return this.mediaFile.mediaFileMetadata.width;
    }

    get height(): number {
        return this.mediaFile.mediaFileMetadata.height;
    }

    get aspectRatio(): number {
        return this.width / this.height;
    }
}

export class GooglePhotosPicker {
    private readonly API_BASE = 'https://photospicker.googleapis.com/v1';
    private readonly accessToken: string;
    private readonly pollingInterval = 3000;
    private readonly pollingTimeout = 60000;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    async createSession(): Promise<PickingSession> {
        const response = await fetch(`${this.API_BASE}/sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create photos picker session: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    }

    async pollSession(sessionId: string): Promise<PickingSession> {
        const response = await fetch(`${this.API_BASE}/sessions/${sessionId}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to poll session');
        }

        return await response.json();
    }

    async getSelectedPhotos(sessionId: string, pageSize: number = 50, pageToken?: string): Promise<MediaItem[]> {
        const params = new URLSearchParams({
            sessionId,
            pageSize: pageSize.toString()
        });
        
        if (pageToken) {
            params.append('pageToken', pageToken);
        }

        const response = await fetch(`${this.API_BASE}/mediaItems?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get selected photos: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        if (!data.mediaItems) {
            return [];
        }

        return data.mediaItems.map((item: any) => new MediaItem(item));
    }

    async openPicker(): Promise<MediaItem[]> {
        const session = await this.createSession();
        console.log('Created picker session:', session);

        const pickerWindow = window.open(session.pickerUri, 'photoPicker', 'width=800,height=600');
        if (!pickerWindow) {
            throw new Error('Failed to open picker window. Please allow popups for this site.');
        }

        // Poll for session status
        let attempts = 0;
        const maxAttempts = this.pollingTimeout / this.pollingInterval;

        while (attempts < maxAttempts) {
            const updatedSession = await this.pollSession(session.id);
            console.log('Polled session:', updatedSession);

            if (updatedSession.mediaItemsSet) {
                return await this.getSelectedPhotos(session.id);
            }

            await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
            attempts++;
        }

        throw new Error('Timeout waiting for photo selection');
    }
}