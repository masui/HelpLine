//
//  CommandLine Help レンダラ
//
const electron = window.require('electron');
const remote = electron.remote;
const shell = electron.shell;
const clipboard = electron.clipboard; // clipboard.writeText() でクリップボードに文字列が入る

function init(){
    alert("init")
}

$(function() {
    init();
});

