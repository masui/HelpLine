//
// HelpLine メインプロセス
//
var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var fs = require('fs');

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

//
// レンダリングプロセスから呼ばれる関数いろいろ
//
app.argv = function(){
    return process.argv
}

app.finish = function(cmd){
    console.log(cmd)
    //console.log("echo comment string\necho abc")
    app.quit()
}

app.pwd = function(){
    return process.env.PWD
    
    var pwd = process.env['HOME'];
    var pwdfile = "/tmp/githelp.pwd";

    try {
	fs.statSync(pwdfile);
    } catch(err) {
	return pwd;
    }
    return fs.readFileSync(pwdfile, 'utf8').replace(/\n/,'');
}

// パタンにマッチするファイルのリストを計算 (レンダラプロセスから呼ばれる)
app.files = function(patterns){
    // patterns = ['r']; // 動いているように見せる
    const command = `cd ${app.pwd()}; git ls-files`;
    var list = execSync(command).toString().split(/\n/);
    var files = new Set;
    for(var file of list){
	for(var i=0;i<patterns.length;i++){
	    var pattern = patterns[i];
	    if(pattern.length > 0){
		var re = new RegExp(pattern,'i');
		if(file.match(re)){
		    files.add(file);
		}
	    }
	}
    }
    var a = Array.from(files);
    if(a.length == 0) a = ["xxxxx"];
    return a
    //return a.join("|");
}

// ブランチリスト (レンダラプロセスから呼ばれる)
app.branches = function(){
    const command = `cd ${app.pwd()}; git branch`;
    var list = execSync(command).toString().split(/\n/);
    var branches = [];
    for(var branch of list){
	if(branch != ''){
	    branches.push(branch.replace(/^\s*/,'').replace(/^\*\s*/,''));
	}
    }
    if(branches.length == 0) branches = ["xxxxx"];
    return branches.join("|");
}

app.allowRendererProcessReuse = true; // こうしないとwarningが出る

function createWindow () {
    win = new BrowserWindow({
	width: 600,
	height: 400,
	//frame: false,
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
    win.setPosition(100,300)

    //win.webContents.openDevTools(); // デバッグコンソール表示
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
