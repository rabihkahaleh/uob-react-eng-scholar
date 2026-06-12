const fs = require('fs');

function createDataFile(csvPath, varName, deptName) {
  const csv = fs.readFileSync(csvPath, 'utf8');

  // Escape for template literal
  const escaped = csv
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  const code = `// ${deptName} - Scopus Publication Data
// University of Balamand

const ${varName}ScopusCSV = \`${escaped}\`;

export default ${varName}ScopusCSV;
`;

  const outFile = `${varName}ScopusData.js`;
  fs.writeFileSync(outFile, code, 'utf8');
  console.log(`✓ ${outFile} created`);
}

createDataFile('Scopus (Civil Eng updated 13 May 26).csv', 'civil', 'Civil & Environmental');
createDataFile('computerScopusData.csv', 'computer', 'Computer');
createDataFile('electricalScopusData.csv', 'electrical', 'Electrical');
createDataFile('sustainabilityScopusData.csv', 'sustainability', 'Sustainability');

console.log('\nAll data files created!');
