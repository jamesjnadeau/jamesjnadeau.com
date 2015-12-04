/*
Title: Let's Encrypt quick push to google app engine
Description: defaults I use for gource
Author: James Nadeau
Date: 03/14/2015
*/

Quick steps to get a ssl cert and key from let's encrypt
  ```
  git clone https://github.com/letsencrypt/letsencrypt
  cd letsencrypt
  ./letsencrypt-auto -a manual certonly
  ``` 

After entering some details and confirming ownership of your site, you'll need to enter the cert from
  ```
  /etc/letsencrypt/live/www.example.com/fullchain.pem
  ```

And then you'll need to decrypt the key so google can use it:
  ```
  sudo openssl rsa -inform pem -in /etc/letsencrypt/live/www.example.com/privkey.pem -outform pem | less
  ```