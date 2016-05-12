FROM node:latest

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 && \
    echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

RUN apt-get update && \
    apt-get install -y --no-install-recommends fftw3-dev \
      libfftw3-dev \
      liborc-0.4-dev \
      libopenexr-dev \
      gobject-introspection \
      python-gi-dev \
      libgirepository1.0-dev \
      nasm \
      swig \
      gtk-doc-tools \
      mongodb-org && \
    rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/mozilla/mozjpeg/releases/download/v3.1/mozjpeg-3.1-release-source.tar.gz | tar xvz && \
    cd mozjpeg && \
    ./configure && \
    make && \
    make install && \
    cd .. && rm -rf mozjpeg

RUN git clone -b 8.1 https://github.com/jcupitt/libvips.git && \
    cd libvips && \
    ./bootstrap.sh && \
    ./configure --with-jpeg-includes=/opt/mozjpeg/include \
                --with-jpeg-libraries=/opt/mozjpeg/lib64 && \
    make && \
    make install && \
    cd .. && rm -rf libvips

ENV VIPSHOME /usr/local
ENV LD_LIBRARY_PATH $LD_LIBRARY_PATH:$VIPSHOME/lib
ENV PATH $PATH:$VIPSHOME/bin
ENV PKG_CONFIG_PATH $PKG_CONFIG_PATH:$VIPSHOME/lib/pkgconfig

WORKDIR /srv/photonline

RUN wget -O - https://github.com/thegitfather/photonline/releases/download/v0.1.0/dist-1463073128.tar.gz | tar xzf - -C "/srv/photonline"
#ADD docker/dist-*.tar.gz /srv/photonline

ADD docker/mongod.conf /etc
ADD docker/startup.sh /srv/photonline
RUN chmod 755 /srv/photonline/startup.sh

CMD ["/srv/photonline/startup.sh"]
