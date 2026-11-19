const languageToggle = document.querySelector(".language-toggle");
const translatableElements = document.querySelectorAll("[data-en][data-es]");
const pageTitle = {
  en: "Joan De la Rosa — QA Engineer",
  es: "Joan De la Rosa — QA Engineer",
};

function setLanguage(language) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  for (const element of translatableElements) {
    const translation = element.dataset[language];
    if (!translation) continue;
    if (element instanceof HTMLMetaElement) {
      element.content = translation;
    } else {
      element.textContent = translation;
    }
  }

  const nextLanguage = language === "en" ? "es" : "en";
  languageToggle.textContent = nextLanguage.toUpperCase();
  languageToggle.setAttribute("aria-label", language === "en" ? "Cambiar idioma a español" : "Switch language to English");
  languageToggle.setAttribute("aria-pressed", String(language === "es"));
  document.title = pageTitle[language];
}

languageToggle.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "en" ? "es" : "en");
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
