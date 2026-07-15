# MediLens AI — Medical Report Explainer & Doctor Summary Generator

MediLens AI is a privacy-first, client-side web application designed to help users upload, analyze, and understand their blood test/lab reports in plain, simple English. The application extracts clinical parameters, checks them against standard reference ranges, explains results safely, flags abnormal items for discussion, and generates printable summaries for doctor consultations.

## Key Features

1. **Local Text Extraction (OCR/PDF Reader)**: Reads text directly from uploaded PDFs (via `PDF.js`) or image scans (via `Tesseract.js`) locally. Documents never leave the user's machine.
2. **AI-Powered & Local Fallback Analysis**: Integrates directly with the `Gemini-2.5-flash` API for clinical parsing and interpretation. If no API key is set, the application automatically falls back to a regex-based keyword parser.
3. **Correction Editor**: In-browser data parser allowing users to double-check, modify, delete, or add parameters manually to verify accuracy before finalizing report summaries.
4. **Dynamic Results Explainer**: Interactive table showing value statuses. Click any row to expand educational details on what the biomarker does, what its status suggests, and custom questions.
5. **Printable Doctor Summary**: Generates a high-contrast printable document listing parameters (grouped by normal/abnormal), user notes, and discussion points. Includes a PII Redaction toggle to mask patient names/IDs.
6. **Chronological Trend Tracker**: Plots biomarker levels (such as Glucose, HbA1c, or TSH) over multiple reports on a line chart using `Chart.js` to view health patterns.
7. **Safe Sandbox Architecture**: All reports, configurations, and API keys are stored client-side in the user's browser using `localStorage` and `IndexedDB`. No server backend required.

---

## Safety & Medical Disclaimer Boundaries

MediLens AI is designed strictly for **educational and self-advocacy support**. It is built around strict safety rules:
- **No Diagnoses**: The application never names diseases, says a patient has a condition (e.g., "you have anemia"), or attempts to provide a clinical verdict.
- **No Prescriptions**: The application never references medicine, adjustments, or dosages.
- **Educational Framing**: High/low indicators explain what a biomarker generally does and directs patients to check results with a doctor. A prominent warning disclaimer banner is displayed on all views.

---

## Technology Stack

- **Frontend**: HTML5, CSS3 (Vanilla design tokens, responsive grid system, dark/light modes, animations).
- **Core Scripting**: Javascript (ES6+, Single Page Application state machine, routing, and event handlers).
- **Local Storage**: IndexedDB (reports data, history logs) & LocalStorage (Gemini API key, theme config).
- **Charting**: Chart.js (chronological tracking).
- **Parsing/OCR engines**: Tesseract.js (image scanning) & PDF.js (PDF reading).
- **Iconography**: Lucide Icons.

---

## Running the Application Locally

Since MediLens AI runs entirely in the browser, there are two simple ways to run it:

### Option 1: Double-Click
Simply open your directory and double-click [index.html](file:///c:/Users/Pavan/OneDrive/Desktop/MedicalReportscanner/index.html) to run it in any modern browser.

### Option 2: Local HTTP Server (Recommended)
To ensure all script features and API requests run smoothly, serve the directory using a simple local server:

**Using Python:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

**Using Node.js:**
```bash
npx serve
```
Then open the displayed local IP address.
