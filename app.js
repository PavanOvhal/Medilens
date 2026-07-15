// MediLens AI - Main Application Controller

// Global App State
const state = {
  activePage: "landing",
  apiKey: localStorage.getItem("medilens_api_key") || "",
  uploadedFile: null,
  rawText: "",
  parsedReport: null, // Holds current report structure
  ocrWords: [] // Bounding box spatial data
};

// DOM Elements
const pages = {};
const navLinks = {};
let themeToggleBtn = null;

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  // Map page elements
  document.querySelectorAll(".page-route").forEach(page => {
    pages[page.id] = page;
  });

  // Load API Key
  const keyInput = document.getElementById("api-key-input");
  if (keyInput) {
    keyInput.value = state.apiKey;
  }

  // Load Theme
  const savedTheme = localStorage.getItem("medilens_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  // Setup Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set initial page
  navigateTo("landing");



  // Attach Event Listeners
  attachEventListeners();
});

/**
 * SPA Router
 */
async function navigateTo(pageId) {
  state.activePage = pageId;

  // Toggle active pages
  Object.keys(pages).forEach(id => {
    if (id === pageId) {
      pages[id].classList.add("active");
    } else {
      pages[id].classList.remove("active");
    }
  });

  // Update Nav selection highlights
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Page specific life-cycle hooks
  if (pageId === "results") {
    renderResultsPage();
  } else if (pageId === "summary") {
    renderSummaryPage();
  }

  // Scroll to top
  window.scrollTo(0, 0);

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Theme Manager
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("medilens_theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  if (theme === "dark") {
    btn.innerHTML = `<i data-lucide="sun"></i>`;
  } else {
    btn.innerHTML = `<i data-lucide="moon"></i>`;
  }
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Event Listeners
 */
function attachEventListeners() {
  // Navigation Links
  document.querySelectorAll(".nav-link, .btn-nav").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const page = el.getAttribute("data-page");
      if (page) navigateTo(page);
    });
  });

  // Theme Toggle
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Save API Key
  const saveKeyBtn = document.getElementById("save-api-key");
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener("click", () => {
      const input = document.getElementById("api-key-input");
      state.apiKey = input.value.trim();
      localStorage.setItem("medilens_api_key", state.apiKey);
      showNotification("API key saved securely.");
    });
  }

  // Drag and Drop Zone
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");

  if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  // Consent checkbox & Analyze button state
  const consentCheckbox = document.getElementById("consent-checkbox");
  const startScanBtn = document.getElementById("start-scan-btn");

  if (consentCheckbox && startScanBtn) {
    consentCheckbox.addEventListener("change", () => {
      startScanBtn.disabled = !(state.uploadedFile && consentCheckbox.checked);
    });
  }

  // Start analysis trigger
  if (startScanBtn) {
    startScanBtn.addEventListener("click", startAnalysisFlow);
  }

  // Cancel file selection
  const removeFileBtn = document.getElementById("remove-file-btn");
  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", resetUploadState);
  }

  // Editor Actions
  const addRowBtn = document.getElementById("editor-add-row");
  if (addRowBtn) {
    addRowBtn.addEventListener("click", addEditorRow);
  }

  const runAnalysisBtn = document.getElementById("editor-analyze-btn");
  if (runAnalysisBtn) {
    runAnalysisBtn.addEventListener("click", processEditorValues);
  }

  // Redaction toggle in doctor summary
  const redactCheckbox = document.getElementById("redact-checkbox");
  if (redactCheckbox) {
    redactCheckbox.addEventListener("change", () => {
      renderSummaryPage();
    });
  }

  // Print Summary
  const printBtn = document.getElementById("print-summary-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Quick Sample buttons
  document.querySelectorAll(".sample-pick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const sampleId = btn.getAttribute("data-sample-id");
      loadSampleReport(sampleId);
    });
  });

  // Trends Biomarker dropdown change
  const trendSelect = document.getElementById("trend-biomarker-select");
  if (trendSelect) {
    trendSelect.addEventListener("change", (e) => {
      state.selectedTrendBiomarker = e.target.value;
      updateTrendsChart();
    });
  }

  // Handle "Upload Another" button clicks from warning banners
  document.querySelectorAll(".btn-upload-another").forEach(btn => {
    btn.addEventListener("click", () => {
      resetUploadState();
      navigateTo("upload");
    });
  });
}

/**
 * Upload management
 */
function handleFileSelect(file) {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "text/plain"];
  const allowedExts = [".pdf", ".jpg", ".jpeg", ".png", ".txt"];

  const fileType = file.type ? file.type.toLowerCase() : "";
  const fileName = file.name ? file.name.toLowerCase() : "";

  const isAllowedType = allowedTypes.includes(fileType);
  const isAllowedExt = allowedExts.some(ext => fileName.endsWith(ext));

  if (!isAllowedType && !isAllowedExt) {
    showNotification("Unsupported file format. Please upload PDF or image (JPG/PNG).", "error");
    return;
  }

  state.uploadedFile = file;

  // Render info
  document.getElementById("upload-file-name").textContent = file.name;
  document.getElementById("upload-file-size").textContent = formatBytes(file.size);
  document.getElementById("file-preview-card").style.display = "flex";
  document.getElementById("drop-zone").style.display = "none";

  // Check consent logic
  const consentCheckbox = document.getElementById("consent-checkbox");
  const startScanBtn = document.getElementById("start-scan-btn");
  startScanBtn.disabled = !consentCheckbox.checked;
}

function resetUploadState() {
  state.uploadedFile = null;
  document.getElementById("file-preview-card").style.display = "none";
  document.getElementById("drop-zone").style.display = "flex";
  document.getElementById("file-input").value = "";
  document.getElementById("start-scan-btn").disabled = true;
}

/**
 * Quick load samples
 */
function loadSampleReport(sampleId) {
  const sample = SAMPLE_REPORTS.find(r => r.id === sampleId);
  if (!sample) return;

  // Populate state with sample data
  state.parsedReport = JSON.parse(JSON.stringify(sample)); // Deep copy
  state.parsedReport.id = "report-" + Date.now(); // Give it a fresh unique local ID
  state.parsedReport.date = new Date().toISOString().split("T")[0]; // set to today's date for current tracking
  state.rawText = sample.rawText;

  showNotification(`Loaded sample: ${sample.title}`);

  // Transition to results page
  showScanningOverlay(async (progressCallback) => {
    progressCallback(20, "Reading simulated medical records...");
    await sleep(400);
    progressCallback(50, "Parsing values and reference limits...");
    await sleep(400);
    progressCallback(80, "Applying safety filters and warnings...");
    await sleep(300);
    progressCallback(100, "Done!");
    await sleep(200);

    navigateTo("results");
  });
}

/**
 * Text extraction and scan runner
 */
async function startAnalysisFlow() {
  if (!state.uploadedFile) return;

  const file = state.uploadedFile;
  showScanningOverlay(async (progressCallback) => {
    try {
      progressCallback(15, "Reading file layers...");

      let ocrResult = { text: "", words: [] };
      const fileType = file.type ? file.type.toLowerCase() : "";
      const fileName = file.name ? file.name.toLowerCase() : "";

      if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        const text = await file.text();
        ocrResult = { text: text, words: [] };
      } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        ocrResult = await extractPdfText(file, progressCallback);
      } else if (fileType.startsWith("image/") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png")) {
        ocrResult = await extractImageText(file, progressCallback);
      }

      state.rawText = ocrResult.text.trim();
      state.ocrWords = ocrResult.words || [];

      if (!state.rawText) {
        throw new Error("No readable text could be extracted from this document. Please ensure it's not a blurry image or empty file.");
      }

      progressCallback(60, "Structuring extracted lab values...");

      if (state.apiKey) {
        // AI analysis
        try {
          const aiResult = await analyzeReportWithGemini(state.rawText, state.apiKey);
          state.parsedReport = {
            id: "report-" + Date.now(),
            patientName: aiResult.patientName || "Unknown Patient",
            patientAge: aiResult.patientAge || null,
            patientId: aiResult.patientId || "Unknown ID",
            date: aiResult.date || new Date().toISOString().split("T")[0],
            type: aiResult.type || "General",
            title: (aiResult.type || "General") + " Lab Report",
            labValues: aiResult.labValues || [],
            summary: aiResult.summary || "Report parsed successfully.",
            doctorQuestions: aiResult.doctorQuestions || [],
            isMedicalReport: aiResult.isMedicalReport !== false
          };
        } catch (aiErr) {
          console.warn("Gemini AI parse failed, falling back to local regex extraction:", aiErr);
          showNotification("AI Analysis failed. Falling back to local rules-based extraction.", "warning");
          runLocalRegexAnalysis();
        }
      } else {
        // Local rules based analysis
        await sleep(500);
        runLocalRegexAnalysis();
      }

      progressCallback(85, "Completing ranges validation...");
      await sleep(300);
      progressCallback(100, "Done!");
      await sleep(200);

      // Save to editor view so user can correct
      renderCorrectionEditor();
      navigateTo("editor");

    } catch (err) {
      console.error(err);
      showNotification(err.message, "error");
      hideScanningOverlay();
    }
  });
}

