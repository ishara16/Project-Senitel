const fs = require('fs');
const path = require('path');
const assert = require('assert');

const LOG_FILE = path.join(__dirname, '../logs/error.log');

async function testLogIntegrity() {
  console.log('Running log integrity regression test...');
  try {
    const data = fs.readFileSync(LOG_FILE, 'utf8');

    // Check if file contains non-printable characters or is unexpectedly binary
    const isBinary = data.includes('\0') || (data.match(/[^\x20-\x7E\n\r\t]/g) || []).length > data.length * 0.1;

    if (isBinary) {
      throw new Error('Log file corruption detected: non-printable characters found');
    }

    console.log('✅ Log integrity check passed.');
  } catch (error) {
    console.error('❌ Log integrity check failed:', error.message);
    process.exit(1);
  }
}

testLogIntegrity();
