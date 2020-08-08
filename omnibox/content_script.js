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

function process(lines,project){
    //
    // Scrapboxページの内容を1行ずつ調べてHelpfeel記法を処理する
    //
    descs = [] // Helpfeel記法
    title = lines[0]
    for(var line of lines){
	if(line.match(/^\?\s/)){ // ? ではじまるHelpfeel記法
	    desc = line.replace(/^\?\s+/,'')
	    status.text(decodeURIComponent(`${title} - ${desc}`))
	    descs.push(line)
	}
	else if(line.match(/^\%\s/)){ // % ではじまるコマンド指定
	    if(descs.length == 0){
		alert("Helpfeel記法が定義されていません")
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
			    fetch(`https://scrapbox.io/api/pages/${project}/${title}/text`)
				.then(function(response) {
				    return response.text()
				})
				.then(function(text){
				    process(text.split(/\n/),project)
				})
  			}
		    });
	    }
	    else { // 単独ページ
		fetch(`https://scrapbox.io/api/pages/${project}/${title}/text`)
		    .then(function(response) {
			return response.text()
		    })
		    .then(function(text){
			process(text.split(/\n/),project)
		    })
	    }
	}
	else {
	    cmd = location.href
	    var h = hash(cmd)
	    var desc=window.prompt(`Help説明文を入力`,document.title);
	    if(desc){
		expanded = desc.expand() // Helpfeel記法の正規表現を展開
		for(s of expanded){
		    status.text(s)
		    suggests[h][s] = cmd
		}
		var setval = {}
		setval[`suggests${h}`] = suggests[h]
		chrome.storage.local.set(setval, function(){ });
	    }
	    else {
		status.hide()
	    }
	}

	setTimeout(function(){ status.hide() }, 10000)
    })
})
