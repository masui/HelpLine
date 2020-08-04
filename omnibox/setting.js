const crypto = require('crypto')

function hash(str){ // 文字列を0〜255の値に
    const md5 = crypto.createHash('md5')
    return parseInt(md5.update(str).digest('hex').substring(0,4),16) % 100
}

function save(){
    chrome.storage.sync.get(null, function(items) { // nullだと全データ読み込み
	var data = {}
	for(var key in items){ // "suggests0" ～ "suggests255"
	    var val = items[key]
	    for(var entrykey in val){
		var cmd = val[entrykey]
		data[entrykey] = cmd
	    }
	}
	var result = JSON.stringify(data);
	var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(result)))
	chrome.downloads.download({
	    url: url,
	    filename: 'helpfeel.json'
	});
    });
}

function handleFileSelect(evt) {
    var f = evt.target.files[0]
    var reader = new FileReader();
    reader.onload = function(e){
	var helpdata = JSON.parse(e.target.result)
	var suggests = []
	for(var i=0;i<100;i++){
	    suggests[i] = {}
	}
	for(var desc in helpdata){
	    var cmd = helpdata[desc]
	    var h = hash(cmd)
	    suggests[h][desc] = cmd
	}
	for(var i=0;i<100;i++){
	    var setval = {}
	    setval[`suggests${i}`] = suggests[i]
	    chrome.storage.sync.set(setval, function(){ });
	}
    }

    reader.readAsText(f);
}

function clear(){
    chrome.storage.sync.clear();
}
    
$(function() {
    $('#save').on('click',save)
    $('#read').on('change', handleFileSelect);
    $('#clear').on('click', clear);
})
