#!/usr/bin/env bash

command docker ps >/dev/null 2>&1 || { echo "docker not running? aborting..." >&2; exit 1; }

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

IMAGE="thegitfather/photonline:0.1.0"
CONTAINER="photonline"

cd "$DIR"/..; gulp build
cd dist; npm install --only=prod
cd ..; tar cvfz dist.tar.gz dist/

chmod 755 "$DIR"/../docker/startup.sh

docker build -t "$IMAGE" .

# rm old images/containers
docker stop "$CONTAINER"; docker rm "$CONTAINER"
docker rmi $(sudo docker images -f "dangling=true" -q)

exit 0
