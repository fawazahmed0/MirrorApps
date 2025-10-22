const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const fs = require('fs/promises')
const path = require('path')

async function downloadFileWithCurl(link, pathToFileSave, signal) {
await exec(`curl -f -L -o "${pathToFileSave}" "${link}"`, { signal, maxBuffer: Infinity }).catch(console.error)
}

async function getJSON(pathToJSON) {
    let data = await fs.readFile(pathToJSON, { encoding: 'utf8' })
    return JSON.parse(data)
}

module.exports = {downloadFileWithCurl, getJSON}