/**
 * Local Fallback parser runner
 */
function runLocalRegexAnalysis() {
  let values = [];

  if (state.ocrWords && state.ocrWords.length > 0) {
    try {
      values = parseSpatialLayout(state.ocrWords);
    } catch (spatialErr) {
      console.warn("Spatial parsing failed, falling back to regex:", spatialErr);
    }
  }

  // Fall back to regex parser if spatial parser found nothing
  if (!values || values.length === 0) {
    values = localRegexParse(state.rawText);
  }

  // Try to determine page test type based on keywords
  let type = "General";
  const lowerText = state.rawText.toLowerCase();
  if (lowerText.includes("thyroid") || lowerText.includes("tsh")) type = "Thyroid";
  else if (lowerText.includes("cbc") || lowerText.includes("hemoglobin") || lowerText.includes("blood count")) type = "CBC";
  else if (lowerText.includes("glucose") || lowerText.includes("hba1c") || lowerText.includes("diabetes")) type = "Diabetes";
  else if (lowerText.includes("lipid") || lowerText.includes("cholesterol")) type = "Lipid Profile";
  else if (lowerText.includes("vitamin d") || lowerText.includes("vitamin b12")) type = "Vitamin";
  else if (lowerText.includes("urine") || lowerText.includes("urinalysis") || lowerText.includes("specific gravity")) type = "Urinalysis";
  else if (lowerText.includes("stool") || lowerText.includes("fecal") || lowerText.includes("occult blood")) type = "Fecal Analysis";

  // Extract patient age using regex
  let age = null;
  const ageMatch = state.rawText.match(/\b(?:age|age\/sex)\s*:\s*(\d+)/i) ||
    state.rawText.match(/\b(\d+)\s*(?:years|yrs|y\/o|y)\b/i);
  if (ageMatch) {
    age = parseInt(ageMatch[1]);
  }

  const isMedical = isLikelyMedicalReport(state.rawText, values);

  state.parsedReport = {
    id: "report-" + Date.now(),
    patientName: "Unknown Patient",
    patientAge: age,
    patientId: "Unknown ID",
    date: new Date().toISOString().split("T")[0],
    type: type,
    title: `${type} Lab Report (Local Mode)`,
    labValues: values,
    summary: isMedical ? "" : "Warning: This file does not appear to be a standard medical lab report. Please check the parameters.",
    doctorQuestions: [], // Generated after review
    isMedicalReport: isMedical
  };
}

/**
 * PDF extraction helper (PDF.js)
 */
