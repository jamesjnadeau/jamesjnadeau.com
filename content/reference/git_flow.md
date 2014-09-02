/*
Title: Git flow
Description: Git flow quick reference
Author: James Nadeau
Date: 01/01/2014
*/

#Quick Reference

    # 1 - Pull Development, Starting Fresh
    $ git checkout development
    $ git pull origin development
    $ git checkout -b new-branch
    # Note: "new-branch" is usually "feature/feature-name" or "hotfix/fix-name"
    
    # 2 - Work. Do commit(s) (git commit).
    
    # 3 - Push your branch (it doesn't have to be "final", but the code shouldn't break anything)
    $ git push origin new-branch

    # 4 - Things are done and now we'll make sure it's working with the latest base (development)
    $ git checkout development
    $ git pull origin development
    $ git checkout new-branch
    $ git rebase development
    # Note: resolve conflicts, if any!
    
    # Do #3 again (push)
    
    # 5 - Create the Pull Request (check the explanation before the quick start)
    
    # 6 - After the request is merged, remove your branch locally, and update remote branch references locally
    $ git checkout development
    $ git branch -D new-branch
    $ git remote prune origin

[originally from here](https://github.com/clevertech/wiki/wiki/Using-Git-and-GitHub-Properly)
