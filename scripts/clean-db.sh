#!/usr/bin/env bash

command -v mongo >/dev/null 2>&1 || { echo "please make sure 'mongo' is properly installed. aborting..." >&2; exit 1; }

BASEDIR=$(dirname $0)

mongo "${BASEDIR}"/clean-db.js
#rm -fr "${BASEDIR}"/../uploads
find "${BASEDIR}"/../uploads -mindepth 1 -maxdepth 1 -type d -exec rm -fr {} \;

exit 0
