#!/usr/bin/env ruby
# -*- ruby -*-

require 'scrapbox'

PROJECT = "GitHelp"

project = Scrapbox::Project.new(PROJECT)
page = Scrapbox::Page.new(project,'Glossary')
data = {}
page.text.split(/\n/).each { |line|
  line.chomp!
  if line =~ /^(\S+):\s*(.*)$/
    if $1 != 'code' # code: は除く
      data[$1] = $2
    end
  end
}

defs = []
puts "var glossary = {"
data.each { |key,val|
  defs << "    '#{key}': '#{val}'"
}
puts defs.join(",\n")
puts "}"
puts "module.exports = glossary"




