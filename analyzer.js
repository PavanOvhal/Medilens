// MediLens AI - Lab Value Reference Ranges & Analysis Core

// Standard reference ranges and educational descriptions for MVP biomarkers
const BIOMARKER_RANGES = {
  // CBC Panel
  "hemoglobin": { name: "Hemoglobin (Hb)", min: 12.0, max: 17.5, unit: "g/dL", category: "CBC", desc: "A protein in red blood cells that carries oxygen throughout your body." },
  "wbc": { name: "White Blood Cell (WBC)", min: 4.5, max: 11.0, unit: "10^3/mcL", category: "CBC", desc: "Cells in the immune system that help fight off infections and illnesses." },
  "platelets": { name: "Platelets", min: 150, max: 450, unit: "10^3/mcL", category: "CBC", desc: "Tiny blood cells that help your blood clot to stop bleeding from injuries." },
  "rbc": { name: "Red Blood Cell (RBC)", min: 4.2, max: 6.1, unit: "mil/mcL", category: "CBC", desc: "Cells that carry oxygen from your lungs to cells and organs in the body." },
  "hematocrit": { name: "Hematocrit (PCV)", min: 35.0, max: 50.0, unit: "%", category: "CBC", desc: "The proportion of red blood cells in your total blood volume." },
  "mcv": { name: "MCV", min: 80.0, max: 100.0, unit: "fL", category: "CBC", desc: "Mean Corpuscular Volume measures the average size of your red blood cells." },
  
  // Thyroid Panel
  "tsh": { name: "TSH (Thyroid Stimulating Hormone)", min: 0.40, max: 4.50, unit: "mIU/L", category: "Thyroid", desc: "A pituitary hormone that signals your thyroid gland to release thyroid hormones." },
  "free t4": { name: "Free T4 (Thyroxine)", min: 0.80, max: 1.80, unit: "ng/dL", category: "Thyroid", desc: "The main form of thyroid hormone circulating in your blood." },
  "free t3": { name: "Free T3 (Triiodothyronine)", min: 2.3, max: 4.2, unit: "pg/mL", category: "Thyroid", desc: "The active thyroid hormone responsible for regulating metabolism." },
  
  // Diabetes Panel
  "glucose": { name: "Fasting Blood Glucose", min: 70, max: 99, unit: "mg/dL", category: "Diabetes", desc: "Your blood sugar level after fasting (not eating) for at least 8 hours." },
  "hba1c": { name: "HbA1c (Glycated Hemoglobin)", min: 4.0, max: 5.6, unit: "%", category: "Diabetes", desc: "Your average blood sugar levels over the past 2 to 3 months." },
  
  // Lipid Panel
  "total cholesterol": { name: "Total Cholesterol", min: 0, max: 199, unit: "mg/dL", category: "Lipid Profile", desc: "The total amount of cholesterol (fats) found in your blood." },
  "ldl": { name: "LDL Cholesterol (Bad)", min: 0, max: 99, unit: "mg/dL", category: "Lipid Profile", desc: "Low-Density Lipoprotein, often called 'bad' cholesterol because it can build up in arterial walls." },
  "hdl": { name: "HDL Cholesterol (Good)", min: 40, max: 150, unit: "mg/dL", category: "Lipid Profile", desc: "High-Density Lipoprotein, 'good' cholesterol that helps remove other cholesterol forms from your blood." },
  "triglycerides": { name: "Triglycerides", min: 0, max: 149, unit: "mg/dL", category: "Lipid Profile", desc: "A type of fat stored in your cells and carried in your bloodstream for energy." },
  
  // Vitamin Panel
  "vitamin d": { name: "Vitamin D (25-OH)", min: 30.0, max: 100.0, unit: "ng/mL", category: "Vitamin", desc: "An essential vitamin that assists in calcium absorption, bone health, and immunity." },
  "vitamin b12": { name: "Vitamin B12", min: 200, max: 900, unit: "pg/mL", category: "Vitamin", desc: "An essential vitamin crucial for nerve function, brain health, and red blood cell production." },

  // Urinalysis Panel
  "urine ph": { name: "Urine pH", min: 4.5, max: 8.0, unit: "pH", category: "Urinalysis", desc: "Measures the level of acidity or alkalinity in your urine." },
  "specific gravity": { name: "Specific Gravity", min: 1.005, max: 1.030, unit: "SG", category: "Urinalysis", desc: "Measures the concentration of particles in urine, reflecting kidney concentration ability and hydration." },
  "urine protein": { name: "Urine Protein", min: 0, max: 20, unit: "mg/dL", category: "Urinalysis", desc: "Checks for protein levels in urine, which are normally low." },
  "urine ketones": { name: "Urine Ketones", min: 0, max: 0, unit: "mg/dL", category: "Urinalysis", desc: "Checks for ketones, which are produced when your body burns fat instead of glucose." },
  "urine glucose": { name: "Urine Glucose", min: 0, max: 0, unit: "mg/dL", category: "Urinalysis", desc: "Checks for glucose, which is typically fully reabsorbed by the kidneys." },
  
  // Fecal Analysis Panel
  "occult blood": { name: "Stool Occult Blood", min: 0, max: 0, unit: "FOBT", category: "Fecal Analysis", desc: "Checks for microscopic (hidden) blood in the stool." },
  "stool ph": { name: "Stool pH", min: 7.0, max: 7.5, unit: "pH", category: "Fecal Analysis", desc: "Measures the acidity of stool, reflecting digestion and gut health." }
};

