const { exec } = require('child_process');
const args = require('yargs').argv;
const {
    writeFile
} = require('fs');
const paths = {
    "theme" : __dirname + "/../../src/theme.json",
    "patterns" : __dirname + "/../../src/patterns.json"
};
const files =
    [
        {
            "theme": {
                "filename" : "theme.json",
                "required" : {
                    "colour_primary" : true,
                    "colour_secondary" : true
                }
            }
        },
        {
            "patterns": {
                "filename" : "patterns.json",
                "required" : {
                    "style" : [],
                    "script" : []
                }
            }
        }
    ];

const build_stylesheet =
    (theme, patterns) => {

    // Validate
    let errors = [];

    if(
        typeof theme !== 'object' ||
        typeof patterns !== 'object'
    ) {
        errors.push(
            "Invalid types passed to `theme` or `patterns`"
        );
    }

    if(errors.length>0) {
        console.log(errors);
        return errors;
    }

    files.forEach(o => {
        for(let prop in o) {
            if(
                Object
                .prototype
                .hasOwnProperty
                .call(o, prop)
            ) {
                for(let req in o[prop].required) {
                    const k =
                        o[prop].required[req];

                    const eProp =
                        eval(prop);

                    if(
                        typeof k === "boolean" &&
                        typeof eProp[req] === 'undefined'
                    ) {
                        errors.push(
                            `${req} is required and not defined.`
                        );
                    }

                    else if(
                        typeof k === 'object' &&
                        (
                            typeof eProp[req] === 'undefined' ||
                            typeof eProp[req] !== 'object'
                        )
                    ) {
                        errors.push(
                            `${req} is required and needs to be an array.`
                        );
                    }

                }
            }
        }
    });

    if(errors.length>0) {
        console.log(errors);
        return errors;
    }

    for(let k in paths) {
        if(
            Object
                .prototype
                .hasOwnProperty
                .call(paths, k)
        ) {

            writeFile(
                paths[k],
                JSON.stringify(eval(k), null, 2),
                (err) => {
                    if(err) console.log(err);
                    return false;
                });
        }
    }

    exec("npm run build");
};

build_stylesheet(
    JSON.parse(args.theme),
    JSON.parse(args.patterns)
);