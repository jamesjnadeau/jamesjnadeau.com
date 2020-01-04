/*
Title: Ensure Javascript Callbacks
Description: Ensure there is a JS callback
Author: James Nadeau
Date: 01/01/2014
*/

# Ensure there is callback

	callback = (typeof callback === 'function') ? callback : function() {};
