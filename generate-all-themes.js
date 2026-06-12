import fs from 'fs';
import path from 'path';

const dataDir = './src/data';

// Parse CSV helper
function parseCSV(csvString) {
  const lines = csvString.split('\n').map(line => line.trim()).filter(line => line);
  const headers = [];
  const records = [];
  
  for (let i = 0; i < lines.length; i++) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    if (i === 0) {
      headers.push(...fields);
    } else {
      const record = {};
      headers.forEach((h, idx) => {
        record[h] = fields[idx] || '';
      });
      records.push(record);
    }
  }
  
  return { headers, records };
}

// Extract EID and Theme
function extractThemes(csvString, prefix) {
  const { records } = parseCSV(csvString);
  const themes = {};
  
  records.forEach(record => {
    if (!record['EID'] || !record['Theme No.']) return;
    const eid = record['EID'].trim();
    const theme = record['Theme No.'].trim();
    
    if (eid && theme) {
      themes[eid] = theme;
    }
  });
  
  return themes;
}

// Read all data
console.log('Reading data files...');

// Civil
const civilCSV = fs.readFileSync(path.join(dataDir, 'Scopus (Civil Eng updated 13 May 26).csv'), 'utf8');
const civilThemes = extractThemes(civilCSV, 'CV');

// Computer
const computerThemes = {
  "2-s2.0-0025843271": "CP1.7",
  "2-s2.0-0025897934": "CP2.2",
  "2-s2.0-0027274304": "CP1.4",
  "2-s2.0-0027812212": "CP1.3",
  "2-s2.0-0027967488": "CP1.3",
  "2-s2.0-0028733177": "CP2.2",
  "2-s2.0-0028733941": "CP2.2",
  "2-s2.0-0028736617": "CP1.7",
  "2-s2.0-0028747113": "CP1.3"
};

// Load and merge all
const allThemes = {};

// Add Civil themes
Object.assign(allThemes, civilThemes);
console.log(`✓ Civil: ${Object.keys(civilThemes).length} papers`);

// Try to load Chemical
try {
  const chemicalData = fs.readFileSync(path.join(dataDir, 'chemicalScopusData.js'), 'utf8');
  const chemicalCSVMatch = chemicalData.match(/const chemicalScopusCSV = `([^`]+)`/s);
  if (chemicalCSVMatch) {
    const chemicalThemes = extractThemes(chemicalCSVMatch[1], 'CH');
    Object.assign(allThemes, chemicalThemes);
    console.log(`✓ Chemical: ${Object.keys(chemicalThemes).length} papers`);
  }
} catch (e) {
  console.log(`⚠ Chemical: Error reading`, e.message);
}

// Try to load Mechanical
try {
  const mechanicalData = fs.readFileSync(path.join(dataDir, 'mechanicalScopusData.js'), 'utf8');
  const mechanicalCSVMatch = mechanicalData.match(/const mechanicalScopusCSV = `([^`]+)`/s);
  if (mechanicalCSVMatch) {
    const mechanicalThemes = extractThemes(mechanicalCSVMatch[1], 'ME');
    Object.assign(allThemes, mechanicalThemes);
    console.log(`✓ Mechanical: ${Object.keys(mechanicalThemes).length} papers`);
  }
} catch (e) {
  console.log(`⚠ Mechanical: Error reading`, e.message);
}

console.log(`Total papers: ${Object.keys(allThemes).length}`);

// Generate output
const output = `// Auto-generated theme mappings
// Maps paper EID → theme ID
// Generated: ${new Date().toLocaleString()}

const paperThemes = ${JSON.stringify(allThemes, null, 2)};

export default paperThemes;
`;

fs.writeFileSync(path.join(dataDir, 'paperThemes.js'), output, 'utf8');
console.log('\n✅ paperThemes.js generated successfully!');
