#
# Ctrl-Hでclhを呼ぶようにする
#
function run-help() {
    BUFFER=$(/Applications/CLH.app/Contents/MacOS/clh "${BUFFER}")
    CURSOR=${#BUFFER}
    zle redisplay
}
zle -N run-help
bindkey "^h" run-help

# コマンドライン実行時にもコメントを使えるようにする
# setopt interactivecomments

