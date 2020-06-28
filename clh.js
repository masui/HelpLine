//
//  CommandLine Help レンダラ
//
const electron = window.require('electron');
//const electron = require('electron');
const remote = electron.remote;
const shell = electron.shell;
//const clipboard = electron.clipboard; // clipboard.writeText() でクリップボードに文字列が入る

const data = require("./data");
const Generator = require('re_expand');

var g; // ExpandHelp generator

// 実行時に取得する各種環境値
var files = '___';
var branches = remote.app.branches();
var params = 'param1|param2';
var numbers = '1|2|3';

const glossary = require("./glossary"); // 各種定義をいれておく
for(var e in glossary){
    s = `${e} = '${glossary[e]}'`;
    eval(s);
}

var commands = [];
var commandind = 0;
var selected = 0;
var g;

function generator(patterns){
    g = new Generator();

    files = remote.app.files(patterns); // レンダラプロセスではコマンド起動できないようなのでメインプロセスを利用してファイルリストを取得
    params = get_params(patterns);
    numbers = get_numbers(patterns);
    
    var lines = [];
    for(var def of data.defs){
	m = def.match(/^\s*\$\s*(.*)\s*$/);
	if(m){
            lines.push(m[1]);
	}
	m = def.match(/^\s*\%\s*(.*)\s*$/);
	if(m){
	    var cmd = m[1];
	    for(var line of lines){
		var desc = line.replace(/\s*{(\d+)}\s*$/,'');
		desc = ("\`"+desc+"\`").replace(/#{/g,'${');
		cmd = cmd.replace(/#{\$(\d+)}/g,"DOLLAR$1").replace(/DOLLAR/g,'$');
		g.add(`${eval(desc)}`,cmd);
	    }
	}
    }
    return g;
}

function sel(e){
    selected = Number($(e.target).attr('id').match(/(\d+)$/)[1]);
    show_selected();
    $("html,body").animate({scrollTop:$(`#entry${selected}`).offset().top - 100});
    $('#query').focus();
}
    
function get_params(patterns){
    var a = new Set;
    for(var pattern of patterns){
	var m;
	if(m = pattern.match(/^'(.*)'$/)){
	    a.add(m[1]);
	}
	if(m = pattern.match(/^"(.*)"$/)){
	    a.add(m[1]);
	}
	if(m = pattern.match(/^\[(.*)\]$/)){
	    a.add(m[1]);
	}
    }
    a = Array.from(a);
    if(a.length == 0){
	a = ['param'];
    }
    return a.join('|');
}

function get_numbers(patterns){
    var a = new Set;
    for(var pattern of patterns){
	if(pattern.match(/^\d+$/)){
	    a.add(pattern);
	}
    }
    a = Array.from(a);
    if(a.length == 0){
	a = ['1'];
    }
    return a.join('|');
}

function addentry(a, cmd){ // 候補を整形してリストに追加
    console.log(cmd);
    var num = cmd.match(/\s*{(\d+)}$/,"$1")[1]; // 説明ページの番号を取得
    cmd = cmd.replace(/\s*{(\d+)}$/,"");
    if(commands.indexOf(cmd) >= 0) return;
    commands[commandind] = cmd;
    var entry = $('<div>')
	    .on('click',sel)
	    .attr('id',`entry${commandind}`)
	    .attr('class','entry')
	    .appendTo($('#candidates'));
    var title = $('<span>')
	    .on('click',sel)
	    .attr('id',`title${commandind}`)
	    .attr('class','title')
	    .text(a[0])
	    .appendTo(entry);
    var icon = $('<img>')
	    .attr('id',`icon${commandind}`)
	    .attr('src',"https://www.iconsdb.com/icons/preview/orange/info-xxl.png")
	    .attr('class','icon')
	    .attr('desc',num)
	    .appendTo(entry);
    $('<br>').appendTo(entry);
    icon.on('click',function(e){
	// とてもよくわからないがこれで外部ブラウザを開ける
	var t = data.pages[$(e.target).attr('desc')];
	var url = `https://scrapbox.io/GitHelp/${t}`;
	shell.openExternal(url);
    });
    var code = $('<code>')
	    .on('click',sel)
	    .attr('id',`code${commandind}`)
	    .text(cmd)
	    .appendTo(entry);

    if(commandind == selected){
	entry.css('background-color','#ccc');
	title.css('background-color','#ccc');
    }
    else {
	entry.css('background-color','#fff');
	title.css('background-color','#fff');
    }

    commandind += 1;
}

var key_timeout = null;
var control = false;

function show_selected(){
    for(var i=0; i<commands.length; i++){
	if(selected == i){
	    $(`#entry${i}`).css('background-color','#ccc');
	    $(`#title${i}`).css('background-color','#ccc');
	}
	else {
	    $(`#entry${i}`).css('background-color','#fff');
	    $(`#title${i}`).css('background-color','#fff');
	}
    }
}

function init(){
    // keypressだと日本語入力時のEnterキーが入らない
    $('#query').on('keypress', function(e){
	if(e.keyCode == 13){
	    remote.app.finish(commands[selected]);
	}
    });
		   
    $('#query').on('keydown', function(e){
	if(e.keyCode == 17){ // Control Key
	    control = true;
	}
	else if(control && (e.keyCode == 67 || e.keyCode == 71)){ // Ctrl-C, Ctrl-G
	    remote.app.finish(remote.app.argv()[1]); // 引数をもとに戻す
	}
	else if((e.keyCode == 78 && control) || e.keyCode == 40){ // Ctrl-N or ↓
	    if(selected < commands.length-1){
		selected += 1;
		show_selected();
		$("html,body").animate({scrollTop:$(`#entry${selected}`).offset().top - 100});
	    }
	}
	else if((e.keyCode == 80 && control) || e.keyCode == 38){ // Ctrl-P or ↑
	    if(selected > 0){
		selected -= 1;
		show_selected();
		$("html,body").animate({scrollTop:$(`#entry${selected}`).offset().top - 100});
	    }
	}
    });
		   
    $('#query').on('keyup', function(e){
	if(e.keyCode == 17){
	    control = false;
	}
	else if(!control && e.keyCode != 40 && e.keyCode != 38){
	    $('#candidates').empty();
	    commandind = 0;
	    commands = [];
	    selected = 0;
	    show_selected();
	    
	    // インクリメンタルにファイル名やパラメタも計算してマッチング
	    // したいところだがそれだとすごく遅い
	    clearTimeout(key_timeout);
	    setTimeout(function(){
		var qstr = $('#query').val();
		g = generator(qstr.split(/\s+/));
		var pstr = qstr.replace(/'/g,'').replace(/"/g,'');
		g.filter(` ${pstr} `, addentry, 0);
	    },500);
	}
    });

    
    var arg = remote.app.argv()[1]
    if(arg.match(/^git/)){
	var qstr = arg.replace(/^git\s*/,'');
	$('#query').val(qstr);
	g = generator(qstr.split(/\s+/));
	var pstr = qstr.replace(/'/g,'').replace(/"/g,'');
	
	g.filter(` ${pstr} `, addentry, 0);
    }
    else {
	g = generator([]);
	g.filter(' ', addentry, 0);
    }

    $('#query').focus();
    
}

$(function() {
    init();
});

