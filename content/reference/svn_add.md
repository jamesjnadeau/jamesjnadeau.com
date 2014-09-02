/*
Title: SVN add
Description: This description will go in the meta description tag
Author: James Nadeau
Date: 01/01/2014
*/

## Ultimate SVN add

I like to keep everything backed up with version control because it 
makes everything easier in the long run. I frequently run into problems 
with other people screwing up svn and I get stuck fixing what is going 
on when the cron jobs break that automagically back stuff up. After some 
research and combinging others efforts I came to this command that adds 
everything not currently added to svn. It also deals with spaces in the 
file names.

	svn status | awk '/\?/' | sed 's/\? *//g' | sed 's/ /\\ /g' | xargs svn add

#### Here's the breakdown of what is going on ####

##### svn status #####

output the status of files in the current folder, if you don't understand this part, you probably shouldn't go any futher :)

##### awk '/\?/' #####

find all lines that have a ?, aka they have not been added to svn yet

##### sed 's/\? *//g' #####

further strip down the line to remove the ? mark, leaving the path only

##### sed 's/ /\\ /g' #####

convert spaces in path to one that is escaped.

##### xargs svn add #####

take each line and pass them as the last argument to svn add
