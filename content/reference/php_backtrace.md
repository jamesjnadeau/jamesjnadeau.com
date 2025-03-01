---
title: PHP backtrace
description: An easy way to get what called this particular funciton.
Date: 10/29/2014
---

#Get PHP Calling Funciton

	$backtrace = debug_backtrace();
	$output = 'Called From: '.$backtrace[1]["function"].' '
		.':'.$backtrace[1]["line"].' '
		.'Args: '.print_r($backtrace[1]["args"], true);