// Simple non-diagnostic educational explanation templates
const EXPLANATION_TEMPLATES = {
  Low: {
    "hemoglobin": "A low hemoglobin level is commonly called anemia. It means your body is transporting less oxygen, which can cause feelings of fatigue, weakness, or coldness. Common causes include iron deficiency, vitamin deficiencies, or chronic inflammation.",
    "wbc": "A low white blood cell count (leukopenia) indicates your body may have a reduced capacity to fight off infections. This can be caused by viral infections, nutritional deficiencies, or certain bone marrow issues.",
    "platelets": "Low platelets (thrombocytopenia) can affect your body's clotting ability, which might lead to easier bruising or prolonged bleeding. This can be caused by vitamin deficiencies, immune responses, or medications.",
    "tsh": "Low TSH suggests an overactive thyroid (hyperthyroidism). Since the thyroid is producing plenty of hormone, the pituitary gland lowers TSH to tell the thyroid to slow down. Symptoms might include a fast heart rate, weight loss, or anxiety.",
    "glucose": "Low fasting glucose (hypoglycemia) is when blood sugar levels drop below normal. This can cause shakiness, sweating, dizziness, or confusion, often related to long fasting, intense exercise, or medication side effects.",
    "vitamin d": "Vitamin D deficiency is very common. It can lead to weakened bone density, muscle aches, fatigue, or mood changes. It is usually addressed with safe exposure to sunlight, dietary adjustments, or doctor-approved supplements.",
    "vitamin b12": "Low Vitamin B12 levels can lead to fatigue, anemia, or nerve tingling/numbness. It is common in individuals who follow vegetarian/vegan diets without supplementation, or those with digestive absorption issues.",
    "urine ph": "A low urine pH (highly acidic urine) can be influenced by diet (high protein), dehydration, or metabolic acidosis. It can increase the risk of certain kidney stone formations.",
    "specific gravity": "Low specific gravity indicates highly dilute urine. While usually normal with high water intake, persistent low specific gravity may warrant kidney function checks."
  },
  High: {
    "hemoglobin": "Elevated hemoglobin levels can mean your blood is slightly thick. This is occasionally seen in smoking, living at high altitudes, dehydration, or conditions where the body overproduces red blood cells.",
    "wbc": "An elevated white blood cell count (leukocytosis) is a standard immune response. It usually indicates your body is reacting to an infection, inflammation, stress, or minor injury.",
    "platelets": "High platelet counts (thrombocytosis) can occur in response to acute inflammation, blood loss, iron deficiency, or bone marrow disorders. It increases blood clotting tendencies.",
    "tsh": "High TSH suggests an underactive thyroid (hypothyroidism). The pituitary gland is sending extra TSH to stimulate a thyroid that is underproducing. Symptoms can include fatigue, weight gain, feeling cold, or dry skin.",
    "glucose": "Elevated fasting glucose indicates prediabetes or diabetes. High levels mean the body is not effectively processing sugar. This is a critical marker for heart, blood vessel, and metabolism health.",
    "hba1c": "An elevated HbA1c (5.7% to 6.4% indicates prediabetes; 6.5% or higher indicates diabetes) reflects long-term high blood sugar. This is an important window to implement healthy lifestyle changes or medication to protect long-term health.",
    "total cholesterol": "Elevated total cholesterol indicates high fat levels in the blood, which can contribute to plaque building up in your blood vessels over time. It can be managed through diet, exercise, and medical therapy.",
    "ldl": "High LDL is a cardiovascular risk factor. Known as 'bad' cholesterol, excess LDL can accumulate in artery walls, narrowing them. Discussing dietary changes (reducing saturated fats) or treatment is recommended.",
    "triglycerides": "Elevated triglycerides are another type of blood fat that can raise heart disease risks. High levels are often linked to diet, alcohol consumption, high sugar intake, or physical inactivity.",
    "urine ph": "An elevated urine pH (alkaline urine) can indicate a diet rich in vegetables, a urinary tract infection (UTI), or certain renal tubular kidney issues.",
    "specific gravity": "High specific gravity indicates highly concentrated urine, which is a key indicator of dehydration or inadequate fluid intake.",
    "urine protein": "Protein in urine (proteinuria) is a key warning sign of kidney filtration stress. It can occur temporarily after intense exercise, but persistent high levels should be checked by a doctor.",
    "urine ketones": "High urine ketones (ketonuria) suggest the body is burning fat instead of glucose for fuel, commonly seen in fasting, low-carbohydrate diets, or metabolic stress.",
    "urine glucose": "High glucose in urine (glucosuria) occurs when blood glucose is high enough to spill past kidney reabsorption thresholds, typically pointing to potential diabetes.",
    "occult blood": "Positive occult blood indicates hidden traces of blood in the stool, pointing to possible gastrointestinal bleeding, hemorrhoids, polyps, or inflammatory bowel changes."
  }
};

