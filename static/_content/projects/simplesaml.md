---
title: SimpleSAML PHP
description: This description will go in the meta description tag
---

#Single Sign on with SAML

<div>
	<img class="img-fluid img-rounded" src="/files/boschwaytogrow_login.png" style="max-width: 400px;" />
</div>

***

When I arrived at Red Barn, it's login system needed an overhall for a 
number of reasons. We wanted to go with a stable technology that allowed 
us to authenticate, and accept authentications from other parties. SAML 2.0
was the go to choice for this at the time.

After rewriting our session boot code, it was simple to wrap this with 
SimpleSAMLphp authentication, and our log in system. This ontop of 
memcache gave us all the login and session storage speed we were lacking.

This quickly became a great choice, as we were asked by one of our 
clients to implement a SAML 1.0 process with us being the Identity Provider. 
The other end wouldn't work with SimpleSAML off the bat, but it was easy
to override SimpleSAML to meet their weird speck, and pass along more 
variables(an account balance in this case). 
