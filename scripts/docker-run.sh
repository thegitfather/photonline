#!/usr/bin/env bash

command docker ps >/dev/null 2>&1 || { echo "docker not running? aborting..." >&2; exit 1; }

IMAGE="thegitfather/photonline:0.1.0"
CONTAINER="photonline"
ENV="prod"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENVDIR="${DIR}/../docker-volume-data/${ENV}"

if [ ! -e "$ENVDIR" ]; then
  mkdir -p "$ENVDIR"/mongodb
  chmod 777 "$ENVDIR"/mongodb
fi

#docker run -ti --rm \
docker run -d \
  --name "$CONTAINER" \
  --env-file "$DIR"/../docker/"$ENV".env \
  --expose 19321 -p 19321:19321 \
  -v "$ENVDIR"/public:/srv/photonline/dist/public \
  -v "$ENVDIR"/mongodb:/srv/photonline/mongodb \
  "$IMAGE"

exit 0
