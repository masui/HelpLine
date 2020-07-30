$(function() {
    //alert('popup.js start')
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
	//chrome.tabs.sendMessage(tabs[0].id, { type: 'CLICK_POPUP', message: "message" }, function(item){
	//    // sendMessageのレスポンスが item で取得できるのでそれを使って処理する
	//    if(!item){
	//	alert('メッセージ送付失敗');
	//	return;
	//    }
	//})
	chrome.tabs.sendMessage(tabs[0].id, { type: 'CLICK_POPUP', message: "message" })
    });
});
