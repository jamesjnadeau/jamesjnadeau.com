---
title: Forcing a build with node-pre-gyp
description: Getting musl libc to force compilation in node sub-modules
---

# TIL: about node-pre-gyp

`node-pre-gyp` allows compiled binaries to be included with node modules easily!

I had a problem with a pre-built binary not working with musl libc, which I'm using with
docker and alpine linux. Luckily, there's and easy work around to this. Adding the following
to my docker build install/rebuild step forces a build.

`npm install --build-from-source=problem_module`

That's it! from now on, that will be built for musl libc when I build my docker image.
