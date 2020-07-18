.PHONY: test
#
# Gem版
#
release:
	rake release

update:
	helpline --update

local: update-local
update-local:
	helpline --update ~/ScrapboxData/HelpLine.json ~/ScrapboxData/masui-helpline.json
#	helpline --update ~/ScrapboxData/HelpLine.json ~/ScrapboxData/masui-helpline.json ~/ScrapboxData/masui.json

#
# テスト
#
test:
	ruby test/test.rb
