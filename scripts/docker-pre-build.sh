#!/usr/bin/env bash

command gulp -v >/dev/null 2>&1 || { echo "gulp-cli not found! aborting..." >&2; exit 1; }
command npm -v >/dev/null 2>&1 || { echo "npm not found! aborting..." >&2; exit 1; }
command tar --version >/dev/null 2>&1 || { echo "tar not found! aborting..." >&2; exit 1; }

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR"/..; gulp build && \
cd dist; npm install --only=prod && \
cd ..; rm -f docker/dist-*.tar.gz;
tar cvfz docker/dist-`date +%s`.tar.gz dist/

exit 0
