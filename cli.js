#!/usr/bin/env node
const inquirer = require('inquirer');
const icons = require('@mdi/svg/meta.json');
const Fuse = require('fuse.js');
const chalk = require('chalk');
const ora = require('ora');
const meow = require('meow');
const generateIcons = require('./index');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

const fuse = new Fuse(icons, {
    shouldSort: true,
    threshold: 0,
    keys: ['name', 'aliases']
});
const spinner = ora('Generating icons');

const cli = meow(`
  Usage:
    $ mdi [options] <icon-name>, <icon-name>, ...

  Options:
    --size, -s         Set the icon size. Defaults to 24px.
    --padding, -p      Set the icon padding. Defaults to 0px.
    --radius, -r       Set the icon border radius. Defaults to 0px.
    --foreground, -f   Set the icon foreground color. Defaults to #333.
    --background, -b   Set the icon background color. Defaults to transparent.
    --output, -o       Write icons to this directory. Defaults to the current directory.

  Examples:
    $ mdi -s 32 -p 4 -r 5 -f #aaa -b #fff
`, {
    flags: {
        size: {
            type: 'string',
            alias: 's',
            default: '24'
        },
        padding: {
            type: 'string',
            alias: 'p',
            default: '0'
        },
        radius: {
            type: 'string',
            alias: 'r',
            default: '0'
        },
        foreground: {
            type: 'string',
            alias: 'f',
            default: '#333'
        },
        background: {
            type: 'string',
            alias: 'b',
            default: 'transparent'
        },
        output: {
            type: 'string',
            alias: 'o',
            default: '.'
        }
    },
    inferType: true
});

const promptOptions = [{
    type: 'checkbox-plus',
    name: 'names',
    message: 'Icon names:',
    source(answers, input) {
        return input
            ? Promise.resolve(fuse.search(input))
            : Promise.resolve(icons.map(icon => icon.name));
    },
    searchable: true
}, {
    type: 'input',
    name: 'size',
    message: 'Icon size (px):',
    default: 24,
    filter: Number
}, {
    type: 'input',
    name: 'padding',
    message: 'Icon padding (px):',
    default: 0,
    filter: Number
}, {
    type: 'input',
    name: 'radius',
    message: 'Border radius (px):',
    default: 0,
    filter: Number
}, {
    type: 'input',
    name: 'foreground',
    message: 'Foreground color:',
    default: '#333'
}, {
    type: 'input',
    name: 'background',
    message: 'Background color:',
    default: 'transparent'
}, {
    type: 'input',
    name: 'output',
    message: 'Output path:',
    default: 'current directory',
    filter(input) {
        return input === 'current directory' ? '.' : input;
    }
}];

(async () => {
    const useBuilder = process.argv.length === 2;
    const config = useBuilder
        ? await inquirer.prompt(promptOptions)
        : cli.flags;
    if (!useBuilder) {
        config.names = cli.input;
    }

    spinner.start();
    const iconPaths = await generateIcons(config);
    spinner.stop();

    console.log(); // Add an extra separator line
    iconPaths.forEach(iconPath => {
        console.log(`  Generated ${chalk.green(iconPath)}`);
    });
})();
