/*
Title: Counting IP's in Logs
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 01/01/2014
*/

How to count ip addresses in apache log files:

	zcat *.gz | awk '{print $1}' | sort | uniq -c | sort -rn | head
