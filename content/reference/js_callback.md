---
title: Ensure Javascript Callbacks
description: Ensure there is a JS callback
Date: 01/01/2014
---

# Ensure there is callback

	callback = (typeof callback === 'function') ? callback : function() {};
