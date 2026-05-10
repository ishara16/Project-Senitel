const fs = require('fs');
const path = require('path');

const SERVICES = ['auth-service', 'payment-service', 'inventory-service'];
const BUGS = [
  'syntax_error',
  'delete_package_json',
  'corrupt_log',
  'undefined_variable',
  'logic_error'
];

const logFile = path.join(__dirname, 'chaos.log');

function logChaos(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
  console.log(message);
}

function updateStatus(service, status) {
  const statusPath = path.join(__dirname, '..', 'services', service, 'status.json');
  const data = { status, lastUpdated: new Date().toISOString() };
  fs.writeFileSync(statusPath, JSON.stringify(data, null, 2));
}

async function runChaos() {
  const serviceName = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const bugType = BUGS[Math.floor(Math.random() * BUGS.length)];
  const servicePath = path.join(__dirname, '..', 'services', serviceName);
  const indexPath = path.join(servicePath, 'index.js');

  logChaos(`Targeting ${serviceName} with bug: ${bugType}`);
  updateStatus(serviceName, 'CRITICAL');

  switch (bugType) {
    case 'syntax_error':
      fs.writeFileSync(indexPath, 'const 123 = "invalid syntax";');
      break;
    case 'delete_package_json':
      fs.unlinkSync(path.join(servicePath, 'package.json'));
      break;
    case 'corrupt_log':
      fs.writeFileSync(path.join(servicePath, 'logs', 'error.log'), '�'.repeat(1000));
      break;
    case 'undefined_variable':
      let content = fs.readFileSync(indexPath, 'utf8');
      content = content.replace(/const status = "HEALTHY"/, 'const status = undefined');
      fs.writeFileSync(indexPath, content);
      break;
    case 'logic_error':
      let logicContent = fs.readFileSync(indexPath, 'utf8');
      // Insert a simple infinite loop before the server starts
      logicContent = logicContent.replace('app.listen(port, () => {', 'while(true){ console.log("Chaos loop!"); } app.listen(port, () => {');
      fs.writeFileSync(indexPath, logicContent);
      break;
  }

  logChaos(`Successfully broke ${serviceName}`);
}

runChaos().catch(err => {
  console.error('Chaos Monkey failed:', err);
});
