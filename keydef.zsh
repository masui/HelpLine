#
# Ctrl-Jでhelplineを呼ぶようにする
#
function run-help() {
    /usr/local/bin/helpline "${BUFFER}" < $TTY
    BUFFER=$(cat /tmp/helpline.cmd)
    CURSOR=${#BUFFER}
    zle redisplay
}
zle -N run-help
bindkey "^h" run-help

# コマンドライン実行時にもコメントを使えるようにする
# setopt interactivecomments

