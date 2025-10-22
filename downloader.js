const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const fs = require('fs/promises')
const path = require('path')
const {downloadFileWithCurl, getJSON}=require('./utils')

const releaseDir = path.join(__dirname, "release")

async function main(){
await fs.mkdir(releaseDir, { recursive: true })
let links = await getJSON(path.join(__dirname, 'links.json'))
for(let linkObj of links)
    await downloadFileWithCurl(linkObj.link, path.join(releaseDir, linkObj.filename))

}
main()
