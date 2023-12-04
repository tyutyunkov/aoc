
let input = (await fetch('https://adventofcode.com/2022/day/7/input').then(resp => resp.text())).trimEnd();

let root = {};
let doCmd = (context, cmd) => {
    switch (cmd[0]) {
        case 'cd':
            let cd;
            switch (cmd[1]) {
                case '/':
                    cd = context.root;
                    break;
                case '..':
                    cd = context.cur.parent;
                    break;
                default:
                    cd = context.cur.files[cmd[1]];
            }
            !!cd || console.error(`unexpected dir: ${cmd[1]}`);
            context.cur = cd;
            break;
        case 'ls':
            context.listDir = true;
            context.cur.files = {};
            break;
        default:
            console.error(`unexpected command: ${cmd[0]}`)
    }
    return context;
}

input.split('\n')
    .reduce((context, line) => {
        if (line.startsWith('$')) {
            context.listDir = false;
            return doCmd(context, line.split(' ').slice(1));
        }
        if (context.listDir) {
            let parts = line.split(' ');
            let name = parts[1];
            let isDir = line.startsWith('dir');
            let size = isDir ? 0 : (parts[0] - 0);
            context.cur.files[name] = {isDir, name, size, parent: context.cur};
        }
        return context;
    }, {root, cur: root, listDir: false})

let duhs = dir => dir.size = Object.values(dir.files)
        .reduce((acc, file) => acc + (!file.isDir ? file.size : duhs(file)), 0);

let flatTree = dir => Object.values(dir.files)
    .filter(file => !!file.isDir)
    .flatMap(file => [file, ...flatTree(file)]);

let flat = flatTree(root);

let part1 = flat.reduce((acc, dir) => dir.size <= 100000 ? acc + dir.size : acc, 0);

let tofree = root.size - 40000000;
let part2 = flat.sort((a,b) => a.size - b.size)
    .filter(dir => dir.size >= tofree)
    [0].size;

console.log(part1);
console.log(part2);