run: browserify
	npm start .

browserify:
	browserify clh.js -o clh_browser.js

build-mac: browserify install
	npm run build
	cp -r build/mac/CLH.app /Applications

build-chromebook: browserify install
	npm run build

#browserify:
#	browserify githelp.js -o githelp_browser.js

#install: npm browserify cursorpos electron
install:
	npm install

electron:
	npm install electron

cursorpos: cursorpos.c
	cc cursorpos.c -o cursorpos

mac:
	electron-packager . githelp --overwrite --platform=darwin --arch=x64 --electronVersion=0.36.1


