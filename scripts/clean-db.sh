#!/usr/bin/env bash

command -v mongo >/dev/null 2>&1 || { echo "please make sure 'mongo' is properly installed. aborting..." >&2; exit 1; }

BASEDIR=$(dirname $0)

mongo "${BASEDIR}"/clean-db.js

# just remove files so directories stay (initially created at server start)
find "${BASEDIR}"/../uploads -mindepth 1 -maxdepth 2 -type f -exec rm -fv {} \;

exit 0
