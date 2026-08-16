#!/bin/sh
# One build stamp, two files. Run this before every push so the installed
# app can tell it is out of date and refresh itself.
B=$(date +%Y%m%d%H%M)
sed -i "s/const CACHE = 'scales-[^']*'/const CACHE = 'scales-$B'/" sw.js
sed -i "s/const APP_BUILD = '[^']*'/const APP_BUILD = '$B'/" index.html
echo "build $B"
grep -h "const CACHE\|const APP_BUILD" sw.js index.html
