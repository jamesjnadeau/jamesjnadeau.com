---
title: Git Rebase theirs
description: Which side 'theirs' actually refers to during a git rebase, and how to resolve it.
date: 2018-10-21
---

# Git Rebase Theirs

`theirs` in this case means the branch you are on, so if you are on branch
`feature`, that's the `theirs` in reference here.

```
  git rebase -s recursive -X theirs dev
```