async function extractPdfText(file, progressCallback) {
  if (typeof pdfjsLib === "undefined") {
    throw new Error("PDF.js library is not loaded. Check internet connection.");
  }

  progressCallback(25, "Loading PDF engine...");

  const arrayBuffer = await file.arrayBuffer();
  // Configure PDFJS worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    progressCallback(25 + Math.floor((i / pdf.numPages) * 20), `Reading PDF page ${i} of ${pdf.numPages}...`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }

  let ocrWords = [];

  // Scanned PDF detection
  if (fullText.trim().length < 150) {
    progressCallback(45, "Scanned PDF detected. Starting local OCR scanner (this may take a few seconds)...");

    if (typeof Tesseract === "undefined") {
      throw new Error("Tesseract.js engine is not loaded. Check internet connection.");
    }

    const worker = await Tesseract.createWorker("eng");
    let ocrText = "";
    let cumulativeHeight = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      progressCallback(
        45 + Math.floor((i / pdf.numPages) * 45),
        `Scanning text from PDF page ${i} of ${pdf.numPages}...`
      );
      const page = await pdf.getPage(i);

      // Render PDF page to a canvas at a standard resolution scale of 1.5
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Perform OCR on canvas image
      const ret = await worker.recognize(canvas);
      ocrText += ret.data.text + "\n";

      if (ret.data.words) {
        const pageOffset = cumulativeHeight;
        const adjustedWords = ret.data.words.map(w => ({
          text: w.text,
          confidence: w.confidence,
          bbox: {
            x0: w.bbox.x0,
            x1: w.bbox.x1,
            y0: w.bbox.y0 + pageOffset,
            y1: w.bbox.y1 + pageOffset
          }
        }));
        ocrWords.push(...adjustedWords);
      }
      cumulativeHeight += viewport.height;
    }

    await worker.terminate();
    fullText = ocrText;
  }

  return {
    text: fullText,
    words: ocrWords
  };
}

/**
 * Image OCR helper (Tesseract.js)
 */
async function extractImageText(file, progressCallback) {
  if (typeof Tesseract === "undefined") {
    throw new Error("Tesseract.js engine is not loaded. Check internet connection.");
  }

  progressCallback(20, "Initializing local OCR scanner...");

  const worker = await Tesseract.createWorker("eng");

  progressCallback(35, "Scanning text lines (this may take a few seconds)...");

  const ret = await worker.recognize(file);
  await worker.terminate();
  return {
    text: ret.data.text,
    words: ret.data.words || []
  };
}

/**
 * Scanning animation triggers
 */
function showScanningOverlay(action) {
  const overlay = document.getElementById("scanning-overlay");
  const progressFill = document.getElementById("scan-progress-fill");
  const progressText = document.getElementById("scan-progress-text");

  overlay.classList.add("active");
  progressFill.style.width = "0%";
  progressText.textContent = "Beginning scan...";

  const updateProgress = (percentage, label) => {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = label;
  };

  setTimeout(() => {
    action(updateProgress).then(() => {
      hideScanningOverlay();
    }).catch(err => {
      console.error(err);
      hideScanningOverlay();
      showNotification(err.message, "error");
    });
  }, 200);
}

function hideScanningOverlay() {
  document.getElementById("scanning-overlay").classList.remove("active");
}

/**
 * Correction Editor render & processor
 */
function renderCorrectionEditor() {
  const editorBody = document.getElementById("editor-tbody");
  editorBody.innerHTML = "";

  document.getElementById("editor-patient-name").value = state.parsedReport.patientName;
  document.getElementById("editor-patient-age").value = state.parsedReport.patientAge || "";
  document.getElementById("editor-report-date").value = state.parsedReport.date;

  const rawTextEl = document.getElementById("editor-raw-text");
  if (rawTextEl) {
    rawTextEl.textContent = state.rawText;
  }

  // Toggle warning banner
  const warningBanner = document.getElementById("editor-warning-banner");
  if (warningBanner) {
    warningBanner.style.display = state.parsedReport.isMedicalReport === false ? "flex" : "none";
  }

  if (state.parsedReport.labValues.length === 0) {
    addEditorRow(); // Add empty starting row
  } else {
    state.parsedReport.labValues.forEach((item, index) => {
      addEditorRow(item);
    });
  }
}

