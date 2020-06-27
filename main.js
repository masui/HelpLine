//
// Command Line Help (CLH) メインプロセス
//
var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;

var child_process = require('child_process');
var exec = child_process.exec;
var execSync = child_process.execSync;

// window objectがGCされないようにするために、globalに定義する
var win;

console.log(process.argv)

// レンダリングプロセスから呼べるようにする
//app.files = files;
//app.branches = branches;
//app.pwd = pwd;
//app.prompt = prompt;

function createWindow () {
    win = new BrowserWindow({
	width: 600,
	height: 400,
	frame: false
    });
    win.loadURL(`file://${__dirname}/index.html`);

    // 常に最前面でフォーカスされるようにする
    win.setAlwaysOnTop(true);
    win.on('blur', () => {
	win.focus();
    });
    win.setPosition(100,100)

    // win.webContents.openDevTools(); // デバッグコンソール表示
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
	app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
	createWindow();
    }
});

// app.quit()
