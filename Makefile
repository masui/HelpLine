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

update-quick:
	helpline --update ~/ScrapboxData/HelpLine.json masui-helpline

#
# テスト
#
test:
	ruby test/test.rb
