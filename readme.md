See text tutorial for this project [here](https://codingwatermelon.github.io/howto/docker/raspberrypi/node/discord/2022/02/07/how-to-make-a-discord-bot.html)

DiscordJS v13 requires you to register slash commands
docker run --rm -v "/home/bao/projects/discordbot/maintenance:/data" -w /data -it node bash
node deploy-commands.js
