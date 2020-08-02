$(function(){
    chrome.storage.sync.get(["projects"], (item) => {
	let projects = "HelpLine"
	if(item.projects){
	    projects = item.projects
	}
	$('#projects').val(projects)
    });
    
    $('#update').on('click', () => {
	fetch("https://scrapbox.io/api/pages/HelpLine")
	    .then(function(response) {
		alert(response.json());
	    })

	//chrome.storage.sync.set(
	//    {
	//	"projects": $('#projects').val()
	//    }
	//);
    });
    
    //$('#update').on('click', () => {
    // alert($('#projects').val())
    //});
});

//fetch('https://scrapbox.io/api/pages/Nota?limit=1000').then ( function(response){ return response.json() }).then (function(myJson) {
//    console.log(myJson.pages[998])
//  });
