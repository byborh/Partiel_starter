const mainElement = document.querySelector("main");

// An empty string or null from the API becomes "Unknown".
function displayValue(value) {
  return value ? escapeHtml(String(value)) : "Unknown";
}

function displayWand(wand) {
  const parts = [wand.wood, wand.core, wand.length ? `${wand.length}"` : ""];
  return displayValue(parts.filter(Boolean).join(", "));
}

function attribute(label, value) {
  return `
    <div>
      <p class="attr">${label}</p>
      <p>${value}</p>
    </div>
  `;
}

function houseSection(house) {
  if (!house) {
    return "";
  }
  const safeHouse = escapeHtml(house);
  return `
    <section class="house__perso">
      <img src="./images/logo/${safeHouse}.png" alt="${safeHouse}" />
    </section>
  `;
}

function renderCharacter(character) {
  const name = displayValue(character.name);
  const image = escapeHtml(character.image || DEFAULT_IMAGE);

  mainElement.innerHTML = `
    <section>
      <h3>${name}</h3>
      <div class="perso">
        <figure class="perso__left">
          <img src="${image}" alt="${name}" />
          <figcaption>${displayValue(character.actor)}</figcaption>
        </figure>
        <div class="perso__right">
          <div>
            ${attribute("Date of birth", displayValue(character.dateOfBirth))}
            ${attribute("Ancestry", displayValue(character.ancestry))}
          </div>
          <div>
            ${attribute("Eye colour", displayValue(character.eyeColour))}
            ${attribute("Hair colour", displayValue(character.hairColour))}
          </div>
          <div>
            ${attribute("Patronus", displayValue(character.patronus))}
            ${attribute("Wand", displayWand(character.wand))}
          </div>
        </div>
      </div>
    </section>
    ${houseSection(character.house)}
  `;
}

function renderMessage(message) {
  mainElement.innerHTML = `<section><h3>${message}</h3></section>`;
}

async function loadCharacter() {
  const characterId = new URLSearchParams(window.location.search).get("id");
  if (!characterId) {
    renderMessage("No character selected");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/character/${encodeURIComponent(characterId)}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // The API answers with an array: empty when the id is unknown.
    const [character] = await response.json();
    if (!character) {
      renderMessage("Character not found");
      return;
    }
    renderCharacter(character);
  } catch (error) {
    console.error("Cannot load the character:", error);
    renderMessage("Cannot load the character. Try again later.");
  }
}

loadCharacter();
