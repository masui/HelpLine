#!/usr/bin/env ruby
# -*- ruby -*-

require 'json'
require 'optparse'

require 'scrapbox'
require 're_expand'

class HelpLine
  def datafile
    File.expand_path("~/.helpline")
  end
  
  def initialize
    @pagedata = {}
    @project = Scrapbox::Project.new("HelpLine")
  end

  def getdata
    #
    # ページデータ取得
    #
    puts "-----------------ページデータを取得"
    @project.pages.each { |title,page|
      puts "...#{title}"
      @pagedata[title] = page.text.split(/\n/)
    }

    dumpdata = {}
    dumpdata['codes'] = []
    dumpdata['defs'] = []
    dumpdata['pages'] = []
    
    #
    # 関数/定数を評価"
    #
    puts "-----------------関数/定数を取得"
    @pagedata.each { |title,pagedata|
      puts "...#{title}"
      pagedata. each { |line|
        if line =~ /code:(.*\.rb)$/ then
          src = $1
          puts "=========== #{src}"
          page = Scrapbox::Page.new(@project,title)
          dumpdata['codes'] << page.code(src)
        end
      }
    }
    puts "-----------------HelpLineデータを検出"
    @pagedata.each { |title,pagedata|
      puts "...#{title}"
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
        if line =~ /^\s*[\$\%]/
          puts line
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
    
    File.open(datafile,"w"){ |f|
      f.puts dumpdata.to_json
    }
  end

  def helpline(pager)
    data = JSON.parse(File.read(datafile))
    unless data['pages'] # データ型式変換があったので
      getdata
      data = JSON.parse(File.read(datafile))
    end

    #
    # 関数定義などをeval
    #
    data['codes'].each { |code|
      eval code
    }

    g = ExpandRuby::Generator.new # re_expandのジェネレータ

    #
    # HelpLineエントリ
    #
    lines = []
    data['defs'].each { |line|
      if line =~ /^\s*\$\s*(.*)$/ # $....
        lines << $1
      elsif line =~ /^\s*\%\s*(.*)$/ # %....
        cmd = $1
        lines.each { |l|
          desc = eval('"' + l + '"')
          g.add desc.force_encoding('utf-8'), cmd.force_encoding('utf-8')
        }
        lines = []
      end
    }

    # puts "GENERATE #{params.split('|').join(' ')} "
    res = g.generate " #{ARGV.join(' ').sub(/\[/,'').sub(/\]/,'')} "
    
    listed = {}
    list = res[0].find_all { |a| # 0 ambig
      if listed[a[1]]
        false
      else
        listed[a[1]] = true
      end
    }

    if pager == 'peco' then
      no = {}
      res = IO.popen(pager, "r+") {|io|
        list.each_with_index { |entry,ind|
          entry[0].sub!(/\s*{(\d*)}$/,'')
          entry[1].sub!(/\s*{(\d*)}$/,'')
          no[entry[0]] = $1.to_i
          io.puts "[#{ind}] #{entry[0]}"
          io.puts "   #{entry[1]}"
        }
        io.close_write
        io.gets
      }
      if res
        if res =~ /^\[(\d+)\]/
          desc = list[$1.to_i][0]
          cmd = list[$1.to_i][1]
        else
          desc = ''
          list.each { |entry|
            desc = entry[0] if entry[1].sub(/^\s*/,'') == res.chomp.sub(/^\s*/,'')
          }
          cmd = res.sub(/^\s*/,'')
        end

        puts "データ: http://scrapbox.io/HelpLine/#{data['pages'][no[desc]]}"
        puts
        puts "#{desc} ために"
        print "コマンド「#{cmd.chomp}」 を実行しますか? (Y) "
        ans = STDIN.gets
        if ans =~ /^y/i || ans == "\n"
          system cmd
        end
      end
    else
      res = IO.popen(pager, "w") {|io|
        list.each_with_index { |entry,ind|
          io.puts "[#{ind}] #{entry[0].sub!(/\s*{(\d*)}$/,'')}"
          io.puts "   #{entry[1].sub!(/\s*{(\d*)}$/,'')}"
        }
      }
    end
  end

end

is_repository = system 'git rev-parse --git-dir > /dev/null >& /dev/null'
unless is_repository
  STDERR.puts "Gitレポジトリで実行して下さい"
  exit
end

options = ARGV.getopts('ut')

helpline = HelpLine.new

if !File.exist?(helpline.datafile) && !options['u']
  puts "#{helpline.datafile}を作成します..."
  helpline.getdata
end
  
if options['u'] then
  helpline.getdata
else  
  pager = 'peco'
  peco_installed = system "command -v peco > /dev/null"
  if options['t'] || !peco_installed
    pager = 'more'
  end
  helpline.helpline pager
end
