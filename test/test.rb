#
# gitコマンドのテストとか大変かも...
#

require 'minitest'
require 'minitest/unit'

$:.unshift "lib"
require 'helpline/helpline'
require 'helpline/generate'

MiniTest::autorun

class TestFoo < MiniTest::Unit::TestCase
  def cwd
    Dir.getwd
  end

  def testdir
    "__testdir"
  end

  def setup
    @helpline = HelpLine.new
  end

  def git_start
    #
    # Gitレポジトリを作成
    #
    system "/bin/rm -r -f #{testdir}"
    system "mkdir #{testdir}"
    system "cd #{testdir}; git init --quiet"
    system "cd #{testdir}; date > abc"
    system "cd #{testdir}; git add abc"
    system "cd #{testdir}; git commit -a -m 'message' --quiet"
  end

  # def teardown
  def git_end
    # Gitレポジトリを削除
    system "/bin/rm -r -f #{testdir}"
  end

  def check(q,pat,dir=".")
    res = false
    `cd #{dir}; ruby #{cwd}/exe/helpline -t '#{q}'`.split(/\n/).each { |line|
      if line.match(pat)
        res = true
      end
    }
    assert res
  end
  
  def check_git(q,pat,dir=".")
    git_start
    check(q,pat,dir)
    git_end
  end

  def test_notfound
    assert @helpline.generate("foo bar hoge").length == 0
  end

  def test_自転車
    check "自転車", "「自転車」という文字列を含むファイルを捜す"
    check "自転車", "grep"
    check "自転車", "Gyazo"
  end

  def test_天気
    check "鎌倉 天気", "鎌倉"
    check "天気", "鎌倉"
    check "天気", "天気"
  end

  def test_摂氏
    check "摂氏 30", "華氏"
  end

  def test_lorem
    check "lorem", /ipsum/
  end
  
  def test_git_削除
    #
    # gitリポジトリでは削除メニューが出ることを確認
    #
    check_git "abc 削除", /abc.*ファイル.*削除/, "#{testdir}"
  end

  def test_git_ブランチ
    check_git "ブランチ", /branch/, "#{testdir}"
  end
  
end
