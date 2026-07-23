<div align="center">

# 🩺 MediLens AI

### Privacy-First Medical Report Explainer & Doctor Summary Generator

MediLens AI transforms complex blood-test and laboratory reports into clear, structured, and easy-to-understand health information—directly inside the browser.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_MediLens-2563EB?style=for-the-badge\&logo=vercel\&logoColor=white)](https://medilens-blond.vercel.app/)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Privacy First](https://img.shields.io/badge/Privacy-Client_Side-16A34A?style=for-the-badge\&logo=shield\&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Gemini_2.5_Flash-8B5CF6?style=for-the-badge\&logo=google\&logoColor=white)

**[View Live Application](https://medilens-blond.vercel.app/)**

</div>

---

## 📌 Overview

**MediLens AI** is a privacy-first, client-side medical report analysis application that helps users understand blood-test and laboratory reports in plain English.

The application uses **PDF.js** and **Tesseract.js** to extract report data locally, while **Gemini 2.5 Flash** provides structured clinical parameter parsing and educational explanations. A built-in regex parser ensures the core analysis remains available even without an AI API key.

MediLens AI does not diagnose diseases or prescribe treatment. It is designed to help users review their reports, identify discussion points, and prepare structured summaries for doctor consultations.

---

## ✨ Key Features

### 📄 Local PDF and Image Extraction

Upload laboratory reports in PDF or image format. Text extraction is performed directly inside the browser using:

* **PDF.js** for digital PDF reports
* **Tesseract.js** for scanned reports and images
* Local processing without uploading documents to an external server

### 🤖 AI-Powered Report Analysis

MediLens AI integrates with **Gemini 2.5 Flash** to:

* Identify clinical parameters
* Extract values, units, and reference ranges
* Classify results as low, normal, or high
* Generate simple educational explanations
* Suggest useful questions for doctor consultations

When an API key is unavailable, the application automatically switches to a local regex-based parser.

### ✏️ Correction Editor

OCR and AI-generated data can be reviewed before analysis. Users can:

* Edit extracted values
* Correct parameter names and units
* Add missing biomarkers
* Remove incorrect entries
* Verify reference ranges

This ensures the final summary is based on user-confirmed information.

### 📊 Interactive Results Explainer

Extracted biomarkers are displayed in a structured table with clear status indicators.

Each result can be expanded to show:

* What the biomarker generally measures
* Whether the value is low, normal, or high
* General educational context
* Questions the user may discuss with a healthcare professional

### 🖨️ Printable Doctor Summary

Generate a high-contrast consultation summary containing:

* Normal and abnormal parameters
* Report values and reference ranges
* User notes
* Important discussion points
* Questions for the doctor

A built-in **PII Redaction** option can hide patient names, IDs, and other personal details before printing or sharing.

### 📈 Chronological Trend Tracking

Track biomarker values across multiple reports using **Chart.js**.

Users can visualize changes in parameters such as:

* Blood glucose
* HbA1c
* TSH
* Haemoglobin
* Cholesterol
* Vitamin levels

This makes it easier to observe long-term patterns between medical consultations.

### 🔐 Privacy-First Architecture

MediLens AI is designed without a traditional backend.

* Reports remain inside the user's browser
* Health data is stored using **IndexedDB**
* Preferences and API configuration are stored in **localStorage**
* Documents are not uploaded to a project-controlled database
* Users maintain control over their report history

---

## 🛡️ Medical Safety Boundaries

MediLens AI is designed strictly for educational and self-advocacy support.

### No Diagnoses

The application does not claim that a user has a disease, disorder, or medical condition.

### No Prescriptions

The application does not recommend medicines, dosages, treatment changes, or clinical procedures.

### Educational Explanations

Result explanations describe the general purpose of biomarkers and encourage users to verify findings with a qualified healthcare professional.

> **Medical Disclaimer:** MediLens AI is not a substitute for professional medical advice, diagnosis, or treatment. Laboratory results should always be interpreted by a qualified healthcare professional using the patient's complete medical history and clinical context.

---

## 🧰 Technology Stack

| Category                 | Technologies                        |
| ------------------------ | ----------------------------------- |
| Frontend                 | HTML5, CSS3, JavaScript ES6+        |
| Application Architecture | Client-side Single Page Application |
| AI Integration           | Gemini 2.5 Flash                    |
| PDF Processing           | PDF.js                              |
| Image OCR                | Tesseract.js                        |
| Charts                   | Chart.js                            |
| Browser Database         | IndexedDB                           |
| Configuration Storage    | localStorage                        |
| Icons                    | Lucide Icons                        |
| Deployment               | Vercel                              |

---

## ⚙️ Application Workflow

```text
Upload Medical Report
        ↓
Extract Text Using PDF.js or Tesseract.js
        ↓
Parse Clinical Parameters
        ↓
Review and Correct Extracted Data
        ↓
Compare Values with Reference Ranges
        ↓
Generate Educational Explanations
        ↓
View Trends and Create Doctor Summary
```

---

## 🚀 Running the Application Locally

MediLens AI runs entirely inside the browser and does not require a backend server.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd medilens-ai
```

### 2. Start a Local Server

Using Python:

```bash
python -m http.server 8000
```

Open the following URL:

```text
http://localhost:8000
```

Using Node.js:

```bash
npx serve
```

Open the local URL displayed in the terminal.

### Alternative Method

You can also open `index.html` directly in a modern browser. However, using a local HTTP server is recommended for reliable PDF processing, module loading, and API requests.

---

## 🌐 Live Demo

Experience the deployed application here:

### 🔗 https://medilens-blond.vercel.app/

---

## 🎯 Project Goals

MediLens AI demonstrates how browser-based AI and document-processing technologies can be combined to build a useful health-education tool while maintaining strong privacy and medical-safety boundaries.

The project focuses on:

* Privacy-preserving document analysis
* Client-side OCR and PDF parsing
* Responsible generative AI integration
* Explainable health information
* Accessible report visualization
* Structured preparation for doctor consultations

---

<div align="center">

### Built with JavaScript, browser-based AI, and privacy-first design.

**MediLens AI helps users understand their reports—it does not replace their doctor.**

</div>