/**
 * Fuzzy matches a test name to our configured reference database.
 */
function findBiomarkerConfig(name) {
  const cleanName = name.toLowerCase().trim();
  
  // Direct matches
  if (BIOMARKER_RANGES[cleanName]) return BIOMARKER_RANGES[cleanName];
  
  // Common alias lookups
  if (cleanName.includes("hemoglobin") || cleanName === "hb") return BIOMARKER_RANGES["hemoglobin"];
  if (cleanName.includes("white blood") || cleanName === "wbc" || cleanName.includes("leukocyte")) return BIOMARKER_RANGES["wbc"];
  if (cleanName.includes("red blood") || cleanName === "rbc" || cleanName.includes("erythrocyte")) return BIOMARKER_RANGES["rbc"];
  if (cleanName.includes("platelet")) return BIOMARKER_RANGES["platelets"];
  if (cleanName.includes("hematocrit") || cleanName === "pcv") return BIOMARKER_RANGES["hematocrit"];
  if (cleanName === "mcv") return BIOMARKER_RANGES["mcv"];
  if (cleanName.includes("tsh") || cleanName.includes("thyroid stim")) return BIOMARKER_RANGES["tsh"];
  if (cleanName.includes("free t4") || cleanName.includes("thyroxine")) return BIOMARKER_RANGES["free t4"];
  if (cleanName.includes("free t3") || cleanName.includes("triiodothyronine")) return BIOMARKER_RANGES["free t3"];
  if (cleanName.includes("glucose") || cleanName.includes("sugar")) return BIOMARKER_RANGES["glucose"];
  if (cleanName.includes("hba1c") || cleanName.includes("a1c")) return BIOMARKER_RANGES["hba1c"];
  if (cleanName.includes("total cholesterol")) return BIOMARKER_RANGES["total cholesterol"];
  if (cleanName.includes("ldl") || cleanName.includes("low density lipo")) return BIOMARKER_RANGES["ldl"];
  if (cleanName.includes("hdl") || cleanName.includes("high density lipo")) return BIOMARKER_RANGES["hdl"];
  if (cleanName.includes("triglyceride")) return BIOMARKER_RANGES["triglycerides"];
  if (cleanName.includes("vitamin d") || cleanName.includes("vit d") || cleanName.includes("25-hydroxy")) return BIOMARKER_RANGES["vitamin d"];
  if (cleanName.includes("vitamin b12") || cleanName.includes("vit b12") || cleanName.includes("cobalamin")) return BIOMARKER_RANGES["vitamin b12"];
  
  // Urine panel aliases
  if (cleanName.includes("urine ph") || cleanName === "ph" || cleanName.includes("reaction")) return BIOMARKER_RANGES["urine ph"];
  if (cleanName.includes("specific gravity") || cleanName === "sg" || cleanName === "sp. gr." || cleanName.includes("gravity")) return BIOMARKER_RANGES["specific gravity"];
  if (cleanName.includes("urine protein") || cleanName === "protein" || cleanName === "alb" || cleanName.includes("albumin")) return BIOMARKER_RANGES["urine protein"];
  if (cleanName.includes("urine ketone") || cleanName === "ketones" || cleanName === "ket") return BIOMARKER_RANGES["urine ketones"];
  if (cleanName.includes("urine glucose") || (cleanName === "glucose" && cleanName.includes("urine"))) return BIOMARKER_RANGES["urine glucose"];
  
  // Stool panel aliases
  if (cleanName.includes("occult blood") || cleanName === "fobt" || cleanName.includes("fecal blood") || cleanName.includes("stool blood") || cleanName === "ob") return BIOMARKER_RANGES["occult blood"];
  if (cleanName.includes("stool ph") || cleanName.includes("fecal ph")) return BIOMARKER_RANGES["stool ph"];
  
  return null;
}

