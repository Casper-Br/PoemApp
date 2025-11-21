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

let typingTimeout = null; // Stores current setTimeout for typewriter

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

poemSelector.addEventListener('change', () => {
  const selectedPoem = poemSelector.value;
  const poemText = poems[selectedPoem];

  if (!poemText) {
    playRecordingBtn.style.display = 'none';
    return;
  }
  
  poemDiv.textContent = "";
  poemContainer.style.display = 'block';

  if (typingTimeout) clearTimeout(typingTimeout);

  // Setup audio file
  const audioSrc = poemRecordings[selectedPoem];
  if (audioSrc) {
    poemAudio.src = audioSrc;
    playRecordingBtn.style.display = 'inline-block';
  } else {
    playRecordingBtn.style.display = 'none';
  }

  typeWriter(poemText, poemDiv, 0);
});

playRecordingBtn.addEventListener ('click', () => {
  if (!poemAudio.src) {
    console.warn("No poem audio file available.");
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