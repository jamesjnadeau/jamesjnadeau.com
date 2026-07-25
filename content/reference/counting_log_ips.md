---
title: Counting IP's in Logs
description: A one-liner for counting IP addresses in gzipped Apache log files.
date: 2014-01-01
---

How to count ip addresses in apache log files:

	zcat *.gz | awk '{print $1}' | sort | uniq -c | sort -rn | head
