//$(function() {
//    alert(window.scrapbox)
//})

require("re_expand")

chrome.runtime.onMessage.addListener(message => {
    // コールバックでpopup.jsからの値を受け取れる
    if (message.type !== 'CLICK_POPUP') {
	return;
    }

    // 消したい場合
    //chrome.storage.local.set({'suggests': {}}, function () {
    //});
    //return;

    suggests = {}
    chrome.storage.sync.get(["suggests"], function (value) {
	//alert(`value is ${value}`)
	var value_data = value.suggests;
	//alert(value_data)
	if(value_data){
	    //for(var data in value_data){
	    //	alert(data)
	    //	alert(value_data[data])
	    //}
	    suggests = value_data
	}
	//alert('-----')

	descs = [] // Helpfeel記法
	for(line of document.querySelectorAll('code')){
	    if(line.className == "helpfeel"){ // ? xxxx
		descs.push(line)
	    }
	    else if(line.className == "cli"){ // % xxxxx
		if(descs.length == 0){
		    alert("Helpfeel記法が定義されていません")
		}
		else {
		    m = line.textContent.match(/^\%\s+(echo|open)\s+(.*)/)
		    cmd = m[2]
		    for(l of descs){
			m = l.textContent.match(/^\?\s+(.*)/)
			expanded = m[1].expand()
			for(s of expanded){
			    suggests[s] = cmd
			}
		    }
		    chrome.storage.sync.set({'suggests': suggests}, function () {
		    });
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
		    chrome.storage.sync.set({'suggests': suggests}, function () {
		    });
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
	    chrome.storage.sync.set({'suggests': suggests}, function () {
	    });
	}
    })
});
