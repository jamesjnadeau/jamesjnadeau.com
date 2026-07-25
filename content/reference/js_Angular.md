---
title: Angular Notes
description: Angular.js debugging notes, including inspecting scope from the browser console.
date: 2014-05-05
---

##Inspect Scope

After selecting an element in Dev Inspector, $0 will hold the last selected element, 
$1 holds the second to last element

	angular.element($0).scope()




      
