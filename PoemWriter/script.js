const poems = {
poem1: `Placeholder poem 1`,

poem2: `Placeholder poem 2`,

poem3: `Placeholder poem 3`
};

const poemDiv = document.getElementById('poem');
const poemContainer = document.getElementById('poemContainer');
const poemSelector = document.getElementById('poemSelector');

let typingTimeout = null; // Stores current setTimeout for typewriter

poemSelector.addEventListener('change', () => {
  const selectedPoem = poemSelector.value;
  const poemText = poems[selectedPoem];
  
  poemDiv.innerHTML = "";
  poemContainer.style.display = 'block';
  if (typingTimeout) clearTimeout(typingTimeout);

  typeWriter(poemText, poemDiv, 0);
});

function typeWriter(text, element, i) {
    if (i < text.length) {
      let char = text.charAt(i);
  
      // Replace newlines with <br>
      if (char === '\n') char = '<br>';
  
      element.innerHTML += char;
      typingTimeout = setTimeout(() => typeWriter(text, element, i + 1), 100);
    } else {
      typingTimeout = null; // Finished typing
    }
  }