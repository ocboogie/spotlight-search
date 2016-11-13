// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const {ipcRenderer} = require('electron');
const jsonlint = require("jsonlint");

console.log($("body h1").text());

let file = './config.json';

try {
    let fileContent = fs.readFileSync(file, 'utf8');
    config = jsonlint.parse(fileContent);
} catch (e) {
    if (!e.message.startsWith("ENOENT: no such file or directory")) {
        ipcRenderer.send("jsonError", e.toString());
        // ipcRenderer.send("jsonError", e.name + ': ' + e.message);
    }
}
