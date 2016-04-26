#!/usr/bin/env bash

command -v mongo >/dev/null 2>&1 || { echo "please make sure 'mongo' is properly installed. aborting..." >&2; exit 1; }

if [ "$#" -ne 1 ]; then
  echo "Usage: `basename $0` <host[:port]>/<db-name>"
  exit 1
fi

BASEDIR=$(dirname $0)

mongo "$1" "${BASEDIR}"/clean-db.js

# just remove files so directories stay (initially created at server start)
find "${BASEDIR}"/../public -mindepth 1 -type f -exec rm -fv {} \;

exit 0
