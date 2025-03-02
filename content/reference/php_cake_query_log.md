---
title: CakePHP 1.2 Last Query 
description: Used this for lookbooks a lot
Date: 3/3/2015
---


```php
	function getLastQuery()
	{
		$dbo = $this->getDatasource();
		$logs = $dbo->_queriesLog;

		return end($logs);
	}
```