function addEditorRow(data = { name: "", value: "", unit: "", referenceRange: "" }) {
  const editorBody = document.getElementById("editor-tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="text" class="edit-name" value="${data.name}" placeholder="e.g. Hemoglobin"></td>
    <td><input type="text" class="edit-value" value="${data.value}" placeholder="e.g. 13.5"></td>
    <td><input type="text" class="edit-unit" value="${data.unit}" placeholder="e.g. g/dL"></td>
    <td><input type="text" class="edit-range" value="${data.referenceRange}" placeholder="e.g. 12 - 16"></td>
    <td>
      <button class="btn-icon btn-danger btn-row-delete" style="width: 32px; height: 32px;">
        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
      </button>
    </td>
  `;

  // Attach delete logic
  tr.querySelector(".btn-row-delete").addEventListener("click", () => {
    tr.remove();
    if (editorBody.children.length === 0) {
      addEditorRow();
    }
  });

  editorBody.appendChild(tr);
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Editor form parsing and calculations
 */
async function processEditorValues() {
  const rows = document.querySelectorAll("#editor-tbody tr");
  const values = [];
  const ageVal = document.getElementById("editor-patient-age").value.trim();
  const patientAge = ageVal ? parseInt(ageVal) : null;

  rows.forEach(row => {
    const name = row.querySelector(".edit-name").value.trim();
    const value = row.querySelector(".edit-value").value.trim();
    const unit = row.querySelector(".edit-unit").value.trim();
    const refRange = row.querySelector(".edit-range").value.trim();

    if (name && value) {
      values.push({
        name: name,
        value: parseFloat(value) || value,
        unit: unit,
        referenceRange: refRange,
        flag: evaluateValue(name, value, refRange, patientAge)
      });
    }
  });

  // Update report structure
  state.parsedReport.patientName = document.getElementById("editor-patient-name").value.trim() || "Unknown Patient";
  state.parsedReport.patientAge = patientAge;
  state.parsedReport.date = document.getElementById("editor-report-date").value || new Date().toISOString().split("T")[0];
  state.parsedReport.labValues = values;

  // Generate safe educational summary and questions
  const abnormalItems = values.filter(v => v.flag !== "Normal");

  if (state.apiKey && state.apiKey.trim() !== "") {
    // Re-run AI interpretation over corrected values if user wishes
    showScanningOverlay(async (progressCallback) => {
      progressCallback(30, "Generating personalized AI explanations...");
      try {
        const prompt = `Interpret the following corrected medical values. Create a short patient summary (educational, non-diagnostic, strictly neutral) and 3 questions for a doctor.
Values: ${JSON.stringify(values)}
Return a JSON object:
{
  "summary": "Plain English summary here. Say 'This is educational. Please confirm with a doctor.'",
  "questions": ["Question 1", "Question 2", "Question 3"]
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
        });

        if (response.ok) {
          const resJson = await response.json();
          const parsed = JSON.parse(resJson.candidates[0].content.parts[0].text.trim());
          state.parsedReport.summary = parsed.summary;
          state.parsedReport.doctorQuestions = parsed.questions;
        } else {
          throw new Error("AI Summary failed");
        }
      } catch (e) {
        generateLocalSummary(abnormalItems);
      }
      progressCallback(100, "Done!");

      resetUploadState();
      navigateTo("results");
    });
  } else {
    // Generate local summary
    generateLocalSummary(abnormalItems);
    resetUploadState();
    navigateTo("results");
  }
}

function generateLocalSummary(abnormalItems) {
  let summary = "";
  const questions = [];

  if (abnormalItems.length === 0) {
    summary = "All analyzed lab values fall within their typical standard reference ranges. This suggests general balance across the tested metabolic indices. Keep in mind that clinical trends should always be reviewed alongside personal symptoms with a physician.";
    questions.push(
      "What are the key goals I should focus on to maintain these optimal levels?",
      "Are there specific vitamins or dietary checks you recommend for my age group?"
    );
  } else {
    summary = `Your report has flagged ${abnormalItems.length} value(s) that are outside standard reference ranges: ${abnormalItems.map(i => `${i.name} (${i.value} ${i.unit})`).join(", ")}. These deviations can arise from multiple factors including hydration, minor diet swings, immune stresses, or baseline metabolic traits. Please note that this summary is educational and does not constitute a diagnosis. Always confirm with your primary care provider.`;

    abnormalItems.forEach(item => {
      questions.push(`Why is my ${item.name} currently flagged as ${item.flag} (${item.value} ${item.unit})?`);
    });
    questions.push("Would you recommend repeating this test or carrying out additional diagnostic checks?");
    questions.push("Are there lifestyle or dietary adjustments that could help balance these specific markers?");
  }

  state.parsedReport.summary = summary;
  state.parsedReport.doctorQuestions = questions;
}

/**
 * Results page rendering
 */