/**
 * Calculates a flag (Low, Normal, High, Check with doctor) for a given value, unit, and range.
 */
function evaluateValue(testName, value, referenceRange, patientAge) {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "Normal";

  const config = findBiomarkerConfig(testName);

  let min = null;
  let max = null;

  // Try parsing the reference range string (e.g., "70 - 99", "< 200", ">= 40", "Up To 140")
  if (referenceRange) {
    const cleanRange = referenceRange.replace(/\s+/g, "");
    const lowerCleanRange = cleanRange.toLowerCase();
    if (cleanRange.includes("-")) {
      const parts = cleanRange.split("-");
      min = parseFloat(parts[0]);
      max = parseFloat(parts[1]);
    } else if (cleanRange.startsWith("<=")) {
      max = parseFloat(cleanRange.substring(2));
    } else if (cleanRange.startsWith("<")) {
      max = parseFloat(cleanRange.substring(1)) - 0.01; // tiny offset
    } else if (cleanRange.startsWith(">=")) {
      min = parseFloat(cleanRange.substring(2));
    } else if (cleanRange.startsWith(">")) {
      min = parseFloat(cleanRange.substring(1)) + 0.01;
    } else if (lowerCleanRange.includes("upto")) {
      const valMatch = lowerCleanRange.match(/upto(\d+(?:\.\d+)?)/);
      if (valMatch) {
        max = parseFloat(valMatch[1]);
      }
    }
  }

  // Fallback to local config ranges if parsing failed (applying age adjustments)
  if (min === null && max === null) {
    const ageRange = getAgeAdjustedRange(testName, patientAge);
    if (ageRange) {
      min = ageRange.min;
      max = ageRange.max;
    } else if (config) {
      min = config.min;
      max = config.max;
    }
  }

  // Perform checks
  if (min !== null && numValue < min) {
    return "Low";
  }
  if (max !== null && numValue > max) {
    return "High";
  }

  // Edge-case evaluations (e.g., diabetes prediabetes zones)
  const normName = testName.toLowerCase();
  if (normName.includes("hba1c") || normName === "a1c") {
    if (numValue >= 5.7 && numValue < 6.5) return "High"; // Prediabetes is flagged high
    if (numValue >= 6.5) return "High";
  }
  if (normName.includes("glucose")) {
    const age = parseInt(patientAge);
    // Widened glucose logic for very young children
    if (!isNaN(age) && age < 6) {
      if (numValue >= 150) return "High";
      if (numValue < 80) return "Low";
    } else {
      if (numValue >= 100 && numValue < 126) return "High";
      if (numValue >= 126) return "High";
    }
  }

  return "Normal";
}

/**
 * Returns a patient-friendly educational explanation.
 */
function getEducationalExplanation(testName, status, patientAge) {
  const config = findBiomarkerConfig(testName);
  
  let prefix = "";
  if (patientAge) {
    const age = parseInt(patientAge);
    if (age < 18) prefix = "[Child normal ranges applied] ";
    else if (age >= 65) prefix = "[Senior normal ranges applied] ";
  }

  if (!config) {
    return prefix + `This test value is currently flagged as ${status}. Please review this parameter with your doctor to understand how it relates to your overall symptoms and medical history.`;
  }

  const baseDesc = config.desc;
  
  if (status === "Normal") {
    return prefix + `${baseDesc} Your level falls within the expected healthy reference range. This suggests standard organ function or metabolic balance for this biomarker.`;
  }

  const lookupKey = Object.keys(BIOMARKER_RANGES).find(key => {
    const item = BIOMARKER_RANGES[key];
    return item.name === config.name;
  });

  const specificExpl = EXPLANATION_TEMPLATES[status]?.[lookupKey];
  if (specificExpl) {
    return prefix + `${baseDesc} ${specificExpl}`;
  }

  const statusLower = status.toLowerCase();
  return prefix + `${baseDesc} Your level is currently ${statusLower}er than the standard reference range. A variety of nutritional, physical, or minor metabolic factors can cause temporary elevations or drops. We recommend confirming with a clinician.`;
}

/**
 * Fallback local regex parser to extract structured lab values from raw unstructured text.
 */
