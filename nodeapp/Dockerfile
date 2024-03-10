FROM ubuntu:latest
# To saved the packaged docker image to the respective Github repo.
LABEL org.opencontainers.image.source https://github.com/kunalmehta14/Blob-API
# Selec the Language/Encoding type
ENV LANG en_US.utf8
# Update and installed required packages
RUN apt-get update && apt-get install \
    sudo -y \
    curl -y \
    supervisor -y
# Update time zone settings
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
# Download and install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN apt-get update && apt-get upgrade -y
# Install Nodejs and NPM
RUN apt-get install nodejs -y
RUN npm install -g npm@latest
# Create the app directory and install node modules
RUN mkdir /opt/app
WORKDIR /opt/app
COPY app/package.json /opt/app/package.json
RUN npm install
RUN npm install typescript
#Copy the logging script and make it executable
RUN mkdir /var/log/blobapi
USER root
RUN ln -sf /proc/1/fd/1 /var/log/blobapi/info.log
RUN ln -sf /proc/1/fd/1 /var/log/blobapi/error.log
EXPOSE 80
#Copy supervisoryd.conf configuration that defines the startup services
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
#start startup services when the server starts
CMD ["/usr/bin/supervisord"]