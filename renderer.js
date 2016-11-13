// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const {ipcRenderer} = require('electron');
const jsonlint = require("jsonlint");
const less = require('less');
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');

function loadJsonFile(filePath) {
    try {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        json = jsonlint.parse(fileContent);
        return json
    } catch (e) {
        if (!e.message.startsWith("ENOENT: no such file or directory")) {
            ipcRenderer.send("error", "Json Error", e.toString());
            // ipcRenderer.send("jsonError", e.name + ': ' + e.message);
        }
    }
}

function loadTheme(filePath) {
    less.render(fs.readFileSync(filePath, 'utf8'), (e, output) => {
        if (e) {
            ipcRenderer.send("error", "css Theme Error", "Error at line " + e.line + ": " + e.message);
        } else {
            // $('head').append('<link rel="stylesheet" type="text/css">' + output.css + '</link>')
            $('head').append($('<style>' + output.css + '</style>'));
        }

    });
}

loadTheme("./theme.less");
