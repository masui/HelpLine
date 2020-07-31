require("re_expand") // browserifyで展開

// 消したい場合
//chrome.storage.local.set({'suggests': {}}, function () {
//});
//return;
	
//
// コールバックでpopup.jsからの値を受け取る
//
chrome.runtime.onMessage.addListener(message => {
    if (message.type !== 'CLICK_POPUP') {
	return;
    }
    chrome.storage.sync.get(["suggests"], function (value) {
	var suggests = {}
	if(value.suggests){
	    suggests = value.suggests
	}
	
	m = location.href.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)\/?$/i)
	if(m){
	    project = m[1]
	    alert(project)
	    fetch(`https://scrapbox.io/api/pages/${project}?limit=10`)
		.then(function(response) {
		    return response.json();
		})
		.then(function(json) {
		    for(var page of json.pages){
			alert(page.title)
			fetch(`https://scrapbox.io/api/pages/${project}/${page.title}/text`)
			    .then(function(response) {
				return response.text()
			    })
			    .then(function(text){
				alert(text)
			    })
  		    }
		});
	}
	else {
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
	}
    })
});
				     
