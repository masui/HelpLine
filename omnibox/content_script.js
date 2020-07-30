//$(function() {
//    alert(window.scrapbox)
//})

require("re_expand")

chrome.runtime.onMessage.addListener(message => {
    // コールバックでpopup.jsからの値を受け取れる
    if (message.type !== 'CLICK_POPUP') {
	return;
    }
    //alert("message received from popup.js")
    
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
	    //if(line.className == "cli" || line.className == "helpfeel"){
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
			    //alert(`${s} => ${cmd}`)
			    //data = { content: cmd, description: s }
			    //suggests.push(data)
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
			    //alert(`${s} => ${cmd}`)
			    //data = { content: 'currentpage', description: s }
			    //suggests.push(data)
			    suggests[s] = cmd
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
		    //alert(`${s} => ${cmd}`)
		    //data = { content: 'currentpage', description: s }
		    //suggests.push(data)
		    suggests[s] = cmd
		}
	    }
	    chrome.storage.sync.set({'suggests': suggests}, function () {
	    });
	}
    })
	
    //alert(document.querySelectorAll('code.helpfeel span.entry'))
    //alert(window.scrapbox)
    //alert(window.scrapbox.Project.pages)
});
