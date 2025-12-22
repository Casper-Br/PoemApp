const titles = [
  "Here's my hand I'll never leave you.",
  "And I found peace in the words you speak.",
  "She looks just like a dream... prettiest girl I've ever seen...",
  "When I try to run, can you hold me?",
  "I'm running on the feeling, that I get when you and me dance.",
  "Shut out the light and stay with me tonight.",
  "Just come and grab my face and never let it go.",
  "Girl, you're simply wonderful. You bleed, I'll bleed.",
  "Bite me on the neck and then you whisper something real.",
  "Kiss me you animal and don't ever let me go."

];

const randomTitle = titles[Math.floor(Math.random() * titles.length)];
document.title = randomTitle;

const moonCrest = document.getElementById('moonCrest');
const poemDiv = document.getElementById('poem');
const poemContainer = document.getElementById('poemContainer');
const poemSelector = document.getElementById('poemSelector');
const bgMusic = document.getElementById('bgMusic');
const toggleMusicBtn = document.getElementById('toggleMusicBtn');
const TYPING_SPEED = 100;
const playRecordingBtn = document.getElementById('playRecordingBtn');
const poemAudio = document.getElementById('poemAudio');
const NORMAL_MUSIC_VOLUME = 1.0;
const LOW_MUSIC_VOLUME = 0.15;

const pasteModal = document.getElementById("pastePoemModal");
const poemTextInput = document.getElementById("poemTextInput");
const poemTitleInput = document.getElementById("poemTitleInput");
const savePoemBtn = document.getElementById("savePoemBtn");
const cancelPoemBtn = document.getElementById("cancelPoemBtn");
const deletePoemBtn = document.getElementById("deletePoemBtn");
const addAudioBtn = document.getElementById("addAudioBtn");
const changeSavePathBtn = document.getElementById("changeSavePathBtn");

const fs = require('fs');
const { ipcRenderer } = require('electron');

let typingTimeout = null; // Stores current setTimeout for typewriter

let poems = window.poems || {};
let poemRecordings = window.poemRecordings || {};

let userJsonPath = localStorage.getItem("userPoemsPath");

if (userJsonPath && fs.existsSync(userJsonPath)) {
  try {
    const data = fs.readFileSync(userJsonPath, "utf-8");
    const userPoems = JSON.parse(data);
    Object.assign(poems, userPoems.poems || {});
    Object.assign(poemRecordings, userPoems.poemRecordings || {});
  } catch (err) {
    console.warn("Failed to load user poems", err);
  }
}

document.getElementById("pastePoemBtn").addEventListener("click", () => {
  poemTextInput.value = "";
  poemTitleInput.value = "";
  pasteModal.style.display = "flex";
});

cancelPoemBtn.addEventListener("click", () => {
  pasteModal.style.display = "none";
});

savePoemBtn.addEventListener("click", async () => {
  const poemText = poemTextInput.value.trim();
  let poemTitle = poemTitleInput.value.trim();

  if (!poemText) return alert("Please enter a poem");
  if (!poemTitle) poemTitle = `My_Poem_${Date.now()}`;

  // Ask user where to save the text file
  if (!userJsonPath) {
    userJsonPath = await ipcRenderer.invoke("select-json-path");
    if (!userJsonPath) return alert ("No file selected.");
    localStorage.setItem("userPoemsPath", userJsonPath);
  }

  let audioPath = null;
  const addAudio = confirm("Do you want to add an audio file for this poem?");
  if (addAudio) {
    const audioFilePath = await ipcRenderer.invoke("select-audio");
    if (audioFilePath) audioPath = audioFilePath;
  }

  const poemId = poemTitle.replace(/\s+/g, "_");
  poems[poemId] = poemText;
  poemRecordings[poemId] = audioPath || null;

  // Save all user poems to JSON
  try {
  fs.writeFileSync(userJsonPath, JSON.stringify({ poems, poemRecordings }, null, 2));
  } catch (err) {
    console.error("Failed to save poems", err);
  }

  loadPoemSelector();
  pasteModal.style.display = "none";
  alert(`Poem "${poemTitle}" saved succesfully.`);
});

changeSavePathBtn.addEventListener("click", async () => {
  const newPath = await ipcRenderer.invoke("select-json-path");

  if (!newPath) return;

  try {
    fs.writeFileSync(
      newPath,
      JSON.stringify({ poems, poemRecordings },null, 2)
    );

    userJsonPath = newPath;
    localStorage.setItem("userPoemsPath", newPath);

    alert("Save location updated succesfully.");
  } catch (err) {
    console.error("Failed to change save path", err);
    alert("Failed to update save location.");
  }
});

toggleMusicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleMusicBtn.innerHTML = "&#9208; Music";
  } else {
    bgMusic.pause();
    toggleMusicBtn.innerHTML = "&#9654; Music";
  }
});

