---
title: CakePHP 1.2 Last Query 
description: Used this for lookbooks a lot
date: 2015-03-03
---


```php
	function getLastQuery()
	{
		$dbo = $this->getDatasource();
		$logs = $dbo->_queriesLog;

		return end($logs);
	}
```