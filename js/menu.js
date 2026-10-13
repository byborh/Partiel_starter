const headerElement = document.querySelector(".header");
const menuButton = document.querySelector(".header__left img");

menuButton.addEventListener("click", () => {
  headerElement.classList.toggle("header--open");
});
