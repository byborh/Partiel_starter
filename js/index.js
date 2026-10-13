const API_URL = "https://hp-api.onrender.com/api/characters";
const CHARACTER_LIMIT = 20;
// The troll replaces the photo when the API gives none.
const DEFAULT_IMAGE = "./images/troll.jpg";

const charactersElement = document.querySelector(".characters");
const houseElements = document.querySelectorAll(".houses > div");

let characters = [];
let selectedHouse = null;

// The API is external input: escape it before it goes into innerHTML.
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function characterCard(character) {
  const name = escapeHtml(character.name || "Unknown");
  const image = escapeHtml(character.image || DEFAULT_IMAGE);
  // Without a house, the card gets no house class and its border stays gold.
  const houseClass = character.house ? escapeHtml(character.house.toLowerCase()) : "";

  return `
    <div class="${houseClass}">
      <img src="${image}" alt="${name}" />
      <p>${name}</p>
    </div>
  `;
}

function renderCharacters(list) {
  if (list.length === 0) {
    charactersElement.innerHTML = "<p>No character in this house.</p>";
    return;
  }
  charactersElement.innerHTML = list.map(characterCard).join("");
}

function selectHouse(house) {
  // A second click on the selected house shows all the characters again.
  selectedHouse = selectedHouse === house ? null : house;

  houseElements.forEach((houseElement) => {
    houseElement.classList.toggle("active", houseElement.dataset.house === selectedHouse);
  });

  if (selectedHouse === null) {
    renderCharacters(characters);
    return;
  }

  const houseCharacters = characters
    .filter((character) => character.house === selectedHouse)
    .sort((a, b) => a.name.localeCompare(b.name));
  renderCharacters(houseCharacters);
}

async function loadCharacters() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    characters = data.slice(0, CHARACTER_LIMIT);
    renderCharacters(characters);
  } catch (error) {
    console.error("Cannot load the characters:", error);
    charactersElement.innerHTML = "<p>Cannot load the characters. Try again later.</p>";
  }
}

houseElements.forEach((houseElement) => {
  houseElement.addEventListener("click", () => selectHouse(houseElement.dataset.house));
});

loadCharacters();