function renderResultsPage() {
  const report = state.parsedReport;
  if (!report) return;

  document.getElementById("results-title").textContent = report.title || "Lab Report Analysis";
  document.getElementById("results-patient").textContent = report.patientName + (report.patientAge ? ` (Age: ${report.patientAge})` : "");
  document.getElementById("results-id").textContent = report.patientId;
  document.getElementById("results-date").textContent = formatDate(report.date);

  // Toggle results warning banner
  const warningBanner = document.getElementById("results-warning-banner");
  if (warningBanner) {
    warningBanner.style.display = report.isMedicalReport === false ? "flex" : "none";
  }

  // Render Table
  const tbody = document.getElementById("results-tbody");
  tbody.innerHTML = "";

  report.labValues.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-index", index);

    // Evaluate flag class
    const flag = item.flag || evaluateValue(item.name, item.value, item.referenceRange, report.patientAge);
    let badgeClass = "badge-normal";
    if (flag === "High") badgeClass = "badge-high";
    if (flag === "Low") badgeClass = "badge-low";
    if (flag === "Check with doctor") badgeClass = "badge-check";

    tr.innerHTML = `
      <td style="font-weight:600;">${item.name}</td>
      <td style="font-family: monospace; font-size:1.05rem;">${item.value}</td>
      <td style="color:var(--text-secondary);">${item.unit || ""}</td>
      <td style="font-family: monospace; color:var(--text-secondary);">${item.referenceRange || ""}</td>
      <td><span class="badge ${badgeClass}">${flag}</span></td>
    `;

    tr.addEventListener("click", () => {
      document.querySelectorAll("#results-tbody tr").forEach(r => r.classList.remove("active"));
      tr.classList.add("active");
      showBiomarkerExplanation(item);
    });

    tbody.appendChild(tr);
  });

  // Select first row automatically
  if (report.labValues.length > 0) {
    setTimeout(() => {
      const firstRow = tbody.querySelector("tr");
      if (firstRow) firstRow.click();
    }, 100);
  }

  // Summary Card text
  document.getElementById("results-summary-text").textContent = report.summary;

  // Generate Potential Disease Alerts
  const warningsList = document.getElementById("disease-warnings-list");
  const warningsContainer = document.getElementById("disease-warnings-container");

  if (warningsList && warningsContainer) {
    warningsList.innerHTML = "";
    const activeWarnings = [];

    // Check flags for clinical triggers
    const abnormalMap = {};
    report.labValues.forEach(item => {
      const flag = item.flag || evaluateValue(item.name, item.value, item.referenceRange, report.patientAge);
      if (flag !== "Normal") {
        abnormalMap[item.name.toLowerCase().trim()] = flag;
      }
    });

    const hasLow = (name) => {
      return Object.keys(abnormalMap).some(k => (k.includes(name) || k === name) && abnormalMap[k] === "Low");
    };
    const hasHigh = (name) => {
      return Object.keys(abnormalMap).some(k => (k.includes(name) || k === name) && abnormalMap[k] === "High");
    };

    // 1. Anemia Risk
    if (hasLow("hemoglobin") || hasLow("hb") || hasLow("rbc") || hasLow("hematocrit")) {
      activeWarnings.push(`
        <strong>Anemia Warning:</strong> Your low hemoglobin or red blood cell count points to a potential risk of 
        <span style="color:#ef4444; font-weight:600;">Anemia</span>. This can reduce oxygen transport, resulting in fatigue or weakness.
      `);
    }

    // 2. Thyroid Risk
    if (hasHigh("tsh")) {
      activeWarnings.push(`
        <strong>Hypothyroidism Warning:</strong> Your high Thyroid Stimulating Hormone (TSH) level points to a potential risk of 
        <span style="color:#ef4444; font-weight:600;">Hypothyroidism (Underactive Thyroid)</span>. The pituitary gland is over-signaling a sluggish thyroid.
      `);
    } else if (hasLow("tsh")) {
      activeWarnings.push(`
        <strong>Hyperthyroidism Warning:</strong> Your low Thyroid Stimulating Hormone (TSH) level points to a potential risk of 
        <span style="color:#ef4444; font-weight:600;">Hyperthyroidism (Overactive Thyroid)</span>. The pituitary gland is under-signaling an over-active thyroid.
      `);
    }

    // 3. Diabetes / Metabolic Risk
    if (hasHigh("glucose") || hasHigh("sugar") || hasHigh("hba1c") || hasHigh("a1c")) {
      activeWarnings.push(`
        <strong>Blood Sugar (Diabetes) Warning:</strong> Your elevated glucose or HbA1c levels suggest a potential risk of 
        <span style="color:#ef4444; font-weight:600;">Prediabetes or Diabetes</span>. This suggests reduced efficiency in carbohydrate clearance and insulin regulation.
      `);
    }

    // 4. Lipid / Cholesterol Risk
    if (hasHigh("total cholesterol") || hasHigh("ldl") || hasHigh("triglyceride") || hasLow("hdl")) {
      activeWarnings.push(`
        <strong>Hyperlipidemia Warning:</strong> Elevated LDL/total cholesterol or low HDL levels point to a potential risk of 
        <span style="color:#ef4444; font-weight:600;">Hyperlipidemia (High Blood Lipids)</span>. Over time, high lipids can raise cardiovascular plaque buildup risks.
      `);
    }

    // 5. Infection / Inflammation Risk
    if (hasHigh("wbc") || hasHigh("white blood cell") || hasHigh("leukocyte")) {
      activeWarnings.push(`
        <strong>Infection / Inflammation Warning:</strong> An elevated White Blood Cell count suggests an active immune response, commonly pointing to 
        <span style="color:#ef4444; font-weight:600;">Infection, Acute Inflammation</span>, or high physical stress.
      `);
    }

    // 6. Kidney Stress (Proteinuria)
    if (hasHigh("urine protein")) {
      activeWarnings.push(`
        <strong>Kidney Stress Warning:</strong> The presence of elevated protein in your urine suggests potential 
        <span style="color:#ef4444; font-weight:600;">Kidney Filtration Stress (Proteinuria)</span>. This warrants a clinical evaluation of kidney function.
      `);
    }

    // 7. Dehydration
    if (hasHigh("specific gravity")) {
      activeWarnings.push(`
        <strong>Dehydration Warning:</strong> Elevated Urine Specific Gravity suggests a risk of 
        <span style="color:#ef4444; font-weight:600;">Dehydration</span>. Your urine is highly concentrated, indicating you should increase fluid intake.
      `);
    }

    // 8. Gastrointestinal Bleeding
    if (hasHigh("occult blood")) {
      activeWarnings.push(`
        <strong>Gastrointestinal Bleeding Warning:</strong> A positive Stool Occult Blood test indicates traces of hidden blood, pointing to a potential risk of 
        <span style="color:#ef4444; font-weight:600;">Gastrointestinal Bleeding</span> (e.g., from hemorrhoids, ulcers, polyps, or gut inflammation).
      `);
    }

    if (activeWarnings.length > 0) {
      warningsContainer.style.display = "block";
      activeWarnings.forEach(wHtml => {
        const li = document.createElement("li");
        li.style.padding = "0.25rem 0";
        li.innerHTML = wHtml;
        warningsList.appendChild(li);
      });
    } else {
      warningsContainer.style.display = "none";
    }
  }
}

