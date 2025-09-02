// utils/logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.resolve(__dirname, '../log/test-log.txt');

function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

module.exports = {
  logToFile,
};