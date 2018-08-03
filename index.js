const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${__dirname}/index.html?icons=access-point,chevron-left&size=24&padding=4`);

    const iconNames = await page.$$eval('div', divs => divs.map(div => div.id));
    console.log(iconNames);

    const iconHandles = await page.$$('div');
    await Promise.all(iconHandles.map((iconHandle, i) => iconHandle.screenshot({
        path: iconNames[i] + '.png',
        omitBackground: true
    })));

    await browser.close();
})();
