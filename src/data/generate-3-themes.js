import fs from 'fs';
import { parse } from 'csv-parse/sync';

function extractThemesFromCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true });
    
    const themes = {};
    records.forEach(record => {
      const eid = record['EID']?.trim();
      const themeNo = record['Theme No.']?.trim();
      
      if (eid && eid.startsWith('2-s2.0') && themeNo) {
        themes[eid] = themeNo;
      }
    });
    
    return themes;
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    return {};
  }
}

console.log('Extracting themes from 3 departments...\n');

const allThemes = {};

// Civil & Environmental
const civil = extractThemesFromCSV('Scopus (Civil Eng updated 13 May 26).csv');
Object.assign(allThemes, civil);
console.log(`✓ Civil: ${Object.keys(civil).length} papers`);

// Electrical
const electrical = extractThemesFromCSV('electricalScopusData.csv');
Object.assign(allThemes, electrical);
console.log(`✓ Electrical: ${Object.keys(electrical).length} papers`);

// Sustainability
const sustainability = extractThemesFromCSV('sustainabilityScopusData.csv');
Object.assign(allThemes, sustainability);
console.log(`✓ Sustainability: ${Object.keys(sustainability).length} papers`);

const total = Object.keys(allThemes).length;
console.log(`\n📊 Total: ${total} papers\n`);

// Generate output
const output = `// Auto-generated from Scopus CSV data
// Maps paper EID → theme ID
// 
// Departments:
// - Civil & Environmental: ${Object.keys(civil).length} papers (CV themes)
// - Electrical: ${Object.keys(electrical).length} papers (EE themes)
// - Sustainability: ${Object.keys(sustainability).length} papers (ST themes)
// Total: ${total} papers
//
// Generated: ${new Date().toLocaleString()}

const paperThemes = ${JSON.stringify(allThemes, null, 2)};

export default paperThemes;
`;

fs.writeFileSync('paperThemes.js', output, 'utf8');
console.log('✅ paperThemes.js generated successfully!');
console.log(`📁 File size: ${(output.length / 1024).toFixed(1)}KB`);
