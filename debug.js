console.log('Debug script running');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test file system operations
const fs = require('fs');
const path = require('path');

try {
  const files = fs.readdirSync('.');
  console.log('Files in current directory:', files);
} catch (error) {
  console.error('Error reading directory:', error);
}

console.log('Debug script completed'); 