#!/bin/bash

sudo git pull https://github.com/codingwatermelon/ttsapp.git

docker build -t jftorres/armv7ttsapp . && docker push jftorres/armv7ttsapp
