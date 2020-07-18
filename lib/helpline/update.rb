# -*- ruby -*-
#
# HelpLineデータを読み込んでdatafileにセーブする
#

require 'json'
require 'scrapbox'

class HelpLine
  def update(sources) # sources = ['HelpLine', '/Users/masui/ScrapboxData/masui.json', ...]
    dumpdata = {}
    dumpdata['codes'] = []
    dumpdata['defs'] = []
    dumpdata['pages'] = []

    sources.each { |source|
      pagedata = {}
      projectname = ''
      if File.exist?(source)
        puts "-----------------ページデータをJSONデータ(#{source})から取得"
        data = JSON.parse(File.read(source))
        projectname = data['name']
        data['pages'].each { |page|
          title = page['title']
          puts "...#{title}"
          pagedata[title] = page['lines']
        }
      elsif source =~ /^[a-zA-Z\-]+$/ # たぶんHelpLineプロジェクト
        puts "-----------------ページデータをScrapbox(#{source})から取得"
        projectname = source
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
      pagedata.each { |title,data|
        # puts "...#{title}"
        dumpdata['pages'] << title
        processing_defs = false
        cmd_defined = false
        data.each { |line|
          if line =~ /^[\$\?]/
            dumpdata['defs'] << "#{line} {#{dumpdata['pages'].length-1}}"
            cmd_defined = false
            processing_defs = true
          elsif line =~ /^\%/
            if !processing_defs
              puts "'$'で始まる用例定義なしでコマンドを定義しようとしています (#{title})"
              exit
            end
            dumpdata['defs'] << "#{line} {#{dumpdata['pages'].length-1}}"
            cmd_defined = true
            processing_defs = false
          elsif processing_defs && !cmd_defined
            dumpdata['defs'] << "% open 'https://Scrapbox.io/#{projectname}/#{title}' {#{dumpdata['pages'].length-1}}"
            cmd_defined = false
            processing_defs = false
          else
            cmd_defined = false
            processing_defs = false
          end
        }
        if processing_defs && !cmd_defined
          dumpdata['defs'] << "% open 'https://Scrapbox.io/#{projectname}/#{title}' {#{dumpdata['pages'].length-1}}"
        end
      }
    }
      
    File.open(datafile,"w"){ |f|
      f.puts dumpdata.to_json
    }
  end
end
