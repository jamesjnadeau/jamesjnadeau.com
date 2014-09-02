/*
Title: Asus Laptop Notes
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 01/01/2014
*/

<div>
	<img class="right content-secondary" src="/files/asus_laptop.jpg" />
</div>

# Asus S500CA-RSI5T02 VivoBook Touch #



## Gnome Primary Monitor ##

Needed to change the primary monitor on my laptop when using an external monitor.

<blockquote>
	<p>xrandr --output VGA1&nbsp;--primary</p>
</blockquote>

<p><a href="http://blog.nachtarbeiter.net/2012/01/09/change-primary-monitor-in-gnome-3/">Source</a></p>


## Headphone ## 

Probably Related to my <a href="/reference/asus-laptop-ethernet-fix">Ethernet Trouble</a>, 
the headphone jack on my new laptop mysteriously stopped working.

Running the following, along with a shutdown/startup cycle fixed the issue. 
Seems it was related to my card not being detected properly


	echo "options snd-hda-intel model=asus" | sudo tee -a /etc/modprobe.d/alsa-base.conf

<p>
	<a href="http://askubuntu.com/questions/260889/headphones-not-working-on-windows-after-installing-ubuntu">Source</a>
</p>




## Ethernet ##
My ethernet device on my new asus laptop suddenly showed up as cable 
not plugged in! But it most certainly was plugged in, and a boot into 
windows showed it worked. I finally got it working by running the following:

	ethtool -s p3p1 autoneg off

where p3p1 is the device name.. used to be eth0

<p><a href="http://forums.fedoraforum.org/showthread.php?t=250807">Source</a></p>




## Evoluent Mouse Config ##
lsusb to get the USBID below, then add the following to file:

/usr/share/X11/xorg.conf.d/90-evoluent.conf<br>OR<br>/etc/X11/xorg.conf.d/10-quirks.conf

<blockquote><p>Section "InputClass"<br>Identifier "Evoluent"<br>MatchUSBID "1a7c:0168"<br>Option "ButtonMapping" "1 4 3 2 5 6 7 8"<br>EndSection</p></blockquote><p>you will need to log out then back in</p><p><a href="http://denishaine.wordpress.com/2011/12/01/evoluent-mouse-with-ubuntu-11-04-and-11-10/">Source</a></p>
