#
# gitコマンドのテストとか大変かも...
#

require 'minitest'
require 'minitest/unit'

MiniTest::autorun

class TestFoo < MiniTest::Unit::TestCase
  def setup
    @cwd = Dir.getwd
    #puts File.expand_path("rubytips86", "/home")
    
    system "/bin/rm -r -f __testdir"
    system "mkdir __testdir"
    system "cd __testdir; git init"
    system "cd __testdir; touch abc"
    system "cd __testdir; git add abc"
    system "cd __testdir; git commit -a -m 'message'"
  end

  def teardown
    system "/bin/rm -r -f __testdir"
  end

  def check(q,pat,dir=".")
    res = false
    #puts "pat = <<#{pat}>>"
    #puts "dir = (((#{dir})))"
    #puts "@cwd = (((#{@cwd})))"
    #puts "cmd = #{@cwd}/exe/helpline}"
    `cd #{dir}; ruby #{@cwd}/exe/helpline -t '#{q}'`.split(/\n/).each { |line|
      #puts "line = [[[#{line}]]]"
      res = true if pat.match(line)
    }
    assert res
  end

  def test_自転車
    check "自転車", "「自転車」という文字列を含むファイルを捜す"
    check "自転車", "grep"
  end

  def test_天気
    check "天気", "鎌倉"
    check "天気", "天気"
  end

  def test_git
    #
    # gitリポジトリでは削除メニューが出ることを確認
    #
    check "abc 削除", /abc.*ファイル.*削除/, "__testdir"
  end
end
