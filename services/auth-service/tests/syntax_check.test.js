const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.js');
const code = fs.readFileSync(filePath, 'utf8');

try {
    new Function(code);
    console.log('Syntax check passed: No syntax errors found in index.js');
} catch (e) {
    console.error('Syntax check failed: ' + e.message);
    process.exit(1);
}
