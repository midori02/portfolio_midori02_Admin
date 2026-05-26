const fs = require('fs');
const path = require('path');
const pkgPath = './node_modules/@types/react/package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Add exports entry for index.d.ts
if (pkg.exports && !pkg.exports['./index.d.ts']) {
  pkg.exports['./index.d.ts'] = './index.d.ts';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('Added exports["./index.d.ts"] to @types/react package.json');
} else {
  console.log('exports already configured or not found');
}
