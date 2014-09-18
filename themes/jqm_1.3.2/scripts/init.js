$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.loader.prototype.options.text = 'Loading...';
	$.mobile.loader.prototype.options.textVisible = true;
	//$.mobile.page.prototype.options.domCache = true;
});


function open_menu(panel_selector)
{
	try
	{
		if ($(window).width() >= 880) 
		{
			$.mobile.activePage.find(panel_selector).panel( "open");
		}
		else  
		{
			$(panel_selector).panel( "option", "animate", true );
			$.mobile.activePage.find(panel_selector).panel( "close" );
		}
	}
	catch(error)
	{
		//console.log('cannot find panel');
	}
}

$(window).resize(function() 
{
	open_menu('#panel_left');
});

auto_open_menu = true;
main_panel_selector = '#panel_left';
$(document).on("pageshow.init", function() 
{
	
	if(auto_open_menu)
	{
		open_menu(main_panel_selector);
	}
	
	try
	{
		$( ".panel_right_mobile" ).on( "panelclose", 
			function( event, ui ) 
			{
				open_menu(main_panel_selector);
			} 
		);
	}
	catch(error)
	{
		//console.log('cannot find panel');
	}
});

$(document).on( "pagechangefailed", function( event ) 
{
	console.log('pagechangefailed, reloading page');
	setTimeout(window.location.reload(true), 1000);
});

$(document).on( "pageloadfailed", function( event ) 
{
	console.log('pageloadfailed, reloading page');
	setTimeout(window.location.reload(true), 1000);
});

/*
 * Page events
 */
//$.mobile.activePage.attr('id')
/*
$(document).live("pageload", function() {console.log('pageload');});
$(document).live("pagebeforechange", function() {console.log('pagebeforechange');});
$(document).live("pagebeforecreate", function() {console.log('pagebeforecreate');});
$(document).live("pagecreate", function() {console.log('pagecreate');});
$(document).live("pageinit", function() {console.log('pageinit');});
$(document).live("pagebeforeshow", function() {console.log('pagebeforeshow');});
$(document).live("pageshow", function() {console.log('pageshow');});
$(document).live("pagechange", function() {console.log('pagechange');});
$(document).live("pagebeforehide", function() {console.log('pagebeforehide');});
*/

/*
 * Google analytics
 *
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'SET THIS']);
// from: http://blog.mojotech.com/post/29501319906/google-analytics-within-jquery-mobile
_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); 
	ga.type = 'text/javascript'; 
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.google-analytics.com/analytics.js';
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
//fire off tracker on pageshow
$($(document).on('pageshow', ga_roam_track_page));
*/
