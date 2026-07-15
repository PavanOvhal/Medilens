// Preloaded sample report data for MediLens AI
const SAMPLE_REPORTS = [
  {
    id: "sample-cbc",
    type: "CBC",
    title: "Complete Blood Count (CBC)",
    patientName: "John Doe",
    patientId: "PT-94827",
    date: "2026-06-15",
    rawText: `METROPOLIS DIAGNOSTICS LABS
Patient Name: John Doe   Patient ID: PT-94827
Age/Sex: 34 Y / Male     Date: 15-Jun-2026
--------------------------------------------------
COMPLETE BLOOD COUNT (CBC)
TEST NAME               RESULT      UNIT        REFERENCE RANGE
Hemoglobin (Hb)         11.2        g/dL        13.8 - 17.2
Red Blood Cell (RBC)    4.1         mil/mcL     4.7 - 6.1
White Blood Cell (WBC)  12.5        10^3/mcL    4.5 - 11.0
Platelets               245         10^3/mcL    150 - 450
Hematocrit (PCV)        35.2        %           41.0 - 50.0
MCV                     85.8        fL          80.0 - 100.0
--------------------------------------------------
Comments: Mild microcytic anemia noted. Leukocytosis present. Check with doctor.`,
    labValues: [
      { name: "Hemoglobin (Hb)", value: 11.2, unit: "g/dL", referenceRange: "13.8 - 17.2" },
      { name: "Red Blood Cell (RBC)", value: 4.1, unit: "mil/mcL", referenceRange: "4.7 - 6.1" },
      { name: "White Blood Cell (WBC)", value: 12.5, unit: "10^3/mcL", referenceRange: "4.5 - 11.0" },
      { name: "Platelets", value: 245, unit: "10^3/mcL", referenceRange: "150 - 450" },
      { name: "Hematocrit (PCV)", value: 35.2, unit: "%", referenceRange: "41.0 - 50.0" },
      { name: "MCV", value: 85.8, unit: "fL", referenceRange: "80.0 - 100.0" }
    ],
    summary: "Your Complete Blood Count (CBC) reveals a slightly low Hemoglobin (11.2 g/dL) and low Hematocrit (35.2%), which can point towards mild anemia. Additionally, your White Blood Cell (WBC) count is slightly elevated (12.5 x 10^3/mcL), which is a common response to mild infections, inflammation, or physical stress. Other parameters, including platelet counts, are within normal ranges.",
    doctorQuestions: [
      "What could be causing my low hemoglobin level (11.2 g/dL) and hematocrit?",
      "Does my elevated white blood cell count (12.5 x 10^3/mcL) indicate an active infection or inflammation?",
      "Would you recommend any dietary changes or supplements (such as iron or vitamins) based on these results?",
      "Should we repeat this CBC test in a few weeks to monitor these levels?"
    ]
  },
  {
    id: "sample-thyroid",
    type: "Thyroid",
    title: "Thyroid Function Test",
    patientName: "Jane Smith",
    patientId: "PT-88392",
    date: "2026-05-20",
    rawText: `CLINICAL PATHOLOGY LABORATORY
Patient Name: Jane Smith   Patient ID: PT-88392
Age/Sex: 29 Y / Female     Date: 20-May-2026
--------------------------------------------------
THYROID PANEL
TEST NAME               RESULT      UNIT        REFERENCE RANGE
TSH (Thyroid Stim)      6.82        mIU/L       0.40 - 4.50
Free T4 (Thyroxine)     0.95        ng/dL       0.80 - 1.80
Free T3 (Triiodothyronine) 2.9      pg/mL       2.3 - 4.2
--------------------------------------------------
Comments: Elevated TSH with normal Free T4 indicates possible subclinical hypothyroidism.`,
    labValues: [
      { name: "TSH (Thyroid Stimulating Hormone)", value: 6.82, unit: "mIU/L", referenceRange: "0.40 - 4.50" },
      { name: "Free T4 (Thyroxine)", value: 0.95, unit: "ng/dL", referenceRange: "0.80 - 1.80" },
      { name: "Free T3 (Triiodothyronine)", value: 2.9, unit: "pg/mL", referenceRange: "2.3 - 4.2" }
    ],
    summary: "Your thyroid panel shows an elevated TSH (6.82 mIU/L) with normal Free T4 (0.95 ng/dL) and Free T3 (2.9 pg/mL) levels. The pituitary gland produces TSH to stimulate the thyroid; a higher TSH means your body is requesting more thyroid hormone, which is often a sign of mild or early underactive thyroid (subclinical hypothyroidism). It is important to discuss these levels with your doctor, especially if you have symptoms like fatigue or dry skin.",
    doctorQuestions: [
      "My TSH is elevated at 6.82 mIU/L while my Free T4 and T3 are normal. Does this suggest subclinical hypothyroidism?",
      "Are my symptoms (such as fatigue or cold sensitivity) likely related to these thyroid levels?",
      "Should we monitor this with periodic tests, or is treatment recommended at this stage?",
      "Are there any specific lifestyle adjustments or supplements I should consider?"
    ]
  },
  {
    id: "sample-diabetes",
    type: "Diabetes",
    title: "Glycemic Profile (Diabetes Screen)",
    patientName: "Robert Johnson",
    patientId: "PT-10398",
    date: "2026-06-28",
    rawText: `APEX MEDICAL CENTER
Patient Name: Robert Johnson  Patient ID: PT-10398
Age/Sex: 52 Y / Male          Date: 28-Jun-2026
--------------------------------------------------
GLYCEMIC REPORT
TEST NAME               RESULT      UNIT        REFERENCE RANGE
Fasting Blood Glucose   118         mg/dL       70 - 99
HbA1c (Glycated Hb)     6.2         %           < 5.7
--------------------------------------------------
Interpretation:
HbA1c: Normal (<5.7%), Prediabetes (5.7% - 6.4%), Diabetes (>=6.5%)
Fasting Glucose: Normal (70-99), Impaired/Prediabetes (100-125), Diabetes (>=126)`,
    labValues: [
      { name: "Fasting Blood Glucose", value: 118, unit: "mg/dL", referenceRange: "70 - 99" },
      { name: "HbA1c (Glycated Hb)", value: 6.2, unit: "%", referenceRange: "< 5.7" }
    ],
    summary: "Your glycemic panel indicates both elevated Fasting Blood Glucose (118 mg/dL) and elevated HbA1c (6.2%). Both of these numbers fall into the standard range for prediabetes (Fasting Glucose between 100-125 mg/dL; HbA1c between 5.7%-6.4%). Prediabetes is an early warning indicator showing that blood sugar levels are higher than normal, but not yet high enough to be classified as type 2 diabetes. This represents a key opportunity to discuss preventive steps with your healthcare provider.",
    doctorQuestions: [
      "My Fasting Glucose (118 mg/dL) and HbA1c (6.2%) fall into the prediabetes range. What does this mean for my health?",
      "What dietary changes, exercise habits, or weight management steps should I prioritize to reverse prediabetes?",
      "How frequently should I test my HbA1c and fasting blood sugar levels?",
      "Should I consult with a registered dietitian or diabetes educator?"
    ]
  },
  {
    id: "sample-lipid",
    type: "Lipid Profile",
    title: "Lipid Profile (Cholesterol Panel)",
    patientName: "Emily Davis",
    patientId: "PT-44820",
    date: "2026-04-12",
    rawText: `MEDICALL DIAGNOSTICS INC
Patient Name: Emily Davis  Patient ID: PT-44820
Age/Sex: 45 Y / Female     Date: 12-Apr-2026
--------------------------------------------------
LIPID PROFILE
TEST NAME               RESULT      UNIT        REFERENCE RANGE
Total Cholesterol       235         mg/dL       < 200
HDL Cholesterol         48          mg/dL       > 50
LDL Cholesterol         152         mg/dL       < 100
Triglycerides           175         mg/dL       < 150
--------------------------------------------------
Comments: Hypercholesterolemia. Elevated LDL and Triglycerides. Decreased HDL.`,
    labValues: [
      { name: "Total Cholesterol", value: 235, unit: "mg/dL", referenceRange: "< 200" },
      { name: "HDL Cholesterol (Good)", value: 48, unit: "mg/dL", referenceRange: "> 50" },
      { name: "LDL Cholesterol (Bad)", value: 152, unit: "mg/dL", referenceRange: "< 100" },
      { name: "Triglycerides", value: 175, unit: "mg/dL", referenceRange: "< 150" }
    ],
    summary: "Your lipid panel shows several biomarkers outside optimal ranges: elevated Total Cholesterol (235 mg/dL), high LDL Cholesterol (152 mg/dL), and slightly elevated Triglycerides (175 mg/dL), along with a slightly lower than optimal HDL Cholesterol level (48 mg/dL for females). HDL is often called the 'good' cholesterol because it helps clear fat from your bloodstream, while LDL is called the 'bad' cholesterol. Elevated LDL and Triglycerides can increase cardiovascular risks, making this a valuable report to review with your doctor.",
    doctorQuestions: [
      "My Total Cholesterol (235 mg/dL) and LDL (152 mg/dL) are high. What are my overall cardiovascular risk factors?",
      "Can we try lifestyle and dietary changes (e.g. eating more fiber, reducing saturated fats, and exercise) before considering medication?",
      "What are healthy target numbers for someone with my overall health profile?",
      "When should we re-test to see if lifestyle modifications are working?"
    ]
  },
  {
    id: "sample-vitamin",
    type: "Vitamin",
    title: "Vitamin D & B12 Panel",
    patientName: "Michael Chang",
    patientId: "PT-33019",
    date: "2026-07-02",
    rawText: `CENTRAL WELLNESS CLINIC
Patient Name: Michael Chang  Patient ID: PT-33019
Age/Sex: 38 Y / Male         Date: 02-Jul-2026
--------------------------------------------------
VITAMIN TESTING
TEST NAME               RESULT      UNIT        REFERENCE RANGE
Vitamin D (25-OH)       18.4        ng/mL       30.0 - 100.0
Vitamin B12             215         pg/mL       200 - 900
--------------------------------------------------
Interpretation:
Vitamin D: Deficient (<20), Insufficient (20-29), Sufficiency (30-100)
Vitamin B12: Deficient (<200), Borderline (200-300), Normal (300-900)`,
    labValues: [
      { name: "Vitamin D (25-hydroxyvitamin D)", value: 18.4, unit: "ng/mL", referenceRange: "30.0 - 100.0" },
      { name: "Vitamin B12 (Cobalamin)", value: 215, unit: "pg/mL", referenceRange: "200 - 900" }
    ],
    summary: "Your results indicate a Vitamin D deficiency (18.4 ng/mL, which is below the target 30 ng/mL range) and a borderline low Vitamin B12 level (215 pg/mL, close to the lower limit of 200 pg/mL). Low Vitamin D can impact bone health, immune function, and overall energy levels. Low B12 is common in various diets or absorption states and can cause fatigue or nerve symptoms. Discussing appropriate supplement dosages with your clinician is recommended.",
    doctorQuestions: [
      "My Vitamin D is deficient at 18.4 ng/mL. What daily supplement dose do you recommend, and for how long?",
      "Is my Vitamin B12 level (215 pg/mL) low enough to cause symptoms like fatigue or brain fog?",
      "Should we check for other markers, like iron levels or calcium, to get a full picture?",
      "How long after starting supplementation should I get re-tested?"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_REPORTS };
}
