//
//  https://developer.chrome.com/extensions/omnibox のサンプルをもとにしている
//

'use strict';

//
// browserActionボタンを押したときcontent_script.jsにメッセージを送る
//
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'CLICK_POPUP', message: "message" })
})

//
// ユーザがomniboxで何か入力したとき呼ばれるもの
//
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    // suggests.jsの静的なデータを使うとき
    //var data = suggests.filter(function(x){
    //    return x.description.match(RegExp(text,'i'))
    //})
    
    var data = []
    chrome.storage.sync.get(["suggests"], function (value) {
	var value_data = value.suggests;
	if(value_data){
	    for(var d in value_data){
		var entry = {}
		entry['description'] = d
		entry['content'] = value_data[d]
		data.push(entry)
	    }
	}
	
	data = data.filter(function(x){
	    return x.description.match(RegExp(text,'i'))
	})
	suggest(data)
    })
    
    // よく使うものはトップに出るようにするとか
    // data.unshift({content: "aaaaa", description: "bbbbb"})
    // 学習させておくのは良いかも
})

//
// ユーザがメニューを選択したとき呼ばれるもの
//
chrome.omnibox.onInputEntered.addListener(function(text) {
    if(text.match(/^http/)){
	window.open(text) // location.href = は動かない
    }
    else {
	window.open('http://goquick.org/' + text)
    }
})
