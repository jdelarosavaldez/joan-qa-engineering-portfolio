const languageButtons = [...document.querySelectorAll("[data-language-choice]")];
const translatableElements = document.querySelectorAll("[data-en][data-es]");
const pageTitle = "Joan De la Rosa — QA Engineer";
let qaLabReady = false;
const welcomeBanner = document.querySelector("#welcome-banner");
const welcomeMessage = document.querySelector("#welcome-message");
const welcomeSlot = document.querySelector(".welcome-slot");
const welcomeCopy = {
  en: "Welcome to my QA test. Explore how I approach quality.",
  es: "Bienvenido a mi prueba de QA. Explora cómo abordo la calidad.",
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
  if (qaLabReady) renderQaLab(qaLabData);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.languageChoice));
});

const stations = [...document.querySelectorAll(".station")];
const notes = [...document.querySelectorAll(".station-notes p")];
let noteHideTimer;

function cancelNoteHide() {
  window.clearTimeout(noteHideTimer);
}

function scheduleNoteHide(station) {
  cancelNoteHide();
  if (station.dataset.openedByClick === "true") return;
  noteHideTimer = window.setTimeout(() => {
    const note = document.getElementById(station.getAttribute("aria-controls"));
    if (document.activeElement === station || station.matches(":hover") || note.matches(":hover")) return;
    hideStationNote(station);
  }, 500);
}

function closeStations() {
  stations.forEach((station) => {
    station.dataset.openedByClick = "false";
    station.setAttribute("aria-expanded", "false");
    document.getElementById(station.getAttribute("aria-controls")).setAttribute("aria-hidden", "true");
  });
  notes.forEach((note) => note.classList.remove("is-visible"));
}

function showStation(station) {
  cancelNoteHide();
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
  station.addEventListener("mouseleave", () => scheduleNoteHide(station));
  station.addEventListener("focus", () => showStation(station));
  station.addEventListener("blur", () => {
    if (station.dataset.openedByClick === "true") {
      if (station.dataset.notePointerDown === "true") return;
      station.dataset.openedByClick = "false";
      hideStationNote(station);
      return;
    }
    scheduleNoteHide(station);
  });
  station.addEventListener("click", () => {
    if (station.dataset.openedByClick === "true") {
      station.dataset.openedByClick = "false";
      hideStationNote(station);
      return;
    }
    closeStations();
    station.dataset.openedByClick = "true";
    showStation(station);
  });
});

notes.forEach((note) => {
  note.addEventListener("pointerdown", () => {
    const station = stations.find((item) => item.getAttribute("aria-controls") === note.id);
    if (station?.dataset.openedByClick === "true") station.dataset.notePointerDown = "true";
  });
  note.addEventListener("mouseenter", cancelNoteHide);
  note.addEventListener("mouseleave", () => {
    const station = stations.find((item) => item.getAttribute("aria-controls") === note.id);
    if (station) scheduleNoteHide(station);
  });
});

function restoreFocusAfterNotePress() {
  const station = stations.find((item) => item.dataset.notePointerDown === "true");
  if (!station) return;
  station.dataset.notePointerDown = "false";
  station.focus({ preventScroll: true });
}

document.addEventListener("pointerup", restoreFocusAfterNotePress);
document.addEventListener("pointercancel", restoreFocusAfterNotePress);

document.addEventListener("pointerdown", (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest(".station, .station-notes")) closeStations();
});

const welcomeClose = document.querySelector(".welcome-close");
const welcomeStart = document.querySelector(".welcome-start");
const welcomeValidate = document.querySelector(".welcome-validate");
const introTitle = document.querySelector("#intro-title");
const flow = document.querySelector("#flow");
const qaLab = document.querySelector("#qa-lab");
const qaLabTitle = document.querySelector("#qa-lab-title");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function readWelcomePreference() {
  try {
    return window.sessionStorage.getItem("portfolio-welcome-dismissed") === "true";
  } catch {
    return false;
  }
}

let welcomeDismissed = readWelcomePreference();
if (!welcomeDismissed) welcomeSlot.classList.add("is-reserved");

function dismissWelcome(focusTarget = null) {
  welcomeDismissed = true;
  try {
    window.sessionStorage.setItem("portfolio-welcome-dismissed", "true");
  } catch {
    // The banner can still be dismissed when storage is blocked.
  }
  if (focusTarget) focusTarget.focus({ preventScroll: true });
  welcomeBanner.hidden = true;
  welcomeSlot.classList.remove("is-reserved");
  welcomeMessage.textContent = "";
}

welcomeClose.addEventListener("click", () => {
  dismissWelcome(introTitle);
});
function followWelcomeLink(event, target, hash) {
  event.preventDefault();
  window.history.pushState(null, "", `#${hash}`);
  target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
}

