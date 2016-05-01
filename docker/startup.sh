#!/usr/bin/env bash

BASENAME=`basename "$0"`
PWD=`pwd -P`

echo -e "\nNODE_ENV: $NODE_ENV"
echo "IP: $IP"
echo "PORT: $PORT"
echo "PUBLIC_PATH: $PUBLIC_PATH"
echo "MONGODB: $MONGODB"
echo -e "SESSION_SECRET: $SESSION_SECRET\n"

echo "starting mongodb service and node server..."
/etc/init.d/mongod restart && node "$PWD"/dist/server
