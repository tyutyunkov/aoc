const fetch = require('node-fetch');
const fs = require('fs').promises;
const {JSDOM} = require('jsdom');

if (process.argv.length <= 2) {
    console.log('No arguments provided. Please provide the day as an argument.');
    process.exit(1);
}

const SESSION = '<>';
const year = 2023;
const day = process.argv[2];
const dayCode = day.padStart(2, '0');

const url = `https://adventofcode.com/${year}/day/${day}`;
fetch(url, {
    headers: {
        Cookie: `session=${SESSION}`
    }
})
    .then(response => response.text())
    .then(html => new JSDOM(html))
    .then(dom => dom.window.document.querySelector('pre > code'))
    .then(codeBlock => codeBlock && Promise.resolve(codeBlock.textContent) || Promise.reject('Couldn\'t find example'))
    .then(exampleData => fs.writeFile(`input_${dayCode}.test.txt`, exampleData))
    .catch(error => console.error(error))

fetch(`${url}/input`, {
    headers: {
        Cookie: `session=${SESSION}`
    }
})
    .then(response => response.text())
    .then(data => fs.writeFile(`input_${dayCode}.txt`, data))
    .catch(error => console.error(error))

fs.copyFile('advent_template.js', `advent_${dayCode}.js`, fs.constants.COPYFILE_EXCL)
    .catch(error => error.errno !== -17 && console.error(error))