---
title: JavaScript Backtrace
description: Getting a readable JavaScript stack trace from the browser console.
date: 2014-10-05
---

##backtrace

    console.log((new Error).stack.split("\n"));
