//
//  https://developer.chrome.com/extensions/omnibox のサンプルをもとにしている
//

'use strict';

var suggestnames = []
for(var i=0;i<100;i++){
    suggestnames[i] = `suggests${i}`
}

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
    chrome.storage.sync.get(suggestnames, function (value) {
       for(var i=0;i<100;i++){
            var suggests = value[`suggests${i}`]
            if(suggests){
            for(var desc in suggests){
                if(desc.match(RegExp(text,'i'))){
                    var xml = '<dim>'+desc+'</dim>'
                    xml += '<url> - '+suggests[desc]+'</url>'
                    data.push({
                        'content': suggests[desc],
                        'description': xml,
                    })
                }
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
chrome.omnibox.onInputEntered.addListener(function(text, disposition) {
    if(text.match(/^http/)){
        // location.href = は動かない 
        switch (disposition) {
            case "currentTab":
                chrome.tabs.update(null, {url: text});
                break;
            case "newForegroundTab":
                chrome.tabs.create({url: text});
                break;
            case "newBackgroundTab":
                chrome.tabs.create({url: text, active: false});
                break;
        }
    }
    else {
        window.open('http://goquick.org/' + text)
    }
})
