/*
Title: Bash Profile
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 10/29/2014
*/

#Get PHP Calling Funciton

	$backtrace = debug_backtrace();
	$output = 'Called From: '.$backtrace[1]["function"].' '
		.':'.$backtrace[1]["line"].' '
		.'Args: '.print_r($backtrace[1]["args"], true);