.PHONY: test
#
# Gem版
#
release:
	rake release

update:
	helpline --update

update-local:
	helpline --update ~/ScrapboxData/HelpLine.json ~/ScrapboxData/masui-helpline.json

#
# テスト
#
test:
	ruby test/test.rb