function showBiomarkerExplanation(item) {
  const age = state.parsedReport ? state.parsedReport.patientAge : null;
  const flag = item.flag || evaluateValue(item.name, item.value, item.referenceRange, age);
  const expl = getEducationalExplanation(item.name, flag, age);

  document.getElementById("expl-name").textContent = item.name;
  document.getElementById("expl-val").textContent = `${item.value} ${item.unit || ""}`;

  let badgeClass = "badge-normal";
  if (flag === "High") badgeClass = "badge-high";
  if (flag === "Low") badgeClass = "badge-low";
  if (flag === "Check with doctor") badgeClass = "badge-check";

  document.getElementById("expl-badge-wrap").innerHTML = `<span class="badge ${badgeClass}">${flag}</span>`;
  document.getElementById("expl-text").textContent = expl;

  // Custom question suggestions
  const qList = document.getElementById("expl-questions");
  qList.innerHTML = "";

  const questions = [
    `What causes a ${flag.toLowerCase()} level of ${item.name}?`,
    `Could my daily routine or diet be affecting my ${item.name} level?`
  ];

  questions.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    li.style.fontSize = "0.9rem";
    li.style.marginBottom = "0.4rem";
    qList.appendChild(li);
  });

  // Pulse effect
  const card = document.getElementById("explanation-card");
  card.classList.add("highlight");
  setTimeout(() => card.classList.remove("highlight"), 500);
}

