const housesElement = document.querySelector(".houses");
const toolbarElement = document.querySelector(".toolbar");
const searchElement = document.querySelector(".toolbar__search");
const studentsElement = document.querySelector("#students");
const staffElement = document.querySelector("#staff");

let characters = [];

// One object holds every choice of the user. render() reads only this object.
const state = {
  house: null,
  sort: null,
  status: "all",
  search: "",
};

function compareAge(a, b) {
  if (a.yearOfBirth === b.yearOfBirth) {
    return 0;
  }
  // Unknown birth years go to the end of the list.
  if (a.yearOfBirth === null) {
    return 1;
  }
  if (b.yearOfBirth === null) {
    return -1;
  }
  // Youngest first: the most recent birth year comes first.
  return b.yearOfBirth - a.yearOfBirth;
}

const SORTS = {
  name: (a, b) => a.name.localeCompare(b.name),
  age: compareAge,
};

const STATUS_FILTERS = {
  all: () => true,
  alive: (character) => character.alive === true,
  dead: (character) => character.alive === false,
};

// A second click on the selected value removes the choice.
function toggle(currentValue, clickedValue) {
  return currentValue === clickedValue ? null : clickedValue;
}

function characterCard(character) {
  const name = escapeHtml(character.name || "Unknown");
  const image = escapeHtml(character.image || DEFAULT_IMAGE);
  // Without a house, the card gets no house class and its border stays gold.
  const houseClass = character.house ? escapeHtml(character.house.toLowerCase()) : "";
  const detailsUrl = `details.html?id=${encodeURIComponent(character.id)}`;

  return `
    <div class="${houseClass}">
      <a href="${detailsUrl}">
        <img class="${deadClass(character)}" src="${image}" alt="${name}" />
        <p>${name}</p>
      </a>
    </div>
  `;
}

function renderList(element, list) {
  if (list.length === 0) {
    element.innerHTML = "<p>No character found.</p>";
    return;
  }
  element.innerHTML = list.map(characterCard).join("");
}

function visibleCharacters() {
  const search = state.search.toLowerCase();
  const list = characters
    .filter((character) => state.house === null || character.house === state.house)
    .filter(STATUS_FILTERS[state.status])
    .filter((character) => character.name.toLowerCase().includes(search));

  if (state.sort === null) {
    return list;
  }
  return list.sort(SORTS[state.sort]);
}

function markActive(elements, dataKey, value) {
  elements.forEach((element) => {
    element.classList.toggle("active", element.dataset[dataKey] === value);
  });
}

function render() {
  const list = visibleCharacters();
  renderList(studentsElement, list.filter((character) => character.hogwartsStudent));
  renderList(staffElement, list.filter((character) => character.hogwartsStaff));

  markActive(housesElement.querySelectorAll("[data-house]"), "house", state.house);
  markActive(toolbarElement.querySelectorAll("[data-sort]"), "sort", state.sort);
  markActive(toolbarElement.querySelectorAll("[data-status]"), "status", state.status);
}

function update(changes) {
  Object.assign(state, changes);
  render();
}

async function loadCharacters() {
  try {
    const response = await fetch(`${API_URL}/characters`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    characters = await response.json();
    render();
  } catch (error) {
    console.error("Cannot load the characters:", error);
    const message = "<p>Cannot load the characters. Try again later.</p>";
    studentsElement.innerHTML = message;
    staffElement.innerHTML = message;
  }
}

// One listener per container: the click bubbles up from the house or the button.
housesElement.addEventListener("click", (event) => {
  const houseElement = event.target.closest("[data-house]");
  if (!houseElement) {
    return;
  }
  // A house shows its characters in alphabetical order.
  update({ house: toggle(state.house, houseElement.dataset.house), sort: "name" });
});

toolbarElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const { sort, status } = button.dataset;
  if (sort) {
    update({ sort: toggle(state.sort, sort) });
    return;
  }
  update({ status });
});

searchElement.addEventListener("input", () => {
  update({ search: searchElement.value.trim() });
});

loadCharacters();
