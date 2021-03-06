#!/usr/bin/env bash

command docker ps >/dev/null 2>&1 || { echo "docker not running? aborting..." >&2; exit 1; }

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

IMAGE="thegitfather/photonline:0.1.0"
CONTAINER="photonline"

docker build -t "$IMAGE" -f "$DIR/../Dockerfile" "$DIR/.."

# rm old images/containers
docker stop "$CONTAINER"; docker rm "$CONTAINER"
docker rmi $(docker images -f "dangling=true" -q)

exit 0
