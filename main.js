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

// レンダリングプロセスから呼べるようにする
//app.files = files;
//app.branches = branches;
//app.pwd = pwd;
//app.prompt = prompt;

function finish(){
    console.log("finish")
    app.quit()
}
app.finish = finish;

app.allowRendererProcessReuse = true; // こうしないとwarningが出る

function createWindow () {
    win = new BrowserWindow({
	width: 600,
	height: 400,
	frame: false,
	webPreferences: { // Electron5.0で必要? https://stackoverflow.com/questions/56091343/typeerror-window-require-is-not-a-function
	    nodeIntegration: true
	}
    });
    win.loadURL(`file://${__dirname}/index.html`);

    // 常に最前面でフォーカスされるようにする
    win.setAlwaysOnTop(true);
    win.on('blur', () => {
	win.focus();
    });
    win.setPosition(100,100)

    win.webContents.openDevTools(); // デバッグコンソール表示
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
