import fs from 'fs';
import { parse } from 'csv-parse/sync';

function generateDataFile(csvPath, deptId, deptName) {
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Escape special characters for JS string
    const escaped = csvContent
      .replace(/\/g, '\\')
      .replace(/`/g, '\`')
      .replace(/\$/g, '\$');
    
    const output = `// ${deptName} - Scopus Publication Data
// University of Balamand
// Auto-generated from CSV

const ${deptId}ScopusCSV = \`${escaped}\`;

export default ${deptId}ScopusCSV;
`;
    
    const fileName = `${deptId}ScopusData.js`;
    fs.writeFileSync(fileName, output, 'utf8');
    
    // Count papers
    const records = parse(csvContent, { columns: true });
    const uniqueEids = new Set();
    records.forEach(r => {
      const eid = r.EID?.trim();
      if (eid && eid.startsWith('2-s2.0')) {
        uniqueEids.add(eid);
      }
    });
    
    console.log(`✓ ${deptName}: ${uniqueEids.size} unique papers`);
    return uniqueEids.size;
  } catch (e) {
    console.error(`✗ ${deptName}: ${e.message}`);
    return 0;
  }
}

console.log('Regenerating data files from CSVs...\n');

let total = 0;
total += generateDataFile('Scopus (Civil Eng updated 13 May 26).csv', 'civil', 'Civil & Environmental');
total += generateDataFile('computerScopusData.csv', 'computer', 'Computer');
total += generateDataFile('electricalScopusData.csv', 'electrical', 'Electrical');
total += generateDataFile('sustainabilityScopusData.csv', 'sustainability', 'Sustainability');

console.log(`\nTotal papers: ${total}`);
