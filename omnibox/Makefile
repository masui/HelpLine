browserify:
	browserify content_script.js -o content_script_browserify.js

all:
	cd ..; make all

# suggests.jsにヘルプデータを書いておくバージョン
conv:
	ruby conv.rb > suggests.js
