// chrome.storage.sync.get(null, ((data) => {console.log(data)}));

function save(){
    chrome.storage.sync.get(null, function(items) { // null implies all items
	var result = JSON.stringify(items);
	var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(result)))
	chrome.downloads.download({
	    url: url,
	    filename: 'storage.sync.json'
	});
    });
}

$(function() {
    // $('#button').on('click',function(){ chrome.storage.sync.get(null, (data) => {console.log(data)}) } )
    $('#div').on('click',save)
})
