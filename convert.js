const path = require('path');
const directoryPath = path.join(__dirname, 'dns-records');
const json = require('./converters/json');
const yaml = require('./converters/yaml');

json.convertToCloudflare(directoryPath);
yaml.convertToCloudflare(directoryPath);