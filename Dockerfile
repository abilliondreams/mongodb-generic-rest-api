# LICENSE UPL 1.0
#
# Copyright (c) 2021-2022 abilliondreams. All rights reserved.
#
# abilliondreams DOCKERFILES PROJECT
# --------------------------------
# This is the Dockerfile for a core services server based on nodejs
# 
# REQUIRED FILES TO BUILD THIS IMAGE
# ----------------------------------
# None
#
# HOW TO BUILD THIS IMAGE
# -----------------------
# Put all downloaded files in the same directory as this Dockerfile
# Run: 
#      $ docker build -t abilliondreams/ffbranodejsappserver-base:2022 . 
#
#
# Pull base image
# ---------------
FROM node:16.15.0 as base

# Maintainer
# ----------
LABEL maintainer="Sachin Patidar <eng.sachin@gmail.com>"

USER root
RUN apt-get update && \    
    apt-get clean

RUN mkdir /code/

RUN mkdir /logs/

# Add PM2 as an option for starting node
RUN npm i -g pm2

COPY src/ /code/

WORKDIR /code

RUN npm install

# frontail
# --------

RUN npm i frontail -g

EXPOSE 4000 9001
RUN apt-get remove file -y
RUN apt-get remove libapr1 -y
RUN apt-get remove libnghttp2-14 -y

CMD ["/bin/sh",  "-c",  "frontail --url-path /nodelogs --path /nodelogs -d /logs/app.log ; pm2-runtime index.js --node-args='--max-old-space-size=32768' "]

