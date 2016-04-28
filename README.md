# photonline

This project was created with an educational aim towards learning AngularJS and the MEAN stack. Therefore I used the Yeoman [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) to get to know the basic structure of a MEAN app.

## Features

- MD5 generation within browser and checking if the file is already on the server
- modern/lightweight CSS framework which is based on [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)
- Dockerized for easy/isolated deployment

## Screenshots

<img src="/screenshots/scr_create-gallery.png" width="250">
<img src="/screenshots/scr_gallery-list.png" width="250">
<img src="/screenshots/scr_photo.jpg" width="250">

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

1. clone/fork this repo
2. build the dist folder with `npm install && bower install && gulp build`
3. change into `dist` folder and run `npm install --only=prod`
4. change back to the root folder where the `Dockerfile` is and build the docker image with e.g.:

```sh
docker build -t photonline .
```

### Configuration

Edit `docker/prod.env` to your needs:

```
NODE_ENV=production
PORT=19321
IP=0.0.0.0
MONGODB=mongodb://0.0.0.0:27111/photonline
SESSION_SECRET=somesecret
```

MongoDB is in the Docker build included and will be used so the `IP` and `PORT`. The MongoDB config can be found in `docker` folder too but usually you don't need to change it (port `27111` is already set).

And run a docker container from the image (new container will be created automatically):

```sh
$ docker run -d --name photonline --env-file docker/prod.env --expose 19321 -p 19321:19321 -v `pwd`/public:/srv/photonline/dist/public photonline
```

The folder for uploaded images can be configured in this command so that the files will be accessible outside the docker container (e.g. for backups). MongoDB files stay in the container at the moment but of course you can change that too (see `docker/mongod.conf`: `dbPath`) and adjust the above `docker run` command (I had some problems with folder permissions when i tried this so maybe you need to do a `$ chmod 777 <mongodb-folder>` or find a better solution).


## Development

### Prerequisites

- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. run `npm install` to install server dependencies
2. run `bower install` to install front-end dependencies
3. run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running
4. run `gulp serve` to start the development server

## Build & development

Run `gulp build` for building (output will be in `dist` folder).

## Set ENV variables before starting server

```sh
$ NODE_ENV=production IP=127.0.0.1 PORT=19000 PUBLIC_PATH=/some/absolute/path/public SESSION_SECRET=somesecret node dist/server
```
