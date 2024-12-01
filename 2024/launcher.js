const argv = require('minimist')(process.argv.slice(2));

if (!argv.d || !argv.p) {
    console.log("No arguments provided. Please provide the day and part as arguments.");
    process.exit(1);
}

const day = `${argv.d}`.padStart(2, '0');
const part = `part${argv.p}`
const mode = argv.r ? '' : '.test';

const input = require('fs')
    .readFileSync(`input_${day}${mode}.txt`, 'utf-8').trim()
    .split('\n');

const dayScript = require(`./advent_${day}`);

const formatTime = ms => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    let milliseconds = (ms % 1000).toFixed(0);

    return (minutes ? `${minutes}m ` : '') + `${seconds}s ${milliseconds}ms`;
}

const start = new Date();
console.log(`Star${part.substring(4)}:`, dayScript[part](input));
console.log('Duration: ', formatTime(new Date().getTime() - start.getTime()));