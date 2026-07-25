---
title: Chromebook Crouton
description: Setting up Crouton on a Chromebook to run a Linux desktop alongside ChromeOS.

date: 2014-01-01
---

#Chromebook Setup

###Initial install

	sudo sh ~/Downloads/crouton -r trusty -t kde,audio,xiwi,extension,cli-extra

###Update after OS update

	sudo sh ~/Downloads/crouton -u -n trusty