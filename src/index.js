import patterns from './patterns.json';

patterns.style.forEach((val, i) => {
    require(
        __dirname + "/patterns/" + val + "/" + val + ".scss"
    );
});

patterns.script.forEach((val, i) => {
    require(
        __dirname + "/patterns/" + val + "/" + val + ".js"
    );
});