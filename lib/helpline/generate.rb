# -*- ruby -*-
#
# * datafileを読み、引数とマッチするものをリストする
#

require 'json'
require 're_expand'

class HelpLine
  def generate(query,debug=nil)
    data = JSON.parse(File.read(datafile))

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

    logfile = (debug ? "/tmp/helpline-defs" : "/dev/null")
    File.open(logfile,"w"){ |f|  # ログを残す場合
      entries = []
      data['defs'].each { |line|
        if line =~ /^[\$\?]\s*(.*)$/ # $....
          entries << $1
        elsif line =~ /^\%\s*(.*)$/ # %....
          cmd = $1
          entries.each { |l|
            desc = eval('"' + l + '"')
            f.puts "desc: #{desc}"
            g.add desc.force_encoding('utf-8'), cmd.force_encoding('utf-8')
            # puts "g.add(\"#{desc.force_encoding('utf-8')}\",\"#{cmd.force_encoding('utf-8')}\")"
          }
          f.puts "cmd:  #{cmd}"
          entries = []
        end
      }
    }

    res = g.generate query

    File.open("/tmp/helpline.cmd","w"){ |f|
      f.puts ARGV.join(' ')
    }

    listed = {}
    list = res[0].find_all { |a| # 0 ambig
      # a = ["git: 現在の状況を表示する {56}", "git status {56}"], etc.
      if a[0] =~ /voidvoidvoid/
        false
      else
        ok = true
        if a[0] =~ /^(\w+):/ # git: みたいな定義
          cond = $1
          # methodname = "if_#{cond}"
          methodname = "#{cond}?"
          # ok = eval("defined?(#{methodname}) ? #{methodname} : true")
          if self.private_methods.include?(methodname.intern) # methodnameが登録されているか
            ok = self.send methodname
          end
        end
        if !ok || listed[a[1]]
          false
        else
          listed[a[1]] = true
        end
      end
    }

    list
  end
end
