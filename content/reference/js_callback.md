---
title: Ensure Javascript Callbacks
description: Ensure there is a JS callback
date: 2014-01-01
---

# Ensure there is callback

	callback = (typeof callback === 'function') ? callback : function() {};
