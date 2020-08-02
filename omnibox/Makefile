js:
	browserify content_script.js -o content_script_browserify.js


#
# Chromeエクステンション公開用のzipを作る
#
ZIPFILES=manifest.json realurl.js jquery-2.1.4.min.js md5.js crypt.js settings.js settings.html icons/realurl-48.png icons/realurl-96.png

ZIPFILES=manifest.json background.js content_script_browserify.js helpline-32.png helpline-96.png helpline.png jquery-2.1.4.min.js
zip: js
	/bin/rm -f helpline.zip
	zip -r helpline.zip ${ZIPFILES}

# all:
# 	cd ..; make all
# 
# # suggests.jsにヘルプデータを書いておくバージョン
# conv:
# 	ruby conv.rb > suggests.js
