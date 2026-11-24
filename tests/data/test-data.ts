export const portfolioTestData = {
  en: {
    title: "Joan De la Rosa — QA Engineer",
    name: "Joan De la Rosa",
    role: "QA Engineer · SDET · Quality Engineering",
    intro: "I’m a QA Engineer with years of experience in both manual and automated testing.",
    aboutHeading: "About my work",
    aboutLink: "More about my work",
    stations: ["Strategy", "Manual testing", "Automation", "Quality throughout"],
  },
  es: {
    title: "Joan De la Rosa — QA Engineer",
    name: "Joan De la Rosa",
    role: "QA Engineer · SDET · Ingeniería de Calidad",
    intro: "Soy ingeniero de QA con años de experiencia en pruebas manuales y automatizadas.",
    aboutHeading: "Sobre mi trabajo",
    aboutLink: "Más sobre mi trabajo",
    stations: ["Estrategia", "Pruebas manuales", "Automatización", "Calidad continua"],
  },
} as const;

export type PortfolioLanguage = keyof typeof portfolioTestData;
