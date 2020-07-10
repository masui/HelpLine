#
# gitコマンドのテストとか大変かも...
#

require 'minitest'
require 'minitest/unit'

MiniTest::autorun

class TestFoo < MiniTest::Unit::TestCase
  @@cwd = Dir.getwd
  @@testdir = "__testdir"

  # def setup
  def git_start
    #
    # Gitレポジトリを作成
    #
    system "/bin/rm -r -f #{@@testdir}"
    system "mkdir #{@@testdir}"
    system "cd #{@@testdir}; git init --quiet"
    system "cd #{@@testdir}; date > abc"
    system "cd #{@@testdir}; git add abc"
    system "cd #{@@testdir}; git commit -a -m 'message' --quiet"
  end

  # def teardown
  def git_end
    # Gitレポジトリを削除
    system "/bin/rm -r -f #{@@testdir}"
  end

  def check(q,pat,dir=".")
    res = false
    `cd #{dir}; ruby #{@@cwd}/exe/helpline -t '#{q}'`.split(/\n/).each { |line|
      #puts "pat = #{pat}"
      #puts "line = #{line}"
      #puts pat.match(line)
      if line.match(pat)
        #puts "====================="
        res = true
      end
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

  def test_git_削除
    #
    # gitリポジトリでは削除メニューが出ることを確認
    #
    git_start
    check "abc 削除", /abc.*ファイル.*削除/, "#{@@testdir}"
    git_end
  end

  def test_git_ブランチ
    git_start
    check "ブランチ", /branch/, "#{@@testdir}"
    git_end
  end
end
