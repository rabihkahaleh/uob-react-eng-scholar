const fs = require('fs');
const path = require('path');

function gen(csvPath, outName, varName) {
  const csv = fs.readFileSync(csvPath, 'utf8');
  const esc = csv.split('\').join('\\').split('`').join('\`').split('$').join('\$');
  const code = `// Auto-generated data file\nconst ${varName} = \`${esc}\`;\nexport default ${varName};`;
  fs.writeFileSync(outName + '.js', code, 'utf8');
  console.log(`✓ ${outName}.js (${(code.length/1024).toFixed(1)}KB)`);
}

gen('Scopus (Civil Eng updated 13 May 26).csv', 'civilEnvScopusData', 'civilEnvScopusCSV');
gen('computerScopusData.csv', 'computerScopusData', 'computerScopusCSV');
gen('electricalScopusData.csv', 'electricalScopusData', 'electricalScopusCSV');
gen('sustainabilityScopusData.csv', 'sustainabilityScopusData', 'sustainabilityScopusCSV');
