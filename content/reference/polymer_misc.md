/*
Title: SSH Tunnels
Description: SSH tunnel reference
Author: James Nadeau
Date: 12/06/2014
*/

#Misc Polymer things

###async(fn, inArgs, inTimeout) 
delay the execution of your code while keeping this bound appropriately

	// executes at the next micro-task checkpoint
	this.async(function() {
	this.$.request.go();
	})

###job(jobName, fn, inTimeout)
limit or debounce actions

	// executes when it hasn't been called for 750ms
	this.job('keyup', function() {
	  this.fire('save');
	}, 750);


from (https://divshot.com/blog/web-components/polymer-features-you-may-have-missed/)
