#!/bin/bash
docker stop $(docker ps --filter ancestor=jftorres/armv7ttsapp --format "{{.ID}}")

docker pull jftorres/armv7ttsapp

docker run -p 49160:8080 -v "/home/pi/discordbot/discordbotmedia:/usr/src/app/media" --env-file env.txt -d jftorres/armv7ttsapp
