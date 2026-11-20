const languageButtons = [...document.querySelectorAll("[data-language-choice]")];
const translatableElements = document.querySelectorAll("[data-en][data-es]");
const pageTitle = "Joan De la Rosa — QA Engineer";
const welcomeBanner = document.querySelector("#welcome-banner");
const welcomeMessage = document.querySelector("#welcome-message");
const welcomeCopy = {
  en: "Welcome to my QA test. Explore how I approach quality.",
  es: "Bienvenido a mi prueba de QA. Explora mi enfoque de calidad.",
};

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
  if (!welcomeBanner.hidden) welcomeMessage.textContent = welcomeCopy[language];
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
    document.getElementById(station.getAttribute("aria-controls")).setAttribute("aria-hidden", "true");
  });
  notes.forEach((note) => note.classList.remove("is-visible"));
}

function showStation(station) {
  stations.forEach((item) => {
    if (item !== station) {
      item.dataset.openedByClick = "false";
      item.setAttribute("aria-expanded", "false");
      const inactiveNote = document.getElementById(item.getAttribute("aria-controls"));
      inactiveNote.classList.remove("is-visible");
      inactiveNote.setAttribute("aria-hidden", "true");
    }
  });
  station.setAttribute("aria-expanded", "true");
  const activeNote = document.getElementById(station.getAttribute("aria-controls"));
  activeNote.setAttribute("aria-hidden", "false");
  activeNote.classList.add("is-visible");
}

function hideStationNote(station) {
  if (station.dataset.openedByClick === "true") return;
  station.setAttribute("aria-expanded", "false");
  const note = document.getElementById(station.getAttribute("aria-controls"));
  note.classList.remove("is-visible");
  note.setAttribute("aria-hidden", "true");
}

stations.forEach((station) => {
  station.dataset.openedByClick = "false";
  station.addEventListener("mouseenter", () => showStation(station));
  station.addEventListener("mouseleave", () => {
    if (document.activeElement !== station) hideStationNote(station);
  });
  station.addEventListener("focus", () => showStation(station));
  station.addEventListener("blur", () => {
    if (!station.matches(":hover")) hideStationNote(station);
  });
  station.addEventListener("click", () => {
    if (station.dataset.openedByClick === "true") {
      station.dataset.openedByClick = "false";
      station.setAttribute("aria-expanded", "false");
      const note = document.getElementById(station.getAttribute("aria-controls"));
      note.classList.remove("is-visible");
      note.setAttribute("aria-hidden", "true");
      return;
    }
    closeStations();
    station.dataset.openedByClick = "true";
    showStation(station);
  });
});

const welcomeClose = document.querySelector(".welcome-close");
const welcomeStart = document.querySelector(".welcome-start");
const introTitle = document.querySelector("#intro-title");
const flow = document.querySelector("#flow");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function readWelcomePreference() {
  try {
    return window.sessionStorage.getItem("portfolio-welcome-dismissed") === "true";
  } catch {
    return false;
  }
}

let welcomeDismissed = readWelcomePreference();

function dismissWelcome(focusTarget = null) {
  welcomeDismissed = true;
  try {
    window.sessionStorage.setItem("portfolio-welcome-dismissed", "true");
  } catch {
    // The banner can still be dismissed when storage is blocked.
  }
  if (focusTarget) focusTarget.focus({ preventScroll: true });
  welcomeBanner.hidden = true;
  welcomeMessage.textContent = "";
}

welcomeClose.addEventListener("click", () => {
  dismissWelcome(introTitle);
});
welcomeStart.addEventListener("click", (event) => {
  event.preventDefault();
  dismissWelcome(flow);
  flow.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!welcomeBanner.hidden) {
    dismissWelcome(welcomeBanner.contains(document.activeElement) ? introTitle : null);
    return;
  }
  closeStations();
});

window.setTimeout(() => {
  if (welcomeDismissed) return;
  welcomeBanner.hidden = false;
  window.requestAnimationFrame(() => {
    if (welcomeBanner.hidden) return;
    welcomeMessage.textContent = welcomeCopy[document.documentElement.dataset.language || "en"];
  });
}, reducedMotion.matches ? 0 : 1700);

document.querySelector("#year").textContent = String(new Date().getFullYear());
