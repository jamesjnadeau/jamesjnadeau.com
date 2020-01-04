/*
Title: Sane Defaults for Gource
Description: defaults I use for gource
Author: James Nadeau
Date: 03/14/2015
*/

defaults

    gource -1920x1080 -a .8 --user-scale 2 --camera-mode overview --highlight-users --dir-name-depth 4 --hide filenames --seconds-per-day .1

output to ffmpeg

    gource -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4