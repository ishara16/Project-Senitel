const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;
const status = "HEALTHY";
const logFile = path.join(__dirname, 'logs', 'error.log');

app.get('/health', (req, res) => {
  res.json({ status, service: 'payment-service' });
});

app.get('/', (req, res) => {
  res.send('Payment Service is running');
});

app.listen(port, () => {
  console.log(`Payment Service listening at http://localhost:${port}`);
});

function logError(error) {
  const message = `[${new Date().toISOString()}] ERROR: ${error}\n`;
  fs.appendFileSync(logFile, message);
}
