.PHONY: data.js glossary.js

run: browserify
	npm start .

browserify:
	browserify clh.js -o clh_browserify.js

build-mac: install browserify
	npm run build
	cp -r build/mac/CLH.app /Applications

build-chromebook: browserify install
	npm run build

dmg: build-mac
	hdiutil create -srcfolder build/mac/CLH.app -volname CLH CLH.dmg

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
	-/bin/rm -f CLH.dmg

all: update build-mac

