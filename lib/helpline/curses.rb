

# ESC [ Pl A
# カーソルをPl行上へ移動
# ESC [ Pl B
# カーソルをPl行下へ移動
# ESC [ Pc C
# カーソルをPc桁右へ移動
# ESC [ Pc D
#       カーソルをPc桁左へ移動
#       ESC E
# 改行、カーソルを次行の最初へ移動

# \e[nE	n行下の先頭に移動
# \e[nF	n行上の先頭に移動
# \e[nG	現在位置と関係なく左からnの場所に移動


class Curses
  @x = 0
  @y = 0
  
  def Curses.up(n = 1)
    STDOUT.print "\e[#{n}A"
    @y -= n
  end
  
  def Curses.down(n = 1)
    STDOUT.print "\e[#{n}B"
    @y += n
  end
  
  def Curses.right(n = 1)
    n = 1 unless n
    STDOUT.print "\e[#{n}C"
    @x += n
  end
  
  def Curses.left(n = 1)
    STDOUT.print "\e[#{n}D"
    @x -= n
  end
  
  def Curses.tol(n = 0) # 行頭からn文字目に移動
    STDOUT.print "\e[#{n+1}G"
    @x = n
  end
  
  #\e[nJ	画面消去
  #0（or省略）・・・カーソルより後ろを消去
  #1・・・カーソルより前を消去
  #2・・・画面全体を消去
  
  def Curses.clearline # カーソルより後を消去
    STDOUT.print "\e[J"
  end

  def Curses.move(yy,xx)
    if xx > @x
      Curses.right(xx-@x)
    end
    if xx < @x
      Curses.left(@x - xx)
    end
    if yy > @y
      Curses.down(yy - @y)
    end
    if yy < @y
      Curses.up(@y - yy)
    end
    @y = yy
    @x = xx
  end

  def Curses.dump
    puts @x
    puts @y
  end

  def Curses.print(s)
    STDOUT.print(s)
    # @x += s.length
    @x += s.encode("EUC-JP").bytesize
  end
  
  # \e[0m	指定をリセットし未指定状態に戻す（0は省略可）
  # \e[1m	太字
  # \e[2m	薄く表示
  # \e[3m	イタリック
  # \e[4m	アンダーライン
  # \e[5m	ブリンク
  # \e[6m	高速ブリンク
  # \e[7m	文字色と背景色の反転
  # \e[8m	表示を隠す（コピペ可能）
  # \e[9m	取り消し
  
  def Curses.print_inverse(s)
    print "\e[0m"
    print "\e[7m"
    print s
    print "\e[0m"
    @x += s.length
  end

end
  
