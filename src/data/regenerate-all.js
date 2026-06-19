// Regenerate all JS data files from their source CSVs.
//
// CSV source files — all live in src/data/ with consistent names:
//   civil.csv
//   electrical.csv
//   mechanical.csv
//   chemical.csv
//   computer.csv
//   sustainability.csv
//
// Usage: node src/data/regenerate-all.js

const fs = require('fs');
const path = require('path');

const srcDir = __dirname;

const mappings = [
  {
    csv:     'civil.csv',
    js:      'civilEnvScopusData.js',
    varName: 'civilEnvScopusCSV',
    deptName: 'Civil & Environmental Engineering',
  },
  {
    csv:     'electrical.csv',
    js:      'electricalScopusData.js',
    varName: 'electricalScopusCSV',
    deptName: 'Electrical Engineering',
  },
  {
    csv:     'mechanical.csv',
    js:      'mechanicalScopusData.js',
    varName: 'mechanicalScopusCSV',
    deptName: 'Mechanical Engineering',
  },
  {
    csv:     'chemical.csv',
    js:      'chemicalScopusData.js',
    varName: 'chemicalScopusCSV',
    deptName: 'Chemical Engineering',
  },
  {
    csv:     'computer.csv',
    js:      'computerScopusData.js',
    varName: 'computerScopusCSV',
    deptName: 'Computer Engineering',
  },
  {
    csv:     'sustainability.csv',
    js:      'sustainabilityScopusData.js',
    varName: 'sustainabilityScopusCSV',
    deptName: 'Sustainability for Engineering',
  },
];

console.log('Regenerating all JS data files from CSVs...\n');

mappings.forEach(({ csv, js, varName, deptName }) => {
  const csvPath = path.join(srcDir, csv);
  const jsPath  = path.join(srcDir, js);

  try {
    if (!fs.existsSync(csvPath)) {
      console.warn(`⚠  Skipped (not found): ${csv}`);
      return;
    }
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const escaped = csvContent
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');

    const output =
`// ${deptName} - Scopus Publication Data
// University of Balamand
// Auto-generated — do not edit by hand. Edit ${csv} then run regenerate-all.js

const ${varName} = \`${escaped}\`;

export default ${varName};
`;

    fs.writeFileSync(jsPath, output, 'utf8');
    const kb = (output.length / 1024).toFixed(1);
    console.log(`✓  ${js.padEnd(28)} ← ${csv}  (${kb} KB)`);
  } catch (err) {
    console.error(`✗  Error processing ${csv}:`, err.message);
  }
});

console.log('\nDone. Run "npm start" to see your changes.');
