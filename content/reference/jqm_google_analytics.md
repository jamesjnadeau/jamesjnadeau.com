---
title: jQuery Mobile Google Analytics
description: This description will go in the meta description tag
Date: 01/01/2014
---

# Tracking page loads with ajax page transitions
<div>
	<div class="content well" >
	I use the following snippet before fully loading jQuery Mobile(or any page that uses ajax loading, including this one) to set up Google Analytics.
	</div>
</div>


### Better/New
```js
		// Google Analytics
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'Your analytics code', 'auto');
		ga('send', 'pageview');
		
		var ga_track_page = function()
		{
			hash = location.hash;
			try
			{
				if (hash)
					ga('send', '_trackPageview', hash.substr(1));
				else
					ga('send', '_trackPageview', location.pathname);
			}
			catch(err)
			{
				console.log('unable to track page', err);
			}
		};
		
		...Ajax Load a page....
		ga_track_page();
	
```
### Old Style
```js
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
```
[Source](http://blog.mojotech.com/post/29501319906/google-analytics-within-jquery-mobile)
