<script>
  import { v4 as uuidv4 } from "uuid";

  let mosaic = {
    name: "my-mosaic-" + uuidv4(),
    background: "/images/background_600x400.png",
    tiles: [],
  }
</script>
<style>
  .mosaic-background {
    height: 400px;
    width: 600px;
    background-size: cover;
    color: white;
  }
</style>

<div class="container">
  <h1>Create A Mosaic</h1>
  <article class="border medium no-padding mosaic-background" style="background-image: url('{mosaic.background}')">
    <div class="padding absolute center middle">
      <h5>Mosaic Background</h5>
      <div>Click to change background image...</div>
    </div>
  </article>
  
  <article class="border medium no-padding">
      <div class="padding primary absolute center middle">
        <h5>Position</h5>
        <div>Lorem ipsum dolor...</div>
      </div>
    </article>
    <article class="medium middle-align center-align">
      <div>
        <i class="extra">mail</i>
        <h5>You have no new messages</h5>
        <p>Click the button to start a conversation</p>
        <div class="space"></div>
        <nav class="center-align">
          <button>Send a message</button>
        </nav>
      </div>
    </article>
</div>
    