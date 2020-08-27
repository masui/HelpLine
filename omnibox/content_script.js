require("re_expand") // browserifyで展開
const crypto = require('crypto')

var suggests = []
for(var i=0;i<100;i++){
    suggests[i] = {}
}
var suggestnames = []
for(var i=0;i<100;i++){
    suggestnames[i] = `suggests${i}`
}

var descs = []

var status = $('<div>')
    .css('position','absolute')
    .css('width','100%')
    .css('height','18pt')
    .css('top',`${$(window).height()-18}px`)
    .css('left','0pt')
    .css('background-color','#ffd')
    .appendTo($('body'))
    .hide()

function hash(str){ // 文字列を0〜255の値に
    const md5 = crypto.createHash('md5')
    return parseInt(md5.update(str).digest('hex').substring(0,4),16) % 100
}

function terminate_def(cmd){
    var h = hash(cmd)
    if(descs.length > 0){
	for(l of descs){
	    var m = l.match(/^\?\s+(.*)/)
	    expanded = m[1].replace(/[\[\]]/g,'').expand() // Helpfeel記法の正規表現を展開
	    for(s of expanded){
		suggests[h][s] = cmd
	    }
	}
	var setval = {}
	setval[`suggests${h}`] = suggests[h]
	chrome.storage.local.set(setval, function(){ });
    }
    descs = []
}

function register_page(){
    var cmd = location.href
    var h = hash(cmd)
    
    var desc=window.prompt(`Help説明文を入力`,document.title);
    if(desc){
	var expanded = desc.expand() // Helpfeel記法の正規表現を展開
	for(var s of expanded){
	    status.text(s)
	    suggests[h][s] = cmd
	}
	var setval = {}
	setval[`suggests${h}`] = suggests[h]
	chrome.storage.local.set(setval, function(){ });
    }
    else { // descが空のとき
	status.hide()
	alert(`ヘルプを消去します (${cmd})`)
	// suggests[h][s] == cmd のものを削除
	var name = `suggests${h}`
	chrome.storage.local.get(name, function (value) {
	    suggests = value[name]
	    for (var x in suggests){
		if(suggests[x].match(cmd)){
		    delete suggests[x]
		}
	    }
	    var setval = {}
	    setval[name] = suggests
	    chrome.storage.local.set(setval, function(){ });
	})
    }
}


function process(lines,project){
    //
    // Scrapboxページの内容を1行ずつ調べてHelpfeel記法を処理する
    //
    descs = [] // Helpfeel記法
    let title = lines[0].text
    let found = false
    for(var entry of lines){
	var line = entry.text
	if(line.match(/^\?\s/)){ // ? ではじまるHelpfeel記法
	    desc = line.replace(/^\?\s+/,'')
	    status.text(decodeURIComponent(`${title} - ${desc}`))
	    descs.push(line)
	    found = true
	}
	else if(line.match(/^\%\s/)){ // % ではじまるコマンド指定
	    if(descs.length == 0){
		alert(`Helpfeel記法が定義されていません - ${title} / ${line}`)
	    }
	    else {
		m = line.match(/^\%\s+(echo|open)\s+(.*)/)
		if(m){
		    terminate_def(m[2])
		}
		descs = []
	    }

	}
	else {
	    terminate_def(`https://scrapbox.io/${project}/${title}`)
	}
    }
    terminate_def(`https://scrapbox.io/${project}/${title}`)

    if(!found){
	register_page()
    }
}

//
// コールバックでbackground.jsからの値を受け取る
//
chrome.runtime.onMessage.addListener(message => {
    if (message.type !== 'CLICK_POPUP') {
	return;
    }

    status.text('')
    status.show()

    chrome.storage.local.get(suggestnames, function (value) {
	for(var i=0;i<100;i++){
	    if(value[`suggests${i}`]){
		suggests[i] = value[`suggests${i}`]
	    }
	}
	
	m = location.href.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)(\/(.*))?$/)
	if(m && m[1]){
	    var project = m[1]
	    var title = m[3]
	    if(!title){ // ページリスト
		fetch(`https://scrapbox.io/api/pages/${project}?limit=1000`)
		    .then(function(response) {
			return response.json();
		    })
		    .then(function(json) {
			for(var page of json.pages){
			    var title = page.title
			    console.log(title)
			    fetch(`https://scrapbox.io/api/pages/${project}/${title}`)
				.then(function(response) {
				    return response.json()
				})
				.then(function(json){
				    process(json.lines,project)
				})
  			}
		    });
	    }
	    else { // 単独ページ
		fetch(`https://scrapbox.io/api/pages/${project}/${title}`)
		    .then(function(response) {
			return response.json()
		    })
		    .then(function(json){
			process(json.lines,project)
		    })
	    }
	}
	else {
	    register_page()
	}

	setTimeout(function(){ status.hide() }, 10000)
    })
})
