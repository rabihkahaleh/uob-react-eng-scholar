import fs from 'fs';
import { parse } from 'csv-parse/sync';

function countPapers(filePath, depName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true });
    
    const eids = new Set();
    records.forEach(record => {
      const eid = record['EID']?.trim();
      if (eid && eid.startsWith('2-s2.0')) {
        eids.add(eid);
      }
    });
    
    return { name: depName, count: eids.size, file: filePath };
  } catch (e) {
    return { name: depName, count: 0, file: filePath, error: e.message };
  }
}

const files = [
  { path: 'Scopus (Civil Eng updated 13 May 26).csv', name: 'Civil & Environmental' },
  { path: 'computerScopusData.csv', name: 'Computer' },
  { path: 'electricalScopusData.csv', name: 'Electrical' },
  { path: 'sustainabilityScopusData.csv', name: 'Sustainability' },
];

let total = 0;
files.forEach(f => {
  const result = countPapers(f.path, f.name);
  console.log(`${result.name}: ${result.count}`);
  total += result.count;
});
console.log(`\nTotal: ${total}`);