function localRegexParse(text) {
  const lines = text.split("\n");
  const extracted = [];
  
  // Common pattern: TEST_NAME  VALUE  (optional UNIT)  (optional RANGE)
  // Example: Hemoglobin 11.2 g/dL 13.8 - 17.2
  // Or: Fasting Glucose 118 mg/dL
  const numberRegex = /(\d+(?:\.\d+)?)/;

  lines.forEach((line) => {
    // Check line against known keywords
    Object.keys(BIOMARKER_RANGES).forEach((key) => {
      const config = BIOMARKER_RANGES[key];
      // Search for names in lines
      const pattern = new RegExp("\\b" + key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\b", "i");
      
      if (pattern.test(line)) {
        // Look for numbers near or after the match
        const parts = line.substring(line.search(pattern) + key.length).trim().split(/\s+/);
        let val = null;
        let unit = config.unit;
        let refRange = `${config.min} - ${config.max}`;

        for (let i = 0; i < parts.length; i++) {
          if (numberRegex.test(parts[i])) {
            // Check if this number is followed by a time/age unit (e.g. 2 hrs, 1 hour, 30 mins)
            const nextPart = parts[i+1] ? parts[i+1].toLowerCase().replace(/[^a-z]/g, "") : "";
            const ignoreUnits = ["hr", "hrs", "hour", "hours", "min", "mins", "minute", "minutes", "yr", "yrs", "year", "years", "o", "old"];
            if (ignoreUnits.includes(nextPart)) {
              continue; // skip this number as it is part of a duration/age qualifier
            }

            val = parseFloat(parts[i].match(numberRegex)[0]);
            
            // Look ahead for unit
            if (parts[i+1] && /^[a-zA-Z%/]+$/.test(parts[i+1])) {
              unit = parts[i+1];
            }
            
            // Check if there is a range printed on this line
            const rangeMatch = line.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
            if (rangeMatch) {
              refRange = `${rangeMatch[1]} - ${rangeMatch[2]}`;
            } else {
              const capMatch = line.match(/[<>]=?\s*(\d+(?:\.\d+)?)/) || line.match(/up\s*to\s*(\d+(?:\.\d+)?)/i);
              if (capMatch) {
                refRange = capMatch[0];
              }
            }
            break;
          }
        }

        if (val !== null) {
          // Avoid duplicates
          if (!extracted.some((item) => item.name === config.name)) {
            extracted.push({
              name: config.name,
              value: val,
              unit: unit,
              referenceRange: refRange
            });
          }
        }
      }
    });
  });

  return extracted;
}

/**
 * Sends OCR text to Gemini API using client-provided API Key.
 * Returns structured JSON or throws error.
 */
async function analyzeReportWithGemini(ocrText, apiKey) {
  if (!apiKey) throw new Error("Gemini API Key is required.");
  
  const systemPrompt = `You are a precise medical report extractor and translator. Your job is to extract values from raw text and explain them.
Return a valid JSON object ONLY. DO NOT include markdown code blocks (e.g. \`\`\`json). Just return the raw JSON string.

Safety constraints:
- NEVER diagnose diseases.
- NEVER prescribe medicine.
- Do not say "you have diabetes" or "you have anemia". Use neutral, educational terminology (e.g. "Values fall in the prediabetes range; discuss lifestyle factors with a doctor").
- Always add an educational disclaimer.

The JSON structure MUST follow this exact schema:
{
  "isMedicalReport": true/false (boolean indicating if the document is actually a medical lab report, blood test, clinical panel, or health biomarker record),
  "patientName": "Name or 'Unknown'",
  "patientId": "ID or 'Unknown'",
  "date": "YYYY-MM-DD (format date if found, otherwise use today's date: 2026-07-04)",
  "type": "One of: CBC, Thyroid, Diabetes, Lipid Profile, Vitamin, Urinalysis, Fecal Analysis, or General",
  "labValues": [
    {
      "name": "Full Test Name (e.g. Hemoglobin, TSH)",
      "value": 12.3 (numerical value),
      "unit": "unit (e.g. g/dL, mIU/L)",
      "referenceRange": "reference range printed in report (e.g. 13.8 - 17.2, < 200)"
    }
  ],
  "summary": "A clean, educational summary explaining what values are normal/abnormal and what they generally relate to in plain language. Maintain a neutral tone. Explicitly state that the user should consult a physician.",
  "doctorQuestions": [
    "Question 1 tailored to abnormal values",
    "Question 2 tailored to findings",
    "Question 3 general checkup question"
  ]
}

If "isMedicalReport" is false (i.e. the text does not resemble a medical lab report, blood test, panel, or health check results at all, such as a recipe, utility bill, restaurant menu, book text, or code), you can leave "labValues" empty, set "type" to "General", and explain in the "summary" that the uploaded file does not appear to be a medical lab report.

Input Text:
${ocrText}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: systemPrompt
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) throw new Error("Empty response from Gemini.");

  try {
    return JSON.parse(textResponse.trim());
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", textResponse);
    throw new Error("Could not parse AI response as structured JSON.");
  }
}

/**
 * Local helper to identify if the extracted text resembles a medical report.
 */
function isLikelyMedicalReport(text, values) {
  if (values && values.length > 0) return true;
  
  const medicalKeywords = [
    "patient", "lab", "test", "reference range", "result", "clinical", "hosp", "medical", 
    "blood", "serum", "plasma", "specimen", "urine", "analysis", "biomarker", "doctor",
    "physician", "hemoglobin", "glucose", "cholesterol", "thyroid", "bilirubin", "creatinine"
  ];
  
  const lowerText = (text || "").toLowerCase();
  let matches = 0;
  medicalKeywords.forEach(kw => {
    if (lowerText.includes(kw)) {
      matches++;
    }
  });
  
  return matches >= 3;
}

/**
 * Dynamic age-adjusted reference ranges based on clinical standards.
 */
function getAgeAdjustedRange(testName, patientAge) {
  const config = findBiomarkerConfig(testName);
  if (!config) return null;

  const age = parseInt(patientAge);
  if (isNaN(age)) return { min: config.min, max: config.max };

  const normName = testName.toLowerCase();

  // Child ranges (<18)
  if (age < 18) {
    if (normName.includes("hemoglobin") || normName === "hb") {
      return { min: 11.5, max: 15.5 }; // Pediatric hemoglobin standard
    }
    if (normName.includes("total cholesterol")) {
      return { min: 100, max: 169 }; // Pediatric total cholesterol standard
    }
    if (normName.includes("ldl")) {
      return { min: 0, max: 109 }; // Pediatric LDL cholesterol
    }
    if (normName.includes("glucose")) {
      return { min: 70, max: 105 }; // Pediatric glucose standard
    }
  }

  // Senior ranges (>=65)
  if (age >= 65) {
    if (normName.includes("hemoglobin") || normName === "hb") {
      return { min: 11.5, max: 17.0 }; // Senior adult normal range
    }
    if (normName.includes("tsh")) {
      return { min: 0.40, max: 5.50 }; // Elder adult TSH upper limit is higher
    }
  }

  // Default config ranges for standard adult
  return { min: config.min, max: config.max };
}

/**
 * Utility to label age groups for explanations.
 */
function getAgeGroupLabel(patientAge) {
  const age = parseInt(patientAge);
  if (isNaN(age)) return "Adult";
  if (age < 18) return "Child (under 18)";
  if (age >= 65) return "Senior (65+)";
  return "Adult";
}