welcomeStart.addEventListener("click", (event) => followWelcomeLink(event, flow, "flow"));
welcomeValidate.addEventListener("click", (event) => followWelcomeLink(event, qaLabTitle, "qa-lab"));

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!welcomeBanner.hidden && welcomeBanner.contains(document.activeElement)) {
    dismissWelcome(welcomeBanner.contains(document.activeElement) ? introTitle : null);
    return;
  }
  if (stations.some((station) => station.getAttribute("aria-expanded") === "true")) {
    closeStations();
    return;
  }
  if (!welcomeBanner.hidden) dismissWelcome();
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


const qaStatus = document.querySelector("#qa-status");
const qaRunMeta = document.querySelector("#qa-run-meta");
const qaRunLink = document.querySelector("#qa-run-link");
const qaPassed = document.querySelector("#qa-passed");
const qaFailed = document.querySelector("#qa-failed");
const qaSkipped = document.querySelector("#qa-skipped");
const qaFlaky = document.querySelector("#qa-flaky");
const qaDuration = document.querySelector("#qa-duration");
const qaChart = document.querySelector("#qa-history-chart");
const qaChartAxis = qaChart.querySelector(".qa-chart-axis");
const qaChartLine = qaChart.querySelector(".qa-chart-line");
const qaChartPoints = qaChart.querySelector(".qa-chart-points");
const qaHistoryList = document.querySelector("#qa-history-list");
const qaHistoryEmpty = document.querySelector("#qa-history-empty");
const qaEmpty = document.querySelector("#qa-empty");
const qaCaseList = document.querySelector("#qa-case-list");
const qaCaseEmpty = document.querySelector("#qa-case-empty");
const qaCaseCount = document.querySelector("#qa-case-count");
let qaCasesAnimated = false;
const qaRunDetails = document.querySelector("#qa-run-details");
let qaLabData = null;
let qaLabFeedInvalid = false;

function revealQaCasesOnce() {
  if (!qaRunDetails?.open || qaCasesAnimated || reducedMotion.matches || !qaCaseList.children.length) return;
  requestAnimationFrame(() => qaCaseList.classList.add("is-revealed"));
  qaCasesAnimated = true;
  window.setTimeout(() => qaCaseList.classList.remove("is-revealed"), 1000);
}
qaRunDetails?.addEventListener("toggle", revealQaCasesOnce);

const qaMessages = {
  en: { pending: "Pending", passed: "Passed", failed: "Failed", noResult: "Waiting for a published CI result.", missing: "The chart will appear after the next CI run on main.", runs: "Recent runs", chart: "CI outcomes from oldest to newest.", invalid: "The published result is not available yet.", historyEmpty: "No runs have been published yet.", caseEmpty: "No case details are included in this published run.", casesOne: "test case", casesMany: "test cases", casesTruncated: (count) => `Showing ${count} cases · more were omitted.`, caseStatus: { passed: "Passed", failed: "Failed", skipped: "Skipped", flaky: "Flaky" } },
  es: { pending: "Pendiente", passed: "Aprobado", failed: "Fallido", noResult: "Esperando un resultado publicado de CI.", missing: "El gráfico aparecerá después de la próxima ejecución de CI en main.", runs: "Ejecuciones recientes", chart: "Resultados de CI del más antiguo al más reciente.", invalid: "El resultado publicado aún no está disponible.", historyEmpty: "Aún no se han publicado ejecuciones.", caseEmpty: "Esta ejecución publicada no incluye detalles de casos.", casesOne: "caso de prueba", casesMany: "casos de prueba", casesTruncated: (count) => `Se muestran ${count} casos · se omitieron más.`, caseStatus: { passed: "Aprobado", failed: "Fallido", skipped: "Omitido", flaky: "Inestable" } },
};

function currentQaLanguage() {
  return document.documentElement.dataset.language === "es" ? "es" : "en";
}

function safeActionsUrl(value) {
  return typeof value === "string" && /^https:\/\/github\.com\/jdelarosavaldez\/joan-qa-engineering-portfolio\/actions\/runs\/\d+$/.test(value) ? value : null;
}

function formatQaDate(value, language) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { dateStyle: "medium" }).format(parsed);
}

function formatQaDuration(value, language) {
  if (!Number.isFinite(value) || value < 0) return "—";
  const seconds = Math.round(value / 1000);
  return language === "es" ? `${seconds} s` : `${seconds}s`;
}

