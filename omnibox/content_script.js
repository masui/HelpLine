require("re_expand") // browserifyで展開

//
// コールバックでpopup.jsからの値を受け取る
//
chrome.runtime.onMessage.addListener(message => {
    if (message.type !== 'CLICK_POPUP') {
	return;
    }

    // 消したい場合
    //chrome.storage.local.set({'suggests': {}}, function () {
    //});
    //return;

    chrome.storage.sync.get(["suggests"], function (value) {
	var suggests = {}
	if(value.suggests){
	    suggests = value.suggests
	}

	//
	// Scrapboxページの内容を1行ずつ調べてHelpfeel記法を処理する
	//
	descs = [] // Helpfeel記法
	for(line of document.querySelectorAll('code')){
	    if(line.className == "helpfeel"){ // ? ではじまるHelpfeel記法
		descs.push(line)
	    }
	    else if(line.className == "cli"){ // % ではじまるコマンド指定
		if(descs.length == 0){
		    alert("Helpfeel記法が定義されていません")
		}
		else {
		    m = line.textContent.match(/^\%\s+(echo|open)\s+(.*)/)
		    cmd = m[2]
		    for(l of descs){
			m = l.textContent.match(/^\?\s+(.*)/)
			expanded = m[1].expand() // Helpfeel記法の正規表現を展開
			for(s of expanded){
			    suggests[s] = cmd
			}
		    }
		    chrome.storage.sync.set({'suggests': suggests}, function(){ });
		}
		descs = []
	    }
	    else {
		if(descs.length > 0){
		    for(l of descs){
			m = l.textContent.match(/^\?\s+(.*)/)
			expanded = m[1].expand()
			for(s of expanded){
			    suggests[s] = location.href
			}
		    }
		    chrome.storage.sync.set({'suggests': suggests}, function(){ });
		}
		descs = []
	    }
	}
	if(descs.length > 0){
	    for(l of descs){
		m = l.textContent.match(/^\?\s+(.*)/)
		expanded = m[1].expand()
		for(s of expanded){
		    suggests[s] = location.href
		}
	    }
	    chrome.storage.sync.set({'suggests': suggests}, function(){ });
	}
    })
});
