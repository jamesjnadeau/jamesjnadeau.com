/*
Title: CakePHP 1.2 Last Query 
Description: Used this for lookbooks a lot
Author: James Nadeau
Date: 3/3/2015
*/



	function getLastQuery()
	{
		$dbo = $this->getDatasource();
		$logs = $dbo->_queriesLog;

		return end($logs);
	}