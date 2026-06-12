const fs = require('fs');

function regenerateCorrectFile(csvPath, importName, varName, deptName) {
  const csv = fs.readFileSync(csvPath, 'utf8');

  // Escape for template literal
  const escaped = csv
    .replace(/\/g, '\\')
    .replace(/`/g, '\`')
    .replace(/\$/g, '\$');

  const code = `// ${deptName} - Scopus Publication Data
// University of Balamand

const ${varName} = \`${escaped}\`;

export default ${varName};
`;

  const outFile = `${importName}.js`;
  fs.writeFileSync(outFile, code, 'utf8');
  console.log(`✓ ${outFile} created (${(code.length / 1024).toFixed(1)}KB)`);
}

// Fix: match what the Data.js files are importing
regenerateCorrectFile('Scopus (Civil Eng updated 13 May 26).csv', 'civilEnvScopusData', 'civilEnvScopusCSV', 'Civil & Environmental');
regenerateCorrectFile('computerScopusData.csv', 'computerScopusData', 'computerScopusCSV', 'Computer');
regenerateCorrectFile('electricalScopusData.csv', 'electricalScopusData', 'electricalScopusCSV', 'Electrical');
regenerateCorrectFile('sustainabilityScopusData.csv', 'sustainabilityScopusData', 'sustainabilityScopusCSV', 'Sustainability');

console.log('\nAll data files regenerated with correct names!');
