require 'minitest'
require 'minitest/unit'

MiniTest::autorun

class TestFoo < MiniTest::Unit::TestCase
  def setup
  end

  def teardown
  end

  def check(q,pat)
    `ruby exe/helpline -t #{q}`.split(/\n/).each { |line|
      return true if line.index pat
    }
    return false
  end

  def test_jitensha
    check "自転車", "「自転車」という文字列を含むファイルを捜す"
  end

  def test_tenki
    check "天気", "鎌倉"
  end
end
