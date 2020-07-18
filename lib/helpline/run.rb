# -*- ruby -*-
#
# * HelpLineのメインルーチン
# * datafileを読み、引数とマッチするものをリストする
#   引数はARGVに入っている
#

require 'io/console'
require 'helpline/curses'

class HelpLine
  LINES = 12
  
  def disp(list,sel)
    Curses.move(0,0)
    lines = list.length
    lines = LINES if lines > LINES
    (0...lines).each { |i|
      Curses.move(i*2,0)
      s = "#{list[i][0]}"
      if i == sel
        Curses.print_inverse s
      else
        Curses.print_bold s
      end
      Curses.move(i*2+1,0)
      Curses.print "  % " + list[i][1]
    }
    Curses.move(sel*2,0)
  end
  
  def run(query,debug=nil)
    puts
    
    list = generate(query,debug)
    #
    # HelpLineメニュー表示し、カーソル移動で選択
    #
    help_number = {}
    list.each_with_index { |entry,ind|
      entry[0].sub!(/\s*{(\d*)}$/,'')
      entry[1].sub!(/\s*{(\d*)}$/,'')
      help_number[entry[0]] = $1.to_i
    }

    sel = 0
    disp(list,sel)
    
    lines = list.length
    lines = LINES if lines > LINES

    inputchars = ''
    while true
      c = STDIN.getch
      inputchars += c
      
      if inputchars == "\e"
      # process ESC
      elsif inputchars[0] == "\e" && inputchars.length == 2
      # 何もしない
      elsif inputchars == "\x0e" || inputchars == "\e[B" || inputchars == "\eOB"
        Curses.down
        sel = (sel + 1) if sel < lines-1
        inputchars = ''
      elsif inputchars == "\x10" || inputchars == "\e[A" || inputchars == "\eOA"
        Curses.up
        sel = sel - 1 if sel > 0
        inputchars = ''
      else
        inputchars = ''
      end
      STDIN.flush
      disp(list,sel)
      
      exit if c== 'q' || c == "\x03"

      if c == "\r" || c == "\n"
        break
      end
    end

    desc = list[sel.to_i][0]
    cmd = list[sel][1]

    Curses.move(lines*2,0)
    Curses.tol

    #Curses.move(0,0)
    ##Curses.down
    
    # Curses.print_inverse("「#{desc}」を実行")
    # puts " (ソース: http://scrapbox.io/HelpLine/#{data['pages'][help_number[desc]]})"
    File.open("/tmp/helpline.cmd","w"){ |f|
      f.puts cmd
    }
  end
end
