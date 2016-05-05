#!/usr/bin/env bash

command docker ps >/dev/null 2>&1 || { echo "docker not running? aborting..." >&2; exit 1; }

IMAGE="thegitfather/photonline:0.1.0"
CONTAINER="photonline"
ENV="production"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VOL_DIR="${DIR}/../docker-volume-data"

if [ ! -e "$VOL_DIR" ]; then
  mkdir -p "$VOL_DIR"/mongodb
  chmod 777 "$VOL_DIR"/mongodb
fi

#docker run -ti --rm \
docker run -d \
  --name "$CONTAINER" \
  --env-file "$DIR"/../docker/"$ENV".env \
  --expose 19321 -p 19321:19321 \
  -v "$VOL_DIR"/public:/srv/photonline/dist/public \
  -v "$VOL_DIR"/mongodb:/srv/photonline/mongodb \
  "$IMAGE"

exit 0
