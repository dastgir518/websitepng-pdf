const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Setup Puppeteer with stealth mode
puppeteer.use(StealthPlugin());


// Create a delay function using setTimeout wrapped in a Promise
const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};


// Directory for screenshots
const screenshotsDir = path.join(__dirname, '../public/screenshots');

// Ensure the screenshots directory exists
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Function to take a screenshot
async function takeScreenshot(url, taskId) {

    let executablePath = '/usr/bin/chromium-browser'; // Default to Chromium on Ubuntu
    if (fs.existsSync('/usr/bin/chromium')) {
        executablePath = '/usr/bin/chromium'; // Use Chromium inside Docker if available
    }




    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath, // Use system-installed
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set the user agent and viewport to keep the canvas size consistent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });  // Set a standard full HD viewport size

    // Go to the URL and wait until the page is fully loaded
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('#doughnut_chart', { visible: true });
    await delay(5000);
    const screenshotFileName = `ss-${taskId}.png`;
    const screenshotPath = path.join(screenshotsDir, screenshotFileName);
    
    // Take a full-page screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true, fromSurface: true,captureBeyondViewport: true });

    await browser.close();
    return screenshotFileName;
}

module.exports = { takeScreenshot };
