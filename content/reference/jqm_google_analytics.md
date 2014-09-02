/*
Title: jQuery Mobile Google Analytics
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 01/01/2014
*/

I use the following snippet before fully loading jQuery Mobile to set up Google Analytics.

	/* 
	 * Google Analytics
	 */
	var ga_account_id = 'SET THIS';
	var _gaq = _gaq || [];
	 
	_gaq.push(['_setAccount', ga_account_id]);
	_gaq.push(['_setDomainName', 'none']);
	_gaq.push(['_trackPageview']);
	 
	(function() {
	    var ga = document.createElement('script');
	    ga.type = 'text/javascript';
	    ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '<a href="http://www.google-analytics.com/analytics.js" class="ui-link">www.google-analytics.com/analytics.js</a>';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	    console.log('google analytics loaded');
	})();
	 
	function ga_roam_track_page()
	{
	    console.log('tracking page');
	    hash = location.hash;
	    try
	    {
	        if (hash)
	            _gaq.push(['_trackPageview', hash.substr(1)]);
	        else
	            _gaq.push(['_trackPageview', location.pathname]);
	    }
	    catch(err)
	    {
	        console.log(err);
	    }
	}

[Source](http://blog.mojotech.com/post/29501319906/google-analytics-within-jquery-mobile)