/**
 * Summary (Printable doctor sheet) rendering
 */
function renderSummaryPage() {
  const report = state.parsedReport;
  if (!report) return;

  const redactCheckbox = document.getElementById("redact-checkbox");
  const isRedacted = redactCheckbox ? redactCheckbox.checked : false;

  // Toggle warning banner
  const sumWarning = document.getElementById("sum-warning-text");
  if (sumWarning) {
    sumWarning.style.display = report.isMedicalReport === false ? "block" : "none";
  }

  // Header Details
  document.getElementById("sum-title").textContent = report.title || "Medical Summary";
  document.getElementById("sum-patient-name").textContent = isRedacted ? "[REDACTED]" : report.patientName + (report.patientAge ? ` (Age: ${report.patientAge})` : "");
  document.getElementById("sum-patient-id").textContent = isRedacted ? "[REDACTED]" : report.patientId;
  document.getElementById("sum-report-date").textContent = formatDate(report.date);

  // Table
  const tableBody = document.getElementById("sum-table-body");
  tableBody.innerHTML = "";

  const abnormalValues = report.labValues.filter(v => v.flag !== "Normal");
  const normalValues = report.labValues.filter(v => v.flag === "Normal");

  const appendToSummaryTable = (item) => {
    const tr = document.createElement("tr");
    const flag = item.flag || evaluateValue(item.name, item.value, item.referenceRange);

    let badgeClass = "badge-normal";
    if (flag === "High") badgeClass = "badge-high";
    if (flag === "Low") badgeClass = "badge-low";
    if (flag === "Check with doctor") badgeClass = "badge-check";

    tr.innerHTML = `
      <td style="font-weight:600;">${item.name}</td>
      <td style="font-family: monospace;">${item.value}</td>
      <td>${item.unit || ""}</td>
      <td style="font-family: monospace;">${item.referenceRange || ""}</td>
      <td><span class="badge ${badgeClass}">${flag}</span></td>
    `;
    tableBody.appendChild(tr);
  };

  // List abnormal first for clear doctor readability
  if (abnormalValues.length > 0) {
    const dividerRow = document.createElement("tr");
    dividerRow.innerHTML = `<td colspan="5" style="background-color:#fff1f2; font-weight:700; color:#9f1239; padding: 0.5rem 1.5rem; text-transform:uppercase; font-size:0.75rem; border-bottom:1px solid #fecaca;">OUTSIDE TYPICAL RANGES</td>`;
    tableBody.appendChild(dividerRow);
    abnormalValues.forEach(appendToSummaryTable);
  }

  if (normalValues.length > 0) {
    const dividerRow = document.createElement("tr");
    dividerRow.innerHTML = `<td colspan="5" style="background-color:#f0fdf4; font-weight:700; color:#166534; padding: 0.5rem 1.5rem; text-transform:uppercase; font-size:0.75rem; border-bottom:1px solid #bbf7d0;">EXPECTED STANDARD RANGES</td>`;
    tableBody.appendChild(dividerRow);
    normalValues.forEach(appendToSummaryTable);
  }

  // Summary Text block
  document.getElementById("sum-ai-summary").textContent = report.summary;

  // Doctor Questions
  const qList = document.getElementById("sum-questions-list");
  qList.innerHTML = "";

  const questions = report.doctorQuestions && report.doctorQuestions.length > 0
    ? report.doctorQuestions
    : ["What steps should I take next to optimize these levels?"];

  questions.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    qList.appendChild(li);
  });
}

/**
 * History Page rendering
 */


/**
 * Utility Helpers
 */
function showNotification(message, type = "success") {
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.className = "notification";

  let icon = '<i data-lucide="check-circle"></i>';
  if (type === "error") {
    container.style.backgroundColor = "#ef4444";
    icon = '<i data-lucide="alert-octagon"></i>';
  } else if (type === "warning") {
    container.style.backgroundColor = "#f59e0b";
    icon = '<i data-lucide="alert-triangle"></i>';
  }

  container.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  document.body.appendChild(container);

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  setTimeout(() => {
    container.style.animation = "slideInUp 0.3s ease reverse forwards";
    setTimeout(() => container.remove(), 300);
  }, 3500);
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
