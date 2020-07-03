# coding: utf-8
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "helpline/version"

Gem::Specification.new do |spec|
  spec.name          = "helpline"
  spec.version       = Helpline::VERSION
  spec.authors       = ["Toshiyuki Masui"]
  spec.email         = ["masui@pitecan.com"]

  spec.summary       = %q{HelpLine - show command help menu from keywords.}
  spec.description   = %q{HelpLine - show command help menu from keywords, using ExpandHelp.}
  spec.homepage      = "https://masui.github.io/HelpLine/"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.15"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"

  spec.add_runtime_dependency "re_expand"
  spec.add_runtime_dependency "scrapbox"
end
