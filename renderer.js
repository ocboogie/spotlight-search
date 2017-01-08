// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const {
    ipcRenderer
} = require('electron');
const jsonlint = require("jsonlint");
const less = require('less');
const path = require('path');
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');

const commands = require("./commands.js")

console.log(commands);

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

function reloadStylesheets() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function() {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}

function renderLess(filePath) {
    less.render(fs.readFileSync(filePath, 'utf8'), (e, output) => {
        if (e) {
            ipcRenderer.send("error", "css Theme Error", "Error at line " + e.line + ": " + e.message);
        } else {
            console.log(path.dirname(filePath) + "/" + path.basename(filePath, "less") + "css");
            fs.writeFileSync(path.dirname(filePath) + "/" + path.basename(filePath, "less") + "css", output.css);
        }

    });
}

function dev() {
    renderLess("css/style.less")
    renderLess("theme.less")
    reloadStylesheets();
}

function checkCommand(value) {
    let command = value.split(" ")[0];
    let args = value.split(" ").splice(1)
    commands.forEach((item) => {
        if (command === item.name) {
            item.func(args)
            return;
        }
    });
}

function registerKeys() {
    $(".search-input").bind("enterKey", function(e) {
        console.log("enterKey");
        checkCommand($(".search-input").val())
    });
    $(".search-input").keyup(function(e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
}

function run() {
    dev();
    registerKeys();
}

ipcRenderer.on("reload-theme", (filePath) => {
    renderLess("theme.less");
    reloadStylesheets();
});

run();
