#!/bin/bash

containerID=$(docker run -d -v "/home/bao/projects/discordbot/maintenance:/data" node "/data/deploy-commands.js")

output=$(docker logs ${containerID})

echo $output

echo "Updated commands."
