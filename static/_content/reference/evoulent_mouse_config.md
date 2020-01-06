/*
Title: Evoluent Mouse config for Linux
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 01/01/2014
*/

## Evoluent Mouse config for Linux

lsusb to get the USBID below, then add the following to file:

/usr/share/X11/xorg.conf.d/90-evoluent.conf

OR

/etc/X11/xorg.conf.d/10-quirks.conf

	Section "InputClass"
	Identifier "Evoluent"
	MatchUSBID "1a7c:0168"
	Option "ButtonMapping" "1 4 3 2 5 6 7 8"
	EndSection

you will need to log out then back in
