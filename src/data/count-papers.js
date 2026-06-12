import fs from 'fs';
import path from 'path';

function countPapersInCSV(filePath, depName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV - simple approach
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return { name: depName, count: 0, file: filePath };
    
    const header = lines[0].split(',');
    const eidIndex = header.findIndex(h => h.toLowerCase().includes('eid'));
    
    if (eidIndex === -1) {
      console.log(`${depName}: EID column not found in ${filePath}`);
      return { name: depName, count: 0, file: filePath };
    }
    
    const eids = new Set();
    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(',');
      const eid = fields[eidIndex]?.trim();
      if (eid && eid.startsWith('2-s2.0')) {
        eids.add(eid);
      }
    }
    
    return { name: depName, count: eids.size, file: filePath };
  } catch (e) {
    return { name: depName, count: 0, file: filePath, error: e.message };
  }
}

const files = [
  { path: 'civilEnvScopus.csv', name: 'Civil & Environmental' },
  { path: 'Scopus (Civil Eng updated 13 May 26).csv', name: 'Civil (v2)' },
  { path: 'computerScopusData.csv', name: 'Computer' },
  { path: 'Scopus (Computer Eng updated May 13).csv', name: 'Computer (v2)' },
  { path: 'electricalScopusData.csv', name: 'Electrical' },
  { path: 'sustainabilityScopusData.csv', name: 'Sustainability' },
];

const results = [];
for (const f of files) {
  const result = countPapersInCSV(f.path, f.name);
  results.push(result);
  console.log(`${result.name}: ${result.count} papers (${f.path})`);
}

const total = results.reduce((sum, r) => sum + r.count, 0);
console.log(`\nTotal: ${total} papers`);
