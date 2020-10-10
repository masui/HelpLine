all:
	platex paper
	dvipdfm paper
spell:
	cat paper.tex | aspell --lang=en -t -a | grep -v '^\*$$' | grep -v '^$$' | ruby -ne 'puts $$_.split[1]' | sort -u
