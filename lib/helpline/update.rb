# -*- ruby -*-
#
# HelpLineデータを読み込んでdatafileにセーブする
#

require 'json'
require 'scrapbox'

class HelpLine
  def update(sources) # sources = ['HelpLine', '~/ScrapboxData/masui.json', ...]
    dumpdata = {}
    dumpdata['codes'] = []
    dumpdata['defs'] = []
    dumpdata['pages'] = []

    sources.each { |source|
      pagedata = {}
      if File.exist?(source)
        puts "-----------------ページデータをJSONデータ(#{source})から取得"
        data = JSON.parse(File.read(source))
        data['pages'].each { |page|
          title = page['title']
          puts "...#{title}"
          pagedata[title] = page['lines']
        }
      elsif source =~ /^[a-zA-Z\-]+$/ # たぶんHelpLineプロジェクト
        puts "-----------------ページデータをScrapbox(#{source})から取得"
        project = Scrapbox::Project.new(source)
        project.pages.each { |title,page|
          puts "...#{title}"
          pagedata[title] = page.text.split(/\n/)
        }
      else
        next
      end
      
      #
      # 関数/定数を評価"
      #
      puts "-----------------関数/定数を取得"
      src = nil
      code = []
      pagedata.each { |title,lines|
        # puts "...#{title}"
        lines.each { |line|
          if src && line =~ /^\s+/ then
            code << line
          elsif line =~ /^code:(.*\.rb)$/ then
            if code.length > 0
              puts "...#{title}"
              puts code[0]
              dumpdata['codes'] << code.join("\n")
            end
            src = $1
            code = []
          elsif src then
            puts "...#{title}"
            puts code[0]
            dumpdata['codes'] << code.join("\n")
            src = nil
            code = []
          else
          end
        }
        if code.length > 0
          puts "...#{title}"
          puts code[0]
          dumpdata['codes'] << code.join("\n")
          src = nil
          code = []
        end
      }
      puts "-----------------HelpLineデータを検出"
      pagedata.each { |title,pagedata|
        # puts "...#{title}"
        dumpdata['pages'] << title
        processing_defs = false
        codeindent = nil
        pagedata.each { |line|
          if !codeindent
            if line =~ /^code:/
              codeindent = 0
              next
            end
          else
            line =~ /^(\s*)/
            if $1.length < codeindent + 1
              codeindent = nil
            else
              next
            end
          end
          if line =~ /^[\$\%\?]/
            if line =~ /^\%/ && !processing_defs
              puts "'$'で始まる用例定義なしでコマンドを定義しようとしています"
              exit
            end
            dumpdata['defs'] << "#{line} {#{dumpdata['pages'].length-1}}"
            processing_defs = true
          else
            processing_defs = false
          end
        }
      }
    }
      
    File.open(datafile,"w"){ |f|
      f.puts dumpdata.to_json
    }
  end
end
