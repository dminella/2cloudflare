'use strict';
var fs = require('fs');
const yaml = require('js-yaml')

function appendInConvertedJsonFile(convertedRecord) {
    fs.appendFile('converted/jsonToCloudflare.txt', convertedRecord, function (err) {
        if (err) throw err;
    });
}

module.exports.convertToCloudflare = function (directoryPath) {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(file => {
            if (file.endsWith('.yaml')) {
                fs.readFile(`${directoryPath}/${file}`, (err, dnsRecordFile) => {
                    if (err) throw err;
                    let dnsRecords = yaml.safeLoadAll(dnsRecordFile);
                    dnsRecords.forEach(dnsRecord => {
                        dnsRecord.rrdatas.forEach(value => {
                            const convertedRecord = `${dnsRecord.name} IN ${dnsRecord.type} ${value}\n`;
                            appendInConvertedJsonFile(convertedRecord);
                        });
                    });
                });
            }
        });
    });
};