require "json"
require "re_expand"

s = '色つき(矩形|四角)(データ|ファイル)のPNGを作成する'
s = '秋山氏作の(矩形|四角)PNGファイル(生成|作成)システム'

data = JSON.parse(File.read("/Users/masui/.helpline.json"))

puts "let suggests = ["
      
titles = []
data['defs'].each { |line|
  line.sub!(/\s+\{\d+\}\s*$/,'')
  if line.sub!(/^\?\s+/,'')
    titles << line
  elsif line.sub!(/^%\s+/,'')
    if line =~ /^(open|echo)\s+(.*)/
      url = $2
      if line !~ /#\{/
        url.sub!(/^'/,'')
        url.sub!(/'$/,'')
        titles.each { |title|
          title.gsub(/[\[\]]/,'').expand { |s|
            puts "   {content: '#{url}', description: '#{s[0]}'},"
          }
        }
      end
    end
    titles = []
  else
    titles = []
  end
}

puts "]"


