const fs = require('fs');
const path = require('path');

// Create log file
const logFile = path.join(process.cwd(), 'debug.log');
fs.writeFileSync(logFile, 'Debug log started\n');

// Log to file function
function log(message) {
  fs.appendFileSync(logFile, message + '\n');
}

log('Debug script running');
log('Current working directory: ' + process.cwd());
log('NODE_ENV: ' + process.env.NODE_ENV);

// Test file system operations
try {
  const files = fs.readdirSync('.');
  log('Files in current directory: ' + JSON.stringify(files));
} catch (error) {
  log('Error reading directory: ' + error.message);
}

log('Debug script completed'); 