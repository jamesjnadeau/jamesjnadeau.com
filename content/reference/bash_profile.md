/*
Title: Bash Profile
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 01/01/2014
*/

<p>Here's the contents of my bashrc file I normally use:</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag" title=".baschrc"> 
# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific aliases and functions
#PS1="&gt; \w\n[\u@\h \T ]\$"
# Custom bash prompt via kirsle.net/wizards/ps1.html
export PS1="\[$(tput bold)\]\[$(tput setaf 1)\]&gt; \w    \n\[$(tput setaf 2)\][\u@\h\[$(tput setaf 4)\] \T\[$(tput setaf 2)\] ]\\$\[$(tput sgr0)\] "

#colorize grep
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

export EDITOR=/usr/bin/nano
export HISTFILESIZE=3000

# don't put duplicate lines in the history. See bash(1) for more options
# ... or force ignoredups and ignorespace
HISTCONTROL=ignoredups:ignorespace

# append to the history file, don't overwrite it
shopt -s histappend

###### pretend to be busy in office to enjoy a cup of coffee
function lookbusy()
{
cat /dev/urandom | hexdump -C | grep --color=auto "ca fe"
}

function natdebt()
{
watch -n 10 "wget -q http://www.brillig.com/debt_clock -O - | grep debtiv.gif | sed -e 's/.*ALT=\"//' -e 's/\".*//' -e 's/ //g'"
}

###### edit the svn log at  the given revision
function svnlogedit() {
    svn propedit svn:log --revprop -r$1 --editor-cmd gedit
}

###### svn recursive directory/file adder
# this will recursively add files/directories in SVN
function svnradd() { for i in $1/*;do if [ -e "$i" ];then if [ -d "$i" ];then svn add $i;svnradd $i;else svn add $i;fi; fi;done }

###### display the revision number of the current repository
function svn_rev() {
	svn info $@ | awk '/^Revision:/ {print $2}'
}

function svn_uplog() {
	local old_revision=`svn_rev $@`
	local first_update=$((${old_revision} + 1))

	svn up -q $@
	if [ $(svn_rev $@) -gt ${old_revision} ]
	then
		svn log -v -rHEAD:${first_update} $@
	else
		echo "No Changes."
	fi
}

###### display animated hourglass in the shell to indicate ongoing processing
function hourglass() { s=$(($SECONDS +${1:-10}));(tput civis;while [[ $SECONDS -lt $s ]];do for f in '|' ' ' '\-' /;do echo -n $f&amp;&amp;sleep .2s&amp;&amp;tput cub1;done;done);tput cnorm; }

function stopwatch() {
# copyright 2007 - 2010 Christopher Bratusek
BEGIN=$(date +%s)
while true; do
    NOW=$(date +%s)
    DIFF=$(($NOW - $BEGIN))
    MINS=$(($DIFF / 60))
    SECS=$(($DIFF % 60))
    echo -ne "Time elapsed: $MINS:`printf %02d $SECS`\r"
    sleep .1
done
}

function webcrawl()
{
lynx -dump $1 | grep -A999 "^References$" | tail -n +3 | awk '{print $2 }'
}

###### usage: wgetall mp3 http://example.com/download/
function wgetall() { wget -r -l2 -nd -Nc -A.$@ $@ ; }

alias matrix='echo -e "\e[32m"; while :; do for i in {1..16}; do r="$(($RANDOM % 2))"; if [[ $(($RANDOM % 5)) == 1 ]]; then if [[ $(($RANDOM % 4)) == 1 ]]; then v+="\e[1m $r   "; else v+="\e[2m $r   "; fi; else v+="     "; fi; done; echo -e "$v"; v=""; done'
alias matrix2='echo -e "\e[31m"; while $t; do for i in `seq 1 30`;do r="$[($RANDOM % 2)]";h="$[($RANDOM % 4)]";if [ $h -eq 1 ]; then v="\e[1m $r";else v="\e[2m $r";fi;v2="$v2 $v";done;echo -e $v2;v2="";done;'
alias matrix3='COL=$(( $(tput cols) / 2 )); clear; tput setaf 2; while :; do tput cup $((RANDOM%COL)) $((RANDOM%COL)); printf "%$((RANDOM%COL))s" $((RANDOM%2)); done'
alias matrix4='echo -ne "\e[32m" ; while true ; do echo -ne "\e[$(($RANDOM % 2 + 1))m" ; tr -c "[:print:]" " " &lt; /dev/urandom | dd count=1 bs=50 2&gt; /dev/null ; done'
alias matrix5='tr -c "[:digit:]" " " &lt; /dev/urandom | dd cbs=$COLUMNS conv=lcase,unblock | GREP_COLOR="1;32" grep --color "[^ ]"'
alias screensaver='for ((;;)); do echo -ne "\033[$((1+RANDOM%LINES));$((1+RANDOM%COLUMNS))H\033[$((RANDOM%2));3$((RANDOM%8))m$((RANDOM%10))"; sleep 0.1 ; done'								# terminal screensaver
alias starwars='telnet towel.blinkenlights.nl'							# the famous starwars ASCII version from telnet

alias bandwidth='dd if=/dev/zero of=/dev/null bs=1M count=32768'			# processor / memory bandwidthd? in GB/s
alias website_dl='wget --random-wait -r -p -e robots=off -U mozilla "$1"'		# download an entire website
alias website_images='wget -r -l1 --no-parent -nH -nd -P/tmp -A".gif,.jpg" "$1"'	# download all images from a site

## saw this here:http://lifehacker.com/supercharge-your-command-lines-history-search-with-fou-478683529
"\e[A": history-search-backward
"\e[B": history-search-forward
set show-all-if-ambiguous on
set completion-ignore-case on
</pre>

<p>Found this recently and it's proven much more functional then the normal ^r I was using before.</p>
<p><a href="https://coderwall.com/p/oqtj8w">https://coderwall.com/p/oqtj8w</a></p>

<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag" title=".inputrc">#from: https://coderwall.com/p/oqtj8w
"\e[A": history-search-backward
"\e[B": history-search-forward
set show-all-if-ambiguous on
set completion-ignore-case on<font face="Lucida Grande, Lucida Sans Unicode, sans-serif"><span style="font-size: 11px; line-height: 16.25px; white-space: normal;">
</span></font></pre>
