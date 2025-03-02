---
title: Counting IP's in Logs
description: This description will go in the meta description tag
Date: 01/01/2014
---

How to count ip addresses in apache log files:

	zcat *.gz | awk '{print $1}' | sort | uniq -c | sort -rn | head
