var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];

rl.on('line', function(line){
    lines.push(line);
});

rl.on('close', () => {
    let res = lines[0]
        .split(" ")
        .map(x => +x)
        .sort((a, b) => a - b)
        .reduce((acc, next) => acc - next, 5050)
    console.log(Math.abs(res));
});