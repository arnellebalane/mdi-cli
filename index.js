#!/usr/bin/env node
const inquirer = require('inquirer');
const icons = require('@mdi/svg/meta.json');
const Fuse = require('fuse.js');
const chalk = require('chalk');
const ora = require('ora');
const meow = require('meow');
const mdi = require('mdi-core');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

const fuse = new Fuse(icons, {
    shouldSort: true,
    threshold: 0,
    keys: ['name', 'aliases']
});
const spinner = ora('Generating icons');

const cli = meow(`
  ${chalk.cyan.underline('Usage:')}
    ${chalk.gray('$')} ${chalk.green('mdi')} ${chalk.yellow('[options]')} ${chalk.magenta('<icon-name> <icon-name> ...')}

  ${chalk.cyan.underline('Options:')}
    ${chalk.yellow('--size')}, ${chalk.yellow('-s')}         ${chalk.gray('Set the icon size. Defaults to 24px.')}
    ${chalk.yellow('--padding')}, ${chalk.yellow('-p')}      ${chalk.gray('Set the icon padding. Defaults to 0px.')}
    ${chalk.yellow('--radius')}, ${chalk.yellow('-r')}       ${chalk.gray('Set the icon border radius. Defaults to 0px.')}
    ${chalk.yellow('--foreground')}, ${chalk.yellow('-f')}   ${chalk.gray('Set the icon foreground color. Defaults to #333.')}
    ${chalk.yellow('--background')}, ${chalk.yellow('-b')}   ${chalk.gray('Set the icon background color. Defaults to transparent.')}
    ${chalk.yellow('--output')}, ${chalk.yellow('-o')}       ${chalk.gray('Write icons to this directory. Defaults to the current directory.')}

  ${chalk.cyan.underline('Examples:')}
    ${chalk.gray('$')} ${chalk.green('mdi')} ${chalk.yellow('-s 32 -p 4 -r 5 -f #aaa -b #fff')} ${chalk.magenta('google youtube twitter')}
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
    const iconPaths = await mdi(config);
    spinner.stop();

    console.log(); // Add an extra separator line
    iconPaths.forEach(iconPath => {
        console.log(`  Generated ${chalk.green(iconPath)}`);
    });
})();
