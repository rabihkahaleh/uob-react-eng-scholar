/**
 * Classifies all Scopus papers into faculty themes using Gemini AI.
 *
 * Usage:
 *   npm install @google/generative-ai   (run once)
 *   node scripts/classifyWithGemini.mjs YOUR_GEMINI_API_KEY
 *
 * Output: overwrites src/data/paperThemes.js with EID → themeId mapping.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── Theme list (mirrors src/data/facultyThemes.js) ─────────────────────────
const ALL_THEMES = [
  { id: "CV1.1",  name: "Geopolymers: Sustainable Materials for Enhanced Strength" },
  { id: "CV1.2",  name: "Recycling Waste Materials for Enhanced Concrete Properties" },
  { id: "CV1.3",  name: "3D Printing for Concrete Construction" },
  { id: "CV1.4",  name: "Enhancing Concrete Properties with Polymer Modifications" },
  { id: "CV1.5",  name: "Ultra High-Performance Concrete Innovations and Applications" },
  { id: "CV1.6",  name: "Pervious Concrete for Sustainable Urban Drainage" },
  { id: "CV1.7",  name: "Lightweight Concrete Properties and Applications" },
  { id: "CV1.8",  name: "Enhancing Cementitious Materials with Nanomaterials" },
  { id: "CV1.9",  name: "Underwater Concrete Performance and Applications" },
  { id: "CV1.10", name: "Reclaimed Asphalt Pavement Innovations in Binder Performance" },
  { id: "CV1.11", name: "Artificial Intelligence Models for Concrete Strength Prediction" },
  { id: "CV2.1",  name: "Smart Concrete Innovations for Structural Resilience" },
  { id: "CV2.2",  name: "Lateral Pressure Dynamics in Self-Consolidating Concrete" },
  { id: "CV2.3",  name: "Mechanical Behavior of Composite Beams and Slabs" },
  { id: "CV2.4",  name: "Prestressing Innovations in Concrete Structures" },
  { id: "CV2.5",  name: "Fiber Reinforced Concrete for Structural Applications" },
  { id: "CV2.6",  name: "Optimal Sensor Placement for Structural Health Monitoring" },
  { id: "CV2.7",  name: "Fracture Mechanics and Size Effect in Concrete" },
  { id: "CV3.1",  name: "Warm Mix Asphalt Innovations for Sustainable Paving" },
  { id: "CV3.2",  name: "Urban Transportation and Land Use Dynamics" },
  { id: "CV3.3",  name: "Traffic Network Optimization and Capacity Modeling" },
  { id: "CV3.4",  name: "Integrated Strategies for Sustainable Urban Transport" },
  { id: "CV3.5",  name: "LiDAR and GIS Applications in Urban Modeling and Classification" },
  { id: "CV3.6",  name: "Geospatial Strategies for Renewable Energy Site Selection" },
  { id: "CV4.1",  name: "Fiber Reinforcement Techniques for Soil Strength Enhancement" },
  { id: "CV4.2",  name: "Strength and Sustainability of Earth Materials" },
  { id: "CV4.3",  name: "Use of Soil Mechanic Principles to Cementitious Applications" },
  { id: "CV5.1",  name: "Predictive Models for Bridge Condition Management" },
  { id: "CV5.2",  name: "Fuzzy Multi-Criteria Decision-Making Framework" },
  { id: "CV5.3",  name: "Integrated Strategies for Sustainable Urban Transport" },
  { id: "CV5.4",  name: "Traffic Network Optimization and Capacity Modeling" },
  { id: "CV5.5",  name: "Framework for Urban Social Sustainability Development" },
  { id: "CV6.1",  name: "Salinization Dynamics in Coastal Aquifers" },
  { id: "CV6.2",  name: "Pesticide Residues and Water Quality Management" },
  { id: "CV6.3",  name: "Chemical Dynamics of Cloud Water and Fog Deposition" },
  { id: "CV6.4",  name: "Climate Change Effects on Groundwater Resources" },
  { id: "CV6.5",  name: "Wastewater Surveillance for SARS-CoV-2 Detection" },
  { id: "CV7.1",  name: "Chemical Waste Management and Heavy Metal Recovery" },
  { id: "CV7.2",  name: "Health Risks and Environmental Impact of Polycyclic Aromatic Hydrocarbons" },
  { id: "CV7.3",  name: "Environmental Risks of Organochlorine Pesticides and PCBs" },
  { id: "CV7.4",  name: "Organic Carbon Emissions from Biomass Burning Aerosols" },
  { id: "CV7.5",  name: "Fog Formation and Prediction in Atmospheric Studies" },
];

const THEME_LIST_TEXT = ALL_THEMES.map(t => `${t.id}: ${t.name}`).join("\n");
const VALID_IDS = new Set(ALL_THEMES.map(t => t.id));

// ── CSV files to process ────────────────────────────────────────────────────
const CSV_FILES = [
  { file: "scopus_civil_env_full.csv",               deptId: "civil" },
  { file: "scopus_electrical_full.csv",              deptId: "electrical" },
  { file: "scopus_Mechanical Engineering.csv",       deptId: "mechanical" },
  { file: "scopus_Chemcial Engineering.csv",         deptId: "chemical" },
  { file: "scopus_Computer Engineering.csv",         deptId: "computer" },
  { file: "scopus_Sustainability for Engineering .csv", deptId: "sustainability" },
];

// ── CSV parser (same logic as parseScopusCSV.js) ────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

function extractPapers(csvString) {
  const lines = csvString.split(/\r?\n/).slice(1).filter(l => l.trim());
  const papersMap = new Map();
  for (const line of lines) {
    const cols = parseCSVLine(line);
    if (cols.length < 20) continue;
    const eid = cols[23];
    const title = cols[7];
    if (!eid || !title) continue;
    if (!papersMap.has(eid)) papersMap.set(eid, title);
  }
  return papersMap; // Map<eid, title>
}

// ── Gemini classification ───────────────────────────────────────────────────
async function classifyPaper(model, title) {
  const prompt = `You are a research classification assistant.

Given this paper title:
"${title}"

Choose the single BEST matching theme ID from the list below. Only respond with the theme ID (e.g. "CV1.3"). If no theme is a reasonable match, respond with "NONE".

Themes:
${THEME_LIST_TEXT}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/['"]/g, "");
    // Extract first token that looks like a theme ID
    const match = text.match(/CV\d+\.\d+/);
    const id = match ? match[0] : null;
    return id && VALID_IDS.has(id) ? id : null;
  } catch (err) {
    console.error(`  Gemini error for "${title.slice(0, 60)}": ${err.message}`);
    return null;
  }
}

// ── Rate-limited batch classifier ──────────────────────────────────────────
async function classifyAll(model, papers) {
  const mapping = {};
  const entries = [...papers.entries()];
  const total = entries.length;
  const DELAY_MS = 200; // ~5 req/sec to stay within free-tier limits

  for (let i = 0; i < total; i++) {
    const [eid, title] = entries[i];
    process.stdout.write(`\r  [${i + 1}/${total}] Classifying...`);
    const themeId = await classifyPaper(model, title);
    if (themeId) mapping[eid] = themeId;
    if (i < total - 1) await new Promise(r => setTimeout(r, DELAY_MS));
  }
  console.log(); // newline after progress
  return mapping;
}

// ── Main ────────────────────────────────────────────────────────────────────
const apiKey = process.argv[2];
if (!apiKey) {
  console.error("Usage: node scripts/classifyWithGemini.mjs YOUR_GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const allPapers = new Map();

console.log("Reading CSV files...");
for (const { file } of CSV_FILES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  Skipping (not found): ${file}`);
    continue;
  }
  const csv = fs.readFileSync(filePath, "utf-8");
  const papers = extractPapers(csv);
  let newCount = 0;
  for (const [eid, title] of papers) {
    if (!allPapers.has(eid)) { allPapers.set(eid, title); newCount++; }
  }
  console.log(`  ${file}: ${papers.size} papers (${newCount} new unique)`);
}

console.log(`\nTotal unique papers: ${allPapers.size}`);
console.log("Classifying with Gemini AI...\n");

const mapping = await classifyAll(model, allPapers);

const classified = Object.keys(mapping).length;
console.log(`\nClassified: ${classified}/${allPapers.size} papers assigned to themes.`);

// Tally by theme
const tally = {};
for (const themeId of Object.values(mapping)) {
  tally[themeId] = (tally[themeId] || 0) + 1;
}
console.log("\nTheme distribution:");
for (const [id, count] of Object.entries(tally).sort()) {
  const theme = ALL_THEMES.find(t => t.id === id);
  console.log(`  ${id}: ${count} papers  (${theme?.name})`);
}

// Write output
const outputPath = path.join(ROOT, "src", "data", "paperThemes.js");
const output = `// Auto-generated by scripts/classifyWithGemini.mjs
// Maps paper EID → theme ID (e.g. "CV1.3")
// Run: node scripts/classifyWithGemini.mjs YOUR_GEMINI_API_KEY
const paperThemes = ${JSON.stringify(mapping, null, 2)};
export default paperThemes;
`;

fs.writeFileSync(outputPath, output, "utf-8");
console.log(`\nOutput written to: src/data/paperThemes.js`);
