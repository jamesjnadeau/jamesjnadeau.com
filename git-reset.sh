#!/bin/bash

git fetch --all
git reset --hard origin/master

chown apache:apache ./ -r
