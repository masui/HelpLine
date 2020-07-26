.PHONY: test
#
# Gem版
#
release:
	rake release

update:
	helpline --update HelpLine masui-helpline

local: update-local
update-local:
	helpline --update ~/ScrapboxData/HelpLine.json ~/ScrapboxData/masui-helpline.json
#	helpline --update ~/ScrapboxData/HelpLine.json ~/ScrapboxData/masui-helpline.json ~/ScrapboxData/masui.json

all:
	helpline --update ~/ScrapboxData/{HelpLine,masui-helpline,masui,toshiyukimasui,masuilab,masui-bookmarks}.json
	cd omnibox; make conv

update-quick:
	helpline --update ~/ScrapboxData/{HelpLine,masui,toshiyukimasui,masuilab,masui-bookmarks}.json masui-helpline
	cd omnibox; make conv

#
# テスト
#
test:
	ruby test/test.rb
