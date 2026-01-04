# PoemApp

An Electron application that allows the user to add and store poems (or any other text) accompanied by an audio file. These poems can then be displayed using a typewriter animation and the audio can be played alongside it (for example a reading of the poem).


## Everything you need to know before you start

To test the PoemApp use `npm run start` in the terminal.

Background music is not included and you will have to add it yourself before packaging the PoemApp. You can do this by adding your desired .mp3 file to the assets folder and naming it "bgAudio.mp3". After packaging the PoemApp it is not possible to add or remove the background audio. This may be something I will update if I return to this project in the future.

You can add poems and audio and have them be prepackaged into the PoemApp. Edit the poemData.js file to do this, ensure the audio is assigned to the correct poem. The accepted audio formats for the poems are .wav and .mp3. Ensure the audio file is placed in the assets folder with the correct name and format.

The secretPoem can be accessed by: <details> clicking a hidden icon next to the poemSelector. Hovering over it with your mouse will make it visible. </details> When selected it will show the secretPoem along with the added audio. This poem is unique because it cannot be removed and can only be added in prepackaging.

“After packaging, you can add new poems using the New Poem button. You can attach an audio file immediately or later using the "Add Audio" button.”

When an audio file is attached to a poem it cannot be removed without removing the poem text as well.


## Features

- Add and save poems with custom titles
- Attach audio recordings to poems
- Typewriter-style animation for displaying poems
- Play poem audio alongside background music
- Secret poem feature accessed via a hidden icon
- Persistent storage using JSON files
- Cross-platform desktop app (Windows & MacOS)


## Packaging the app for Windows/MacOS

**Before you package**
Be sure to add a .mp3 audio file to your assets folder called "bgAudio.mp3". Background audio cannot be added after packaging.
Remember poemData.js contains placeholders. Either remove these before packaging or add your own text and audio. The placeholders can be deleted after packaging.

Use `npm run package-mac` in the terminal to package the app for MacOS

Use `npm run package-win32` in the terminal to package the app for Windows 32-Bit

Use `npm run package-win64` in the terminal to package the app for Windows 64-Bit

Open the package.json file to see what these do specifically.

After running the package command a new folder will be created inside of your PoemApp directory, this new folder will contain the PoemApp application.


## Tech Stack

- Electron
- Node.js
- JavaScript (ES6+)
- HTML
- CSS3
- JSON


## Why I made this

I built PoemApp because I wanted to create a desktop application that would work on both Windows and MacOS and that was easily deployable. I wanted to get experience with creating a fully functional application and improve my overall JavaScript skills, trying Node.js and Electron for the first time.

While making this project I learned:
- Dynamically generating HTML
- DOM manipulation using JavaScript
- Conditional UI logic
- Handle file system operations with Node.js for the first time, including reading and writing JSON files to store poems and audio paths

This project was my first major project and it helped me strengthen my understanding of JavaScript, Node.js, and desktop app development.
Looking back, I can see many ways to make my code tidier and more modular, which I plan to apply in future projects. 
