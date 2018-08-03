const puppeteer = require('puppeteer');

function getPageUrl(config) {
    const params = [
        `iconNames=${config.iconNames.join(',')}`,
        `iconSize=${config.iconSize}`,
        `iconPadding=${config.iconPadding}`,
        `foregroundColor=${config.foregroundColor}`,
        `backgroundColor=${config.backgroundColor}`
    ].join('&');

    return `file://${__dirname}/index.html?${params}`;
}

module.exports = async config => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(getPageUrl(config));

    const iconNames = await page.$$eval('div', divs => divs.map(div => div.id));
    const iconPaths = iconNames.map(iconName => `${iconName}.png`);
    const iconHandles = await page.$$('div');

    await Promise.all(iconHandles.map((iconHandle, i) => iconHandle.screenshot({
        path: iconPaths[i],
        omitBackground: true
    })));

    await browser.close();

    return iconPaths;
};
