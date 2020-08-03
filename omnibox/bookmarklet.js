javascript:(function(){
    var project='masui-helpline';
    var title=document.title;
    var help=window.prompt(`Help説明文を入力`,'');
    var lines=['','? '+help,'% open '+window.location.href];
    var body=encodeURIComponent(lines.join('\n'));
    console.log(`https://scrapbox.io/${project}/`+encodeURIComponent(title.trim())+'?body='+body);
    window.open(`https://scrapbox.io/${project}/`+encodeURIComponent(title.trim())+'?body='+body);
})();
