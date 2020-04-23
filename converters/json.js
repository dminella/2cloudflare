'use strict';
var fs = require('fs');

function appendInConvertedJsonFile (convertedRecord) {
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
            if (file.endsWith('.json')) {
                fs.readFile(`${directoryPath}/${file}`, (err, dnsRecordFile) => {
                    if (err) throw err;
                    let dnsRecords = (JSON.parse(dnsRecordFile)).ResourceRecordSets;
                    dnsRecords.forEach(dnsRecord => {
                        if (dnsRecord.ResourceRecords) {
                            dnsRecord.ResourceRecords.forEach(value => {
                                const convertedRecord = `${dnsRecord.Name}	1	IN	${dnsRecord.Type}	${value.Value}\n`;
                                appendInConvertedJsonFile(convertedRecord);
                            });
                        } else {
                            const convertedRecord = `${dnsRecord.Name}	1	IN	${dnsRecord.Type}	${dnsRecord.AliasTarget.DNSName}\n`;
                            appendInConvertedJsonFile(convertedRecord);
                        }
                    });
                });
            }
        });
    });
};