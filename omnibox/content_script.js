require("re_expand") // browserifyで展開

var suggests = {}
var descs = []
var status;

function terminate_def(cmd){
    if(descs.length > 0){
	for(l of descs){
	    var m = l.match(/^\?\s+(.*)/)
	    expanded = m[1].expand() // Helpfeel記法の正規表現を展開
	    for(s of expanded){
		suggests[s] = cmd
	    }
	}
	chrome.storage.sync.set({'suggests': suggests}, function(){ });
    }
    descs = []
}

function process(lines,project,title){
    //
    // Scrapboxページの内容を1行ずつ調べてHelpfeel記法を処理する
    //
    descs = [] // Helpfeel記法
    for(var line of lines){
	if(line.match(/^\?\s/)){ // ? ではじまるHelpfeel記法
	    status.text(decodeURIComponent(`${title} - ${line}`))
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
// コールバックでpopup.jsからの値を受け取る
//
chrome.runtime.onMessage.addListener(message => {
    if (message.type !== 'CLICK_POPUP') {
	return;
    }

    height = $(window).height()
    status = $('<div>')
    status.css('position','absolute')
    status.css('width','100%')
    status.css('height','18pt')
    status.css('top',`${height-18}px`)
    status.css('left','0pt')
    status.css('background-color','#ffd')
    $('body').append(status)
    
    chrome.storage.sync.get(["suggests"], function (value) {
	if(value.suggests){
	    suggests = value.suggests
	}
	
	m = location.href.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)(\/(.*))?$/)
	if(m[1]){
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
				    process(text.split(/\n/),project,title) // この経緯をどこかに表示できないのか
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
			//alert(text)
			//alert(project)
			//alert(title)
			process(text.split(/\n/),project,title)
		    })
	    }
	}
	setTimeout(function(){ status.remove() }, 2000)
    })
})
