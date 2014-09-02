/*
Title: Debouncing Javascript
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 05/05/2014
*/
Use this a lot to delay user/server interaction to keep requests low

	var debounce = function (func, threshold, execAsap) 
	{
		
		var timeout;
		
		return function debounced () 
		{
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null; 
			};
		
			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);
		
			timeout = setTimeout(delayed, threshold || 100); 
		};
	}




[source](http://unscriptable.com/2009/03/20/debouncing-javascript-methods/)

