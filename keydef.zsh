#
# Ctrl-Hでhelplineを呼ぶようにする
#
function run-help() {
    BUFFER=$(/Applications/HelpLine.app/Contents/MacOS/helpline "${BUFFER}")
    CURSOR=${#BUFFER}
    zle redisplay
}
zle -N run-help
bindkey "^h" run-help

# コマンドライン実行時にもコメントを使えるようにする
# setopt interactivecomments