function renderQaPending(language, invalid = false) {
  const messages = qaMessages[language];
  qaStatus.textContent = messages.pending;
  qaStatus.dataset.qaStatus = "pending";
  qaRunMeta.textContent = invalid ? messages.invalid : messages.noResult;
  qaRunLink.hidden = true;
  qaPassed.textContent = qaFailed.textContent = qaSkipped.textContent = qaFlaky.textContent = qaDuration.textContent = "—";
  qaHistoryList.replaceChildren();
  qaCaseList.replaceChildren();
  qaCaseCount.textContent = "—";
  qaCaseEmpty.hidden = false;
  qaCaseEmpty.textContent = qaMessages[language].caseEmpty;
  qaHistoryEmpty.hidden = false;
  qaHistoryEmpty.textContent = messages.historyEmpty;
  qaChart.setAttribute("hidden", "");
  qaEmpty.hidden = false;
  qaEmpty.textContent = invalid ? messages.invalid : messages.missing;
}

function renderQaLab(payload) {
  if (!qaStatus) return;
  const language = currentQaLanguage();
  const messages = qaMessages[language];
  const latest = [1, 2].includes(payload?.schemaVersion) ? payload.latestRun : null;

  if (!latest || !["success", "failure"].includes(latest.status)) {
    renderQaPending(language, qaLabFeedInvalid);
    return;
  }

  const isSuccess = latest.status === "success";
  qaStatus.textContent = isSuccess ? messages.passed : messages.failed;
  qaStatus.dataset.qaStatus = latest.status;
  const date = formatQaDate(latest.completedAt, language);
  const runLabel = Number.isInteger(latest.runNumber) && latest.runNumber > 0 ? "#" + latest.runNumber : null;
  qaRunMeta.textContent = [runLabel, date, latest.commit].filter(Boolean).join(" · ") || messages.noResult;

  const countsValid = ["passed", "failed", "skipped"].every((key) => Number.isInteger(latest[key]) && latest[key] >= 0);
  qaPassed.textContent = countsValid ? String(latest.passed) : "—";
  qaFailed.textContent = countsValid ? String(latest.failed) : "—";
  qaSkipped.textContent = countsValid ? String(latest.skipped) : "—";
  qaFlaky.textContent = Number.isInteger(latest.flaky) && latest.flaky >= 0 ? String(latest.flaky) : "—";
  qaDuration.textContent = Number.isFinite(latest.durationMs) ? formatQaDuration(latest.durationMs, language) : "—";

  const actionsUrl = safeActionsUrl(latest.actionsUrl);
  qaRunLink.hidden = !actionsUrl;
  if (actionsUrl) qaRunLink.href = actionsUrl;

  renderQaCases(latest.cases, language, latest.casesTruncated === true);
  const history = normalizeQaHistory(payload?.history);
  renderQaHistory(history, language);
}


function normalizeQaCases(value) {
  if (!Array.isArray(value)) return { cases: [], truncated: false };
  const validCases = value.filter((item) =>
    item &&
    ["passed", "failed", "skipped", "flaky"].includes(item.status) &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    (item.caseId === null || typeof item.caseId === "string") &&
    Number.isFinite(item.durationMs) &&
    item.durationMs >= 0
  );
  const truncated = validCases.length > 100;
  const cases = validCases.slice(0, 100).map((item) => ({
    caseId: typeof item.caseId === "string" ? item.caseId.slice(0, 48) : null,
    title: item.title.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, 180),
    status: item.status,
    durationMs: Math.round(item.durationMs),
  }));
  return { cases, truncated };
}

function formatQaCaseDuration(value, language) {
  if (!Number.isFinite(value) || value < 0) return "—";
  if (value < 1000) return language === "es" ? `${Math.round(value)} ms` : `${Math.round(value)}ms`;
  return formatQaDuration(value, language);
}

function renderQaCases(value, language, upstreamTruncated = false) {
  const normalized = normalizeQaCases(value);
  const cases = normalized.cases;
  const hasMoreCases = upstreamTruncated || normalized.truncated;
  qaCaseList.classList.remove("is-revealed");
  qaCaseList.replaceChildren();
  qaCaseCount.textContent = hasMoreCases
    ? qaMessages[language].casesTruncated(cases.length)
    : `${cases.length} ${cases.length === 1 ? qaMessages[language].casesOne : qaMessages[language].casesMany}`;
  qaCaseEmpty.hidden = cases.length > 0;
  qaCaseEmpty.textContent = qaMessages[language].caseEmpty;

  const fragment = document.createDocumentFragment();
  cases.forEach((testCase, index) => {
    const item = document.createElement("li");
    item.style.setProperty("--case-index", String(index));
    const caseId = document.createElement("code");
    caseId.className = "qa-case-id";
    caseId.textContent = testCase.caseId || "—";
    const title = document.createElement("span");
    title.className = "qa-case-title";
    title.textContent = testCase.title;
    const status = document.createElement("span");
    status.className = "qa-case-status";
    status.dataset.status = testCase.status;
    status.textContent = qaMessages[language].caseStatus[testCase.status];
    const duration = document.createElement("span");
    duration.className = "qa-case-duration";
    duration.textContent = formatQaCaseDuration(testCase.durationMs, language);
    item.append(caseId, title, status, duration);
    fragment.append(item);
  });
  qaCaseList.append(fragment);
  revealQaCasesOnce();
}

function normalizeQaHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) =>
      item &&
      Number.isInteger(item.runNumber) &&
      item.runNumber > 0 &&
      ["success", "failure"].includes(item.status) &&
      safeActionsUrl(item.actionsUrl)
    )
    .slice(0, 10);
}

function renderQaHistory(history, language) {
  qaHistoryList.replaceChildren();
  qaHistoryEmpty.hidden = history.length > 0;
  qaHistoryEmpty.textContent = qaMessages[language].historyEmpty;
  qaChartAxis.replaceChildren();
  qaChartPoints.replaceChildren();
  qaChartLine.setAttribute("points", "");
  if (!history.length) {
    qaChart.setAttribute("hidden", "");
    qaEmpty.hidden = false;
    qaEmpty.textContent = qaMessages[language].missing;
    return;
  }

  const ns = "http://www.w3.org/2000/svg";
  const xStart = 92;
  const xEnd = 402;
  const successY = 34;
  const failureY = 88;
  const points = [];
  const ordered = [...history].reverse();

  const topLabel = document.createElementNS(ns, "text");
  topLabel.setAttribute("x", String(xStart - 12)); topLabel.setAttribute("y", String(successY + 4));
  topLabel.setAttribute("text-anchor", "end");
  topLabel.textContent = qaMessages[language].passed;
  qaChartAxis.append(topLabel);
  const bottomLabel = document.createElementNS(ns, "text");
  bottomLabel.setAttribute("x", String(xStart - 12)); bottomLabel.setAttribute("y", String(failureY + 4));
  bottomLabel.setAttribute("text-anchor", "end");
  bottomLabel.textContent = qaMessages[language].failed;
  qaChartAxis.append(bottomLabel);
  for (const y of [successY, failureY]) {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", String(xStart)); line.setAttribute("x2", String(xEnd));
    line.setAttribute("y1", String(y)); line.setAttribute("y2", String(y));
    qaChartAxis.append(line);
  }

  ordered.forEach((run, index) => {
    const x = ordered.length === 1 ? (xStart + xEnd) / 2 : xStart + (xEnd - xStart) * index / (ordered.length - 1);
    const y = run.status === "success" ? successY : failureY;
    points.push(`${x},${y}`);
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", String(x)); circle.setAttribute("cy", String(y)); circle.setAttribute("r", "6");
    circle.setAttribute("class", "qa-chart-point"); circle.dataset.status = run.status;
    const title = document.createElementNS(ns, "title");
    title.textContent = `#${run.runNumber} · ${run.status === "success" ? qaMessages[language].passed : qaMessages[language].failed}`;
    circle.append(title); qaChartPoints.append(circle);

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = safeActionsUrl(run.actionsUrl);
    link.target = "_blank"; link.rel = "noreferrer";
    const label = run.status === "success" ? qaMessages[language].passed : qaMessages[language].failed;
    const runDate = formatQaDate(run.completedAt, language);
    link.textContent = `#${run.runNumber} · ${label}${runDate ? ` · ${runDate}` : ""}`;
    item.append(link); qaHistoryList.append(item);
  });

  qaChartLine.setAttribute("points", points.join(" "));
  qaChart.setAttribute("aria-label", qaMessages[language].chart);
  qaChart.removeAttribute("hidden");
  qaEmpty.hidden = true;
}

async function loadQaLab() {
  try {
    const response = await fetch("./data/qa-lab-results.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No published QA Lab data.");
    try {
      qaLabData = await response.json();
      qaLabFeedInvalid = !qaLabData ||
        typeof qaLabData !== "object" ||
        ![1, 2].includes(qaLabData.schemaVersion) ||
        (qaLabData.schemaVersion === 2 && qaLabData.latestRun !== null && !Array.isArray(qaLabData.latestRun?.cases)) ||
        !Object.hasOwn(qaLabData, "latestRun") ||
        !Array.isArray(qaLabData.history);
    } catch {
      qaLabData = null;
      qaLabFeedInvalid = true;
    }
  } catch {
    qaLabData = null;
    qaLabFeedInvalid = false;
  }



  renderQaLab(qaLabData);
}

qaLabReady = true;
loadQaLab();
