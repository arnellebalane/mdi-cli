const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const templatePath = path.resolve(__dirname, 'index.html');
const iconsBasePath = path.resolve(__dirname, 'node_modules/@mdi/svg/svg')

function getPageUrl(config) {
    const templateContents = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContents);

    config.icons = config.iconNames.map(iconName => {
        const iconPath = path.resolve(iconsBasePath, iconName + '.svg');
        const iconContents = fs.readFileSync(iconPath, 'utf8');
        const svgIndex = iconContents.indexOf('<svg');
        const icon = iconContents.slice(svgIndex);
        return {name: iconName, content: icon};
    });

    const rendered = template(config);
    const base64 = Buffer.from(rendered).toString('base64');

    return 'data:text/html;base64,' + base64;
}

module.exports = async config => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(getPageUrl(config));

    const iconNames = await page.$$eval('div', divs => divs.map(div => div.id));
    const iconPaths = iconNames.map(
        iconName => path.resolve(config.outputPath, `${iconName}.png`));
    const iconHandles = await page.$$('div');

    await Promise.all(iconHandles.map((iconHandle, i) => iconHandle.screenshot({
        path: iconPaths[i],
        omitBackground: true
    })));

    await browser.close();

    return iconPaths;
};
