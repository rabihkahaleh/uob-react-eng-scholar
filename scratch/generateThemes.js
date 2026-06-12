const fs = require('fs');

const fileContent = fs.readFileSync('src/data/computerScopusData.js', 'utf8');

const mlKeywords = ['neural', 'learning', 'svm', 'support vector', 'fuzzy', 'classification', 'pattern', 'clustering', 'classifier', 'machine learning', 'deep learning', 'vision'];

let eids = [...fileContent.matchAll(/2-s2\.0-\d+/g)].map(m => m[0]);
let uniqueEids = [...new Set(eids)];
console.log('Total unique EIDs:', uniqueEids.length);

let cePapers = [];
uniqueEids.forEach(eid => {
    let idx = fileContent.indexOf(eid);
    let context = fileContent.substring(Math.max(0, idx - 800), idx).toLowerCase();
    
    let matchedKw = mlKeywords.find(kw => context.includes(kw));
    if (matchedKw) {
        cePapers.push({eid, matchedKw});
    }
});

console.log('Found ML papers via context:', cePapers.length);

let output = 'const extraThemes = {\n';
cePapers.forEach((p) => {
    let subTheme = 'CE1.1'; // Default: Neural Networks & Deep Learning
    if (['svm', 'support vector', 'classification', 'classifier'].includes(p.matchedKw)) subTheme = 'CE1.2';
    if (['fuzzy', 'clustering'].includes(p.matchedKw)) subTheme = 'CE1.3';
    if (['vision', 'pattern'].includes(p.matchedKw)) subTheme = 'CE1.4';
    
    output += `  "${p.eid}": "${subTheme}",\n`;
});
output += '};\nexport default extraThemes;\n';

fs.writeFileSync('scratch/extraThemes.js', output);
console.log('Written to scratch/extraThemes.js');