moonCrest.addEventListener('click', () => {
  poemSelector.value = "secretPoem"
  poemSelector.dispatchEvent(new Event('change'));
});

// Poem Selection
poemSelector.addEventListener('change', () => {
  const selectedPoem = poemSelector.value;
  const poemText = poems[selectedPoem];

  if (!poemText || selectedPoem === "noPoem") {
    poemContainer.style.display = "none";
    playRecordingBtn.style.display = "none";
    deletePoemBtn.style.display = "none";
    addAudioBtn.style.display = "none";
    return;
  }
  
  poemDiv.textContent = "";
  poemContainer.style.display = "block";

  if (typingTimeout) clearTimeout(typingTimeout);

  // Setup audio file
  const audioSrc = poemRecordings[selectedPoem] || null;

  // Pause and reset previous audio
  poemAudio.pause();
  poemAudio.currentTime = 0;
  poemAudio.src = audioSrc || "";
  bgMusic.volume = NORMAL_MUSIC_VOLUME;

  if (selectedPoem === "secretPoem") {
    deletePoemBtn.style.display = "none";
    addAudioBtn.style.display = "none";
    playRecordingBtn.style.display = "inline-block";
  } else {
    deletePoemBtn.style.display = "inline-block";
    addAudioBtn.style.display = audioSrc ? "none" : "inline-block";
    playRecordingBtn.style.display = audioSrc ? "inline-block" : "none";
  }
  
  typeWriter(poemText, poemDiv, 0);
});

addAudioBtn.addEventListener("click", async () => {
  const selectedPoem = poemSelector.value;
  if (!selectedPoem || selectedPoem === "secretPoem") return;

  const audioFilePath = await ipcRenderer.invoke("select-audio");
  if (!audioFilePath) return;

  poemRecordings[selectedPoem] = audioFilePath;

  if (userJsonPath) {
    fs.writeFileSync(
      userJsonPath,
      JSON.stringify({ poems, poemRecordings }, null, 2)
    );
  }

  addAudioBtn.style.display = "none";
  playRecordingBtn.style.display = "inline-block";
  poemAudio.src = audioFilePath;
});

playRecordingBtn.addEventListener ('click', () => {
  if (!poemAudio.src) {
    alert("No poem audio file available.");
    return;
  }

  if (poemAudio.paused) {
    poemAudio.play()
      .then(() => {
        playRecordingBtn.textContent ="Pause Recording";
        bgMusic.volume = LOW_MUSIC_VOLUME;
      })
      .catch(err => {
        console.warn("Cannot play audio:", err);
        bgMusic.volume = NORMAL_MUSIC_VOLUME;
      });
  } else {
    poemAudio.pause();
    playRecordingBtn.textContent = "Play Recording";
    bgMusic.volume = NORMAL_MUSIC_VOLUME;
  }
});

poemAudio.addEventListener('ended', () => {
  playRecordingBtn.textContent = "Play Recording";
  bgMusic.volume= NORMAL_MUSIC_VOLUME;
});

deletePoemBtn.addEventListener("click", () => {
  const poemId = poemSelector.value;

  if (!poemId || poemId === "secretPoem") return;

  const confirmed = confirm(
    `Are you sure you want to delete "${poemId}"? \n This cannot be undone.`
  );

  if (!confirmed) return;

  // Remove poem data
  delete poems[poemId];
  delete poemRecordings[poemId];

  // Save updated JSON
  if (userJsonPath) {
    fs.writeFileSync(
      userJsonPath,
      JSON.stringify({ poems, poemRecordings }, null, 2)
    );
  }

  // Reset UI
  poemSelector.value = "noPoem";
  poemDiv.textContent = "";
  poemContainer.style.display = "none";
  playRecordingBtn.style.display = "none";
  deletePoemBtn.style.display = "none";
  addAudioBtn.style.display = "none";

  loadPoemSelector();
});

// Typewriter
function typeWriter(text, element, i) {
  if (i < text.length) {
    const char = text[i];
    if (char === '\n') {
      element.appendChild(document.createElement('br'));
    } else {
      element.appendChild(document.createTextNode(char));
    }
    typingTimeout = setTimeout(() => typeWriter(text, element, i + 1), TYPING_SPEED);
  } else {
    typingTimeout = null; // Finished typing
  }
}

function loadPoemSelector () {
  // Keep default options
  poemSelector.querySelectorAll("option:not([value='noPoem']):not([value='secretPoem'])")
    .forEach(opt => opt.remove());

  Object.keys(poems).forEach(id => {
    if (id === "secretPoem") return;
    const option = document.createElement("option");
    option.value = id;
    option.textContent =id;
    poemSelector.appendChild(option);
  });
}

loadPoemSelector();