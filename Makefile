.PHONY: data.js glossary.js

run: browserify
	npm start .

browserify:
	browserify helpline.js -o helpline_browserify.js

build-mac: install browserify
	npm run build
	cp -r build/mac/HelpLine.app /Applications
upload:
	scp build/HelpLine-0.0.1.dmg pitecan.com:/www/www.pitecan.com/tmp/HelpLine.dmg

build-chromebook: browserify install
	npm run build

#dmg: build-mac
#	-/bin/rm -f HelpLine.dmg
#	hdiutil create -srcfolder build/mac/HelpLine.app -volname HelpLine HelpLine.dmg

#install: npm browserify cursorpos electron
install:
	npm install

electron:
	npm install electron

#
# Scrapboxからデータ更新
#
update: data.js glossary.js
data.js:
	ruby getdata.rb > data.js
glossary.js:
	ruby getglossary.rb > glossary.js

clean:
	-/bin/rm -r -f node_modules
	-/bin/rm -r -f build
	-/bin/rm -f HelpLine.dmg

all: update build-mac


#
# gem
#
release:
	rake release



