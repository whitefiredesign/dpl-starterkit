const path =
    require('path');
const sprintf =
    require('sprintf-js').sprintf;
const {
    existsSync,
    mkdirSync,
    writeFile
} = require('fs');
const readline =
    require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });

const templates = {
    "scss" : {
        "replacements": 0,
        "content": "@import '../../theme.json';\n"
    },
    "twig" : {
        "replacements": 1,
        "content": "<div class=\"dpl-%(name)s\">\n" +
            "\t<p>{{ pattern_title }}</p>\n" +
            "\t{{ pattern_name }}\n" +
            "</div>\n",

    },
    "doc.twig" : {
        "replacements" : 1,
        "content" : "{%% extends \"@templates/doc-body.twig\" %%}\n" +
            "{%% block body %%}\n" +
            "\t{%% include \"@patterns/%(name)s/%(name)s.twig\" %%}\n" +
            "{%% endblock %%}\n"
    },
    "js" : {
        "replacements" : 0,
        "content" : "console.log(\"DELETE IF NOT REQUIRED\")",
    },
    "json" : {
        "replacements": 2,
        "content": "{\n\t\"pattern_name\": \"%(name)s\", \n\t\"pattern_title\": \"%(title)s\" \n}\n"
    }
};

const patternDir =
    __dirname + '/../../src/patterns/';

readline
    .question(`Name for pattern?`,
        (name) => {

            const lcaseName =
                name.toLowerCase();

            if(existsSync(patternDir + lcaseName)) {
                console.log(`${name} already exists.`);
                readline.close();
                return false;
            }

            console.log(`Creating pattern ${name}...`);
            mkdirSync(patternDir + lcaseName);

            for(let key in templates) {
                if (Object.prototype.hasOwnProperty.call(templates, key)) {

                    let fileContent =
                        templates[key].content;
                    if(templates[key].replacements===1) {
                        fileContent =
                            sprintf(fileContent, {
                                name : lcaseName
                            });
                    }
                    if(templates[key].replacements===2) {
                        fileContent =
                            sprintf(fileContent, {
                                name: lcaseName,
                                title: name
                            })
                    }

                    const
                        fileName =
                            lcaseName + "." + key,
                        filePath =
                            patternDir + "/" + lcaseName + "/" + fileName;

                    writeFile(
                        filePath,
                        fileContent,
                        (err) => {
                            if(err) console.log(err);
                            readline.close()
                        })
                }
            }

            console.log(`Pattern ${name} successfully created.`);

            readline.close()
        });