#!/usr/bin/env bash


BASEDIR=$(dirname $0)

mongo "${BASEDIR}"/clean-db.js
#rm -fr "${BASEDIR}"/../uploads
find "${BASEDIR}"/../uploads -mindepth 1 -maxdepth 1 -type d -exec rm -fr {} \;

exit 0
