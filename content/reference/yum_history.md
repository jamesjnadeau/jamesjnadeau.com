---
title: Yum History
description: Using yum history to review and undo previous package transactions.
date: 2014-01-01
---

```
$yum history
	Loaded plugins: fastestmirror, security
	ID     | Login user               | Date and time    | Action(s)      | Altered
	-------------------------------------------------------------------------------
	    87 | root <root>              | 2013-05-14 06:07 | Update         |    5
	    86 | root <root>              | 2013-04-10 06:47 | Install        |    1
	    85 | root <root>              | 2013-04-10 06:47 | Install        |    1
```

```
$yum history undo 86
```
