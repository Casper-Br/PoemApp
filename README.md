**PoemWriter** is a macOS desktop app built with Electron that displays poems with a typewriter effect while playing background music.

## Necessary files
You have to add an audio file to the assets folder and set the appropriate path in the  <audio id="bgMusic" src="assets/PLACEHOLDER.mp3" autoplay loop></audio> html tag. You can find it in index.html

You can add your poems to 
const poems = { 
  poem1: "Your poem here",
  poem2: "Another poem",
  poem3: "More poems..."
};
in script.js. 

You can add more poems if you like. Be sure to remember to add an option tag in the  <select id="poemSelector"> </select> tag found in index.html

## Run Locally
Install dependencies:
npm install

## Run the app
npx electron .

## Build (To package as a macOS .app)
npx electron-packager . PoemWriter --platform=darwin --arch=universal --overwrite


