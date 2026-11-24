const languageButtons = [...document.querySelectorAll("[data-language-choice]")];
const translatableElements = document.querySelectorAll("[data-en][data-es]");
const pageTitle = "Joan De la Rosa — QA Engineer";
const welcomeBanner = document.querySelector("#welcome-banner");
const welcomeMessage = document.querySelector("#welcome-message");
const welcomeSlot = document.querySelector(".welcome-slot");
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
  if (qaLabData) renderQaLab(qaLabData); else renderQaPending(language);
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
welcomeStart.addEventListener("click", (event) => {
  event.preventDefault();
  dismissWelcome(flow);
  flow.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
});

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
const qaDuration = document.querySelector("#qa-duration");
const qaChart = document.querySelector("#qa-history-chart");
const qaChartAxis = qaChart.querySelector(".qa-chart-axis");
const qaChartLine = qaChart.querySelector(".qa-chart-line");
const qaChartPoints = qaChart.querySelector(".qa-chart-points");
const qaHistoryList = document.querySelector("#qa-history-list");
const qaEmpty = document.querySelector("#qa-empty");
let qaLabData = null;
let qaLiveRun = null;

const qaMessages = {
  en: { pending: "Pending", passed: "Passed", failed: "Failed", noResult: "Waiting for a published CI result.", missing: "The chart will appear after the next CI run on main.", run: "Run", on: "on", runs: "Recent runs", queued: "Queued", running: "Running", chart: "CI outcomes from oldest to newest.", invalid: "The published result is not available yet." },
  es: { pending: "Pendiente", passed: "Aprobado", failed: "Fallido", noResult: "Esperando un resultado publicado de CI.", missing: "El gráfico aparecerá después de la próxima ejecución de CI en main.", run: "Ejecución", on: "el", runs: "Ejecuciones recientes", queued: "En cola", running: "En curso", chart: "Resultados de CI del más antiguo al más reciente.", invalid: "El resultado publicado aún no está disponible." },
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
  qaPassed.textContent = qaFailed.textContent = qaSkipped.textContent = qaDuration.textContent = "—";
  qaHistoryList.replaceChildren();
  qaChart.hidden = true;
  qaEmpty.hidden = false;
  qaEmpty.textContent = invalid ? messages.invalid : messages.missing;
}

function renderQaLab(payload) {
  if (!qaStatus) return;
  const language = currentQaLanguage();
  const messages = qaMessages[language];
  const latest = payload?.schemaVersion === 1 ? payload.latestRun : null;

  if (qaLiveRun && (!latest?.completedAt || Date.parse(qaLiveRun.createdAt) > Date.parse(latest.completedAt))) {
    const activeLabel = qaLiveRun.status === "queued" ? messages.queued : messages.running;
    qaStatus.textContent = activeLabel;
    qaStatus.dataset.qaStatus = qaLiveRun.status;
    qaRunMeta.textContent = ["#" + qaLiveRun.runNumber, activeLabel, qaLiveRun.commit].filter(Boolean).join(" · ");
    qaPassed.textContent = qaFailed.textContent = qaSkipped.textContent = qaDuration.textContent = "—";
    const activeUrl = safeActionsUrl(qaLiveRun.actionsUrl);
    qaRunLink.hidden = !activeUrl;
    if (activeUrl) qaRunLink.href = activeUrl;
    const activeHistory = Array.isArray(payload?.history) ? payload.history : [];
    renderQaHistory(activeHistory, language);
    if (!activeHistory.length) qaEmpty.textContent = language === "es"
      ? "El historial aparecerá cuando finalice esta ejecución."
      : "History will appear when this run finishes.";
    return;
  }

  if (!latest || !["success", "failure"].includes(latest.status)) {
    renderQaPending(language, Boolean(payload));
    return;
  }

  const isSuccess = latest.status === "success";
  qaStatus.textContent = isSuccess ? messages.passed : messages.failed;
  qaStatus.dataset.qaStatus = latest.status;
  const date = formatQaDate(latest.completedAt, language);
  qaRunMeta.textContent = ["#" + latest.runNumber, date, latest.commit].filter(Boolean).join(" · ") || messages.noResult;

  const countsValid = ["passed", "failed", "skipped"].every((key) => Number.isInteger(latest[key]) && latest[key] >= 0);
  qaPassed.textContent = countsValid ? String(latest.passed) : "—";
  qaFailed.textContent = countsValid ? String(latest.failed) : "—";
  qaSkipped.textContent = countsValid ? String(latest.skipped) : "—";
  qaDuration.textContent = Number.isFinite(latest.durationMs) ? formatQaDuration(latest.durationMs, language) : "—";

  const actionsUrl = safeActionsUrl(latest.actionsUrl);
  qaRunLink.hidden = !actionsUrl;
  if (actionsUrl) qaRunLink.href = actionsUrl;

  const history = Array.isArray(payload?.history)
    ? payload.history.filter((item) => Number.isInteger(item.runNumber) && ["success", "failure"].includes(item.status) && safeActionsUrl(item.actionsUrl)).slice(0, 10)
    : [];
  renderQaHistory(history, language);
}

function renderQaHistory(history, language) {
  qaHistoryList.replaceChildren();
  qaChartAxis.replaceChildren();
  qaChartPoints.replaceChildren();
  qaChartLine.setAttribute("points", "");
  if (!history.length) {
    qaChart.hidden = true;
    qaEmpty.hidden = false;
    qaEmpty.textContent = qaMessages[language].missing;
    return;
  }

  const ns = "http://www.w3.org/2000/svg";
  const xStart = 42;
  const xEnd = 402;
  const successY = 34;
  const failureY = 88;
  const points = [];
  const ordered = [...history].reverse();

  const topLabel = document.createElementNS(ns, "text");
  topLabel.setAttribute("x", "0"); topLabel.setAttribute("y", String(successY + 4));
  topLabel.textContent = qaMessages[language].passed;
  qaChartAxis.append(topLabel);
  const bottomLabel = document.createElementNS(ns, "text");
  bottomLabel.setAttribute("x", "0"); bottomLabel.setAttribute("y", String(failureY + 4));
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
  qaChart.setAttribute("aria-label", `${qaMessages[language].chart} ${ordered.map((run) => `#${run.runNumber} ${run.status}`).join(", ")}`);
  qaChart.hidden = false;
  qaEmpty.hidden = true;
}

async function loadQaLab() {
  try {
    const response = await fetch("./data/qa-lab-results.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No published QA Lab data.");
    qaLabData = await response.json();
  } catch {
    qaLabData = null;
  }

  try {
    const response = await fetch("https://api.github.com/repos/jdelarosavaldez/joan-qa-engineering-portfolio/actions/workflows/portfolio-quality.yml/runs?branch=main&per_page=20", {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Live workflow state is unavailable.");
    const result = await response.json();
    const latest = qaLabData?.latestRun;
    const active = (result.workflow_runs || []).find((run) =>
      run.head_branch === "main" &&
      ["push", "workflow_dispatch"].includes(run.event) &&
      ["queued", "in_progress"].includes(run.status) &&
      (!latest?.completedAt || Date.parse(run.created_at) > Date.parse(latest.completedAt))
    );
    qaLiveRun = active ? {
      status: active.status,
      runNumber: Number(active.run_number),
      createdAt: active.created_at,
      commit: String(active.head_sha || "").slice(0, 7),
      actionsUrl: active.html_url,
    } : null;
  } catch {
    qaLiveRun = null;
  }

  renderQaLab(qaLabData);
}

loadQaLab();
