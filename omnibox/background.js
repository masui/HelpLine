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
	var suggests = value.suggests
	if(suggests){
	    for(var desc in suggests){
		if(desc.match(RegExp(text,'i'))){
		    data.push({'description': desc, 'content': suggests[desc]})
		}
	    }
	}

	suggest(data) // 候補を表示
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
