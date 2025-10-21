async function downloadFileWithCurl(link, pathToFileSave, signal) {
await exec(`curl -f -L -o "${pathToFileSave}" "${link}"`, { signal, maxBuffer: Infinity }).catch(console.error)
}

module.exports = {downloadFileWithCurl}
