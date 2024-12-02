<script>
  import { base } from '$app/paths';
</script>

<div class="responsive">
    <div>
        <aside class="left medium-width medium-height padding">
            <img class="round responsive" src="{base}/images/birthday/birthday-original.jpg" alt="Original">
        </aside>
        <h5><button class="primary chip medium">Step 1</button> Login to your Photos</h5>
        <p>Currently only support for Google Photos.</p>
        <br/>
        <h5><button class="primary chip medium">Step 2</button> Select Background image</h5>
        <p>Select your main mosaic background image.</p>
    </div>
    <div>
        <aside class="left medium-width medium-height padding">
            <img class="round responsive" src="{base}/images/birthday/birthday-grid.jpg" alt="Grid">
        </aside>
        <h5><button class="primary chip medium">Step 3</button> Select images</h5>
        <p>Pick as many images as you want to fill the mosaic with, 100s or even 1000s.</p>
    </div>
    <div>
        <aside class="left medium-width medium-height padding">
            <img class="round responsive" src="{base}/images/birthday/birthday-mosaic.jpg" alt="Mosaic">
        </aside>
        <h5><button class="primary chip medium">Step 4</button>Generate Mosaic</h5>
        <p>Mosaic will be combination of background image plus selected images overlayed on top.</p>
    </div>
    <div>
        <aside class="left medium-width medium-height padding">
            <img class="round responsive" src="{base}/images/birthday/birthday-mosaic-light.jpg" alt="Mosaic Light">
        </aside>
        <h5><button class="primary chip medium">Step 5</button>Adjust Mosaic</h5>
        <p>Adjust and filter your mosaic to get just the right effect.</p>
        <br/>
        <h5><button class="primary chip medium">Step 6</button>Save or Download Mosaic</h5>
        <p>Mosaic can be downloaded in poster scale sizes for high quality photo prints.</p>
    </div>
</div>

<style>
    .responsive {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 2rem;
    }
    
    .medium-width {
        max-width: 300px;
    }
    
    .medium-height {
        max-height: 300px;
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
