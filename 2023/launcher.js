const argv = require('minimist')(process.argv.slice(2));

if (!argv.d || !argv.p) {
    console.log("No arguments provided. Please provide the day and part as arguments.");
    process.exit(1);
}

const day = `${argv.d}`.padStart(2, '0');
const part = argv.p === 1 ? 'part1' : 'part2';
const mode = argv.r ? '' : '.test';

const input = require('fs')
    .readFileSync(`input_${day}${mode}.txt`, 'utf-8').trim()
    .split('\n');

const dayScript = require(`./advent_${day}`);

console.log(dayScript[part](input));