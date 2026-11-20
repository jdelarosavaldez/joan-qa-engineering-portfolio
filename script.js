const languageButtons = [...document.querySelectorAll("[data-language-choice]")];
const translatableElements = document.querySelectorAll("[data-en][data-es]");
const pageTitle = "Joan De la Rosa — QA Engineer";

function setLanguage(language) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  for (const element of translatableElements) {
    const translation = element.dataset[language];
    if (!translation) continue;
    if (element instanceof HTMLMetaElement) element.content = translation;
    else element.textContent = translation;
  }

  document.querySelectorAll("[data-en-label][data-es-label]").forEach((element) => {
    element.setAttribute("aria-label", element.dataset[`${language}Label`]);
  });

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.languageChoice === language));
  });
  document.title = pageTitle;
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.languageChoice));
});

const stations = [...document.querySelectorAll(".station")];
const notes = [...document.querySelectorAll(".station-notes p")];

function closeStations() {
  stations.forEach((station) => {
    station.dataset.openedByClick = "false";
    station.setAttribute("aria-expanded", "false");
  });
  notes.forEach((note) => note.classList.remove("is-visible"));
}

function showStation(station) {
  stations.forEach((item) => {
    if (item !== station) {
      item.dataset.openedByClick = "false";
      item.setAttribute("aria-expanded", "false");
      document.getElementById(item.getAttribute("aria-controls")).classList.remove("is-visible");
    }
  });
  station.setAttribute("aria-expanded", "true");
  document.getElementById(station.getAttribute("aria-controls")).classList.add("is-visible");
}

stations.forEach((station) => {
  station.dataset.openedByClick = "false";
  station.addEventListener("mouseenter", () => showStation(station));
  station.addEventListener("mouseleave", () => {
    if (document.activeElement !== station && station.dataset.openedByClick !== "true") {
      station.setAttribute("aria-expanded", "false");
      document.getElementById(station.getAttribute("aria-controls")).classList.remove("is-visible");
    }
  });
  station.addEventListener("focus", () => showStation(station));
  station.addEventListener("blur", () => {
    if (station.dataset.openedByClick !== "true" && !station.matches(":hover")) {
      station.setAttribute("aria-expanded", "false");
      document.getElementById(station.getAttribute("aria-controls")).classList.remove("is-visible");
    }
  });
  station.addEventListener("click", () => {
    if (station.dataset.openedByClick === "true") {
      station.dataset.openedByClick = "false";
      station.setAttribute("aria-expanded", "false");
      document.getElementById(station.getAttribute("aria-controls")).classList.remove("is-visible");
      return;
    }
    closeStations();
    station.dataset.openedByClick = "true";
    showStation(station);
  });
});

const welcomeBanner = document.querySelector("#welcome-banner");
const welcomeClose = document.querySelector(".welcome-close");
let welcomeDismissed = sessionStorage.getItem("portfolio-welcome-dismissed") === "true";

function dismissWelcome() {
  welcomeDismissed = true;
  sessionStorage.setItem("portfolio-welcome-dismissed", "true");
  welcomeBanner.hidden = true;
}

welcomeClose.addEventListener("click", dismissWelcome);
document.querySelector(".welcome-start").addEventListener("click", dismissWelcome);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeStations();
  if (!welcomeBanner.hidden) dismissWelcome();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
window.setTimeout(() => {
  if (!welcomeDismissed) welcomeBanner.hidden = false;
}, reducedMotion.matches ? 0 : 1700);

document.querySelector("#year").textContent = String(new Date().getFullYear());
