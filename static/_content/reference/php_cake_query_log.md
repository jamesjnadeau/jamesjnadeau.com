---
title: CakePHP 1.2 Last Query 
description: Used this for lookbooks a lot
date: 3/3/2015
---


```php
	function getLastQuery()
	{
		$dbo = $this->getDatasource();
		$logs = $dbo->_queriesLog;

		return end($logs);
	}
```