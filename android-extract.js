const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const fs = require('fs/promises')
const path = require('path')
const { chromium } = require('playwright');
const { downloadFileWithCurl, extractWith7zip } = require('./utils')


async function main() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://developers.google.com/android/images', { waitUntil: 'networkidle' });
    await page.getByText('Acknowledge').click()
    // get first zip link in page
    const zipLink = await page.locator('a[href$=".zip"]').first().getAttribute('href');
    await browser.close();

    const rootExtractFolder = path.join(__dirname, 'extract')
    await fs.mkdir(rootExtractFolder, { recursive: true })
    const zipPath = path.join(rootExtractFolder, 'android_image.zip')
    await downloadFileWithCurl(zipLink, zipPath)

    await recursiveExtract(rootExtractFolder)

}

main()


async function recursiveExtract(filePath) {
    const files = await fs.readdir(filePath);

    for (const file of files) {
        const fileFullPath = path.join(filePath, file);
        const stats = await fs.stat(fileFullPath);

        if (stats.isDirectory()) {
            await recursiveExtract(fileFullPath);
        } else if (path.extname(fileFullPath) == ".apk") {
            const releaseDir = path.join(__dirname, 'release');
            await fs.mkdir(releaseDir, { recursive: true });
            await fs.rename(fileFullPath, path.join(releaseDir, file));
        } else {
            const extractFolder = path.join(filePath, crypto.randomUUID());
            await fs.mkdir(extractFolder, { recursive: true });
            await extractWith7zip(fileFullPath, extractFolder).catch(console.error);
            await fs.rm(fileFullPath, { recursive: true, force: true }); // Remove the original archive after extraction
            files.push(path.basename(extractFolder)); // Add the new folder to the list for further processing
        }

    }
}