# Pattern Library Builder
#### The purpose of this project is to provide some basic tools to help create and manage design patterns. 

## Documentation

### Get started

**Clone the repository**

`git clone https://github.com/bambattajb/dpl-starterkit .`

**Install the dependencies**

`npm install`

### Commands

####``npm run dev``

Starts a development server and a watch task.

####``npm run build``

Builds the assets and puts them in `/dist`

####``npm run pattern-create``

Generates boilerplate code for a new Design Pattern and adds it to `src/patterns`.

####``npm stylesheet build -- --theme=JSON_STRING --patterns=JSON_STRING``

Builds the stylesheet.

`--theme` allows you to pass in SASS variable values. 

**Example:**

``npm run stylesheet-build -- --theme="{\"colour_primary\":\"#123456\",\"colour_secondary\":\"#654321\"}""``

`--patterns` allows you to specify the patterns you want to include in the stylesheet. 

**Example:**

``npm run stylesheet-build -- --patterns="{\"style\":[\"test\"],\"script\":[\"test\"]}"``

Use both in arguments list. 

### Setup
#### Enabling Design Patterns
Add pattern styles and scripts to the build process by referencing them in `src/patterns.json` as an array. 

**Example:**

````
patterns.json
{
    "style" : ["hero", "navbox"],
    "script" : ["hero"]
}
````

#### Setting SASS variables
Set variables in JSON format by adding them to `src/theme.json`

**Example**

````
theme.json
{
  "colour_primary": "#222222",
  "colour_secondary": "#333333"
}
````

````
some-pattern.scss
@import '../../theme.json';

.test {
  background:$colour_primary; // var set in theme.json
}

````
