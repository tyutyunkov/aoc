let elves = await fetch('https://adventofcode.com/2022/day/1/input')
    .then(resp => resp.text())
    .then(data => data.split("\n"))
    .then(data => data.reduce((acc, item) => {
        acc.push(item === '' ? 0 : acc.pop() + (item - 0));
        return acc;
    }, [0]))
    .then(data => data.sort((a,b) => a - b));

console.log(elves.at(-1));
console.log(elves.slice(-3).reduce((acc, i) => acc + i, 0));
