My personal website
===
http://jamesjnadeau.com

This is a first draft site generator created with webpack. I originally committed to making my content in markedown with a custom header used in PHP's PicoCMS.

## npm install / node_modules note

TLDR;

  1. use `yarn add --ignore-scripts --save` to add a new package.
  2. run `yarn --force --build-from-source` to rebuild the package for your particular architecture/machine
  3. check with `git status` to see if the rebuild added any new files
  4. Add anything built to .gitignore
  5. Dev.

Because npm has proven itself to be an unreliable resource, all of node_modules is now
included in git. This has a bunch of advantages and only one minor drawback:
The initial download of the repo is larger.

The advantages:
- faster builds
- don't need npm, or an Internet connection to build docker anymore
- dependencies are actually tracked. You can review the changes to those dependencies over time alongside your code
- This repo is future proof, if npm goes away, we don't have to skip a beat.

> credit to the oldest post mentioning this I can find:  http://www.letscodejavascript.com/v3/blog/2014/03/the_npm_debacle#how-to-do-it
>
> also mentioned as a best practice in a note here: https://keymetrics.io/2014/06/25/ecosystem-json-deploy-and-iterate-faster/#setup
