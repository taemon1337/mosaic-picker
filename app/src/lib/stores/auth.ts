export const onGoogleScriptLoad = (decodeJwtResponse) => {
    try {
        const handleCredentialResponse = (response) => {
            // decodeJwtResponse() is a custom function defined by you
            // to decode the credential response.
            const responsePayload = decodeJwtResponse(response.credential);
            console.log('ID: ' + responsePayload.sub);
            console.log('Full Name: ' + responsePayload.name);
            console.log('Given Name: ' + responsePayload.given_name);
            console.log('Family Name: ' + responsePayload.family_name);
            console.log('Image URL: ' + responsePayload.picture);
            console.log('Email: ' + responsePayload.email);
            console.log('Encoded JWT ID token: ' + response.credential);
        };
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById('googleSignIn'),
            { theme: 'outline', size: 'large', text: "signin_with", shape: "rectangular", logo_alignment: "left" } // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog
    } catch { }
};

export const decodeJwtResponse = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};