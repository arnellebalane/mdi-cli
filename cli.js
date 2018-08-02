#!/usr/bin/env node
const inquirer = require('inquirer');
const icons = require('@mdi/svg/meta.json');
const Fuse = require('fuse.js');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

const fuse = new Fuse(icons, {
    shouldSort: true,
    threshold: 0,
    keys: ['name', 'aliases']
});

inquirer.prompt([{
    type: 'checkbox-plus',
    name: 'iconNames',
    message: 'Icon names:',
    source(answers, input) {
        return input
            ? Promise.resolve(fuse.search(input))
            : Promise.resolve(icons.map(icon => icon.name));
    },
    searchable: true,
    highlight: true
}, {
    type: 'input',
    name: 'iconSize',
    message: 'Icon size (px):',
    default: 24
}, {
    type: 'input',
    name: 'iconPadding',
    message: 'Icon padding (px):',
    default: 0
}, {
    type: 'input',
    name: 'foregroundColor',
    message: 'Foreground color:',
    default: '#333'
}, {
    type: 'input',
    name: 'backgroundColor',
    message: 'Background color:',
    default: 'none',
    filter: value => value === 'none' ? 'transparent' : value
}]).then(console.log);
