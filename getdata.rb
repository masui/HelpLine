#!/usr/bin/env ruby
# -*- ruby -*-

# require 'net/https'
require 'json'
# require 'uri'
# require 'cgi'
# require 'optparse'

require 'scrapbox'
# require 're_expand'

class GetData
  PROJECT = "GitHelp"

  # def datafile
  #   File.expand_path("~/.githelp")
  # end

  def initialize
    @pagedata = {}
    @project = Scrapbox::Project.new(PROJECT)
  end

  def getdata
    #
    # ページデータ取得
    #
    STDERR.puts "-----------------#{PROJECT}のページデータを取得"
    @project.pages.each { |title,page|
      STDERR.puts "...#{title}"
      @pagedata[title] = page.text.split(/\n/)
    }

    dumpdata = {}
    dumpdata['codes'] = []
    dumpdata['defs'] = []
    dumpdata['pages'] = []
    
    #
    # 関数/定数を評価"
    #
    # puts "-----------------関数/定数を取得"
    # @pagedata.each { |title,pagedata|
    #   puts "...#{title}"
    #   pagedata. each { |line|
    #     if line =~ /code:(.*\.rb)$/ then
    #       src = $1
    #       STDERR.puts "=========== #{src}"
    #       page = Scrapbox::Page.new(@project,title)
    #       dumpdata['codes'] << page.code(src)
    #     end
    #   }
    # }

    STDERR.puts "-----------------GitHelpデータを検出"
    @pagedata.each { |title,pagedata|
      STDERR.puts "...#{title}"
      dumpdata['pages'] << title
      processing_defs = false
      codeindent = nil
      pagedata.each { |line|
        if !codeindent
          if line =~ /^(\s*)code:/
            codeindent = $1.length
            next
          end
        else
          line =~ /^(\s*)/
          if line.length < codeindent
            codeindent = nil
          else
            next
          end
        end
        # if line =~ /^\s*[\$\%]/
        if line =~ /^[\$\%]/
          STDERR.puts line
          if line =~ /^\%/ && !processing_defs
            STDERR.puts "'$'で始まる用例定義なしでコマンドを定義しようとしています"
            exit
          end
          dumpdata['defs'] << "#{line} {#{dumpdata['pages'].length-1}}"
          processing_defs = true
        else
          processing_defs = false
        end
      }
    }
    
    File.open("/tmp/tmp.json","w"){ |f|
      f.puts dumpdata.to_json
    }
    system "jq . < /tmp/tmp.json > /tmp/tmp1.json"

    puts "var data = "
    puts File.read("/tmp/tmp1.json")
    puts "module.exports = data"
  end
end

getdata = GetData.new
getdata.getdata
