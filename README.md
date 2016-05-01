# photonline

This project was created with an educational aim towards learning AngularJS and the MEAN stack. Therefore I used the Yeoman [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) to get to know the basic structure of a MEAN app.

## Features

- MD5 generation within browser and checking if the file is already on the server
- modern/lightweight CSS framework which is based on [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)
- Dockerized for easy/isolated deployment

## Screenshots

<img src="/screenshots/create-gallery.jpg" width="250">
<img src="/screenshots/gallery-list.jpg" width="250">
<img src="/screenshots/photo.jpg" width="250">

## Used Libs

### Server-side

- Babel (ES6 -> ES5 compilation)
- Bluebird (promisify mongoose API calls)
- Cron (run daily clean up function)
- Multer (Express middleware for saving the uploaded files)
- ~~Passport~~ (work in progress)
- Sharp (lightning fast image resizing lib)

### Client-side

- ngResource (interact with RESTful server-side data sources)
- angular-ui-router (Angular state manager)
- ng-file-upload (manage uploads for Angular)
- SparkMD5 (generate MD5 from files before uploading them)
- ng-dialog (modal window)
- angular-flabel (custom directive for floating labels)
- Bulma (CSS3 framework)
- Font-Awesome icons

## Production

For production I recommend building a [Docker](https://www.docker.com/) image and running the app in a container (all dependencies will be included while building the image). A `Dockerfile` is included in this repo. The image is based on the official [node docker image](https://hub.docker.com/_/node/) which uses Debian as a base.

All configuration should be done via environment variables. So if you want to run the app on a different port than `19321` adjust it in `docker/prod.env` and make sure you expose and link the correct port when running the container (e.g. `--expose 8080 -p 19321:8080`).

There are also bash scripts for building/running a docker image/container inside the `scripts/` folder you can use (`docker-build.sh` and `docker-run.sh`) but first you need to clone/fork this repo to the system where the Docker container should be running:

```sh
$ git clone https://github.com/thegitfather/photonline
```

### Build docker image

1. change into the folder where the `Dockerfile` is located
2. build docker image with e.g.:

```sh
$ docker build -t thegitfather/photonline .
```

### Run docker container

To access/backup the uploaded photo files and MongoDB data it might be a good idea to use a docker 'volume' linking to a path on the host system.

Adjust the access permissions for the `mongodb` folder first otherwise MongoDB will have problems writing to it (Nodejs has no issues though..):

```sh
$ mkdir -p docker-volume-data/mongodb && chmod 777 docker-volume-data/mongodb
```

Now you should check the environment variables (`docker/prod.env`) that are going to be used while creating a container from the image. Set the `SESSION_SECRET` to some random string for security reasons.

Next step is to run/create a docker container:

```sh
$ docker run -d \
    --name photonline \
    --env-file docker/prod.env \
    --expose 19321 -p 19321:19321 \
    -v `pwd`/docker-volume-data/public:/srv/photonline/dist/public \
    -v `pwd`/docker-volume-data/mongodb:/srv/photonline/mongodb \
    thegitfather/photonline
```

## Development

### Prerequisites

NodeJS 6.0.0 might be not building correctly for now so better use 5.x.x. You could use [tj/n](https://github.com/tj/n) for easy NodeJS version management/switching.

- Bower and Gulp (`$ npm install -g gulp-cli bower`)
- Python (2.x will do)
- node-gyp (`$ npm install -g node-gyp`)
- [MongoDB](https://www.mongodb.org/)

### Developing

1. run `npm install` to install server-side dependencies
2. run `bower install` to install client-side dependencies
3. run/start `mongod` daemon
4. run `gulp serve` to start the development server and watch task

## Build for production

Run `gulp build` for building (output will be in `dist` folder).

## Set ENV variables before starting server

```sh
$ NODE_ENV=production IP=127.0.0.1 PORT=19000 PUBLIC_PATH=/some/absolute/path/public SESSION_SECRET=somesecret node dist/server
```
