---
title: Let's Encrypt quick push to google app engine
description: defaults I use for gource
Date: 03/14/2015
---

Quick steps to get a ssl cert and key from let's encrypt
  ```
  sudo dnf install certbot
  certbot -a manual certonly
  ```

After entering some details and confirming ownership of your site, you'll need to enter the cert from
  ```
  /etc/letsencrypt/live/www.example.com/fullchain.pem
  ```

And then you'll need to decrypt the key so google can use it:
  ```
  sudo openssl rsa -inform pem -in /etc/letsencrypt/live/www.example.com/privkey.pem -outform pem | less
  ```
