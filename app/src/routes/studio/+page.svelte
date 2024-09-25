<script>
  import { v4 as uuidv4 } from "uuid";
  import { Gclient } from "$lib/stores/auth.js";

  let mosaic = {
    name: "my-mosaic-" + uuidv4(),
    background: "/images/background_600x400.png",
    tiles: [],
  }

  let accessToken = null;

  // Create and render a Google Picker object for selecting from Drive.
  function createPicker() {
    console.log('creating picker...');
      const showPicker = () => {
        // TODO(developer): Replace with your API key
        const picker = new google.picker.PickerBuilder()
            .addView(google.picker.ViewId.DOCS)
            .setOAuthToken(accessToken)
            .setDeveloperKey('API_KEY')
            .setCallback(pickerCallback)
            .setAppId(APP_ID)
            .build();
        picker.setVisible(true);
      }

      // Request an access token.
      $Gclient.callback = async (response) => {
        if (response.error !== undefined) {
          throw (response);
        }
        accessToken = response.access_token;
        showPicker();
      };

      if (accessToken === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        $Gclient.requestAccessToken({prompt: 'consent'});
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        $Gclient.requestAccessToken({prompt: ''});
      }
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
    <div on:click={createPicker} class="padding absolute center middle">
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
    