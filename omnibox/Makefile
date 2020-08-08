js:
	browserify content_script.js -o content_script_browserify.js
	browserify setting.js -o setting_browserify.js


#
# Chromeエクステンション公開用のzipを作る
#

ZIPFILES=\
	manifest.json \
	background.js \
	content_script_browserify.js \
	setting_browserify.js \
	setting.html \
	jquery-2.1.4.min.js \
	helpline-16.png \
	helpline-32.png \
	helpline-48.png \
	helpline-96.png \
	helpline-192.png

zip: js
	/bin/rm -f helpline.zip
	zip -r helpline.zip ${ZIPFILES}

# all:
# 	cd ..; make all
# 
# # suggests.jsにヘルプデータを書いておくバージョン
# conv:
# 	ruby conv.rb > suggests.js
