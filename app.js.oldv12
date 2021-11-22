const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const fs = require('fs')

const client = new Discord.Client()

let playYoutubeRE = /^!play https:\/\/www.youtube.com\/watch\?v=.{11}$/;
let saveYoutubeRE = /^!save https:\/\/www.youtube.com\/watch\?v=.{11}$/;
let ttsRE = /^!tts .*$/;

let videoCount = 0;

if (process.env.DISCORDBOTID) {

  client.on('message', (receivedMessage) => {

      // TODO restrict !play command to authorized users

      // TODO add command to clear queue

      // Set bot status
      client.user.setActivity("your every move", {type: "WATCHING"})

      // Prevent bot from responding to its own messages
      if (receivedMessage.author == client.user) {
          return
      }

      // Create text file, read file, then create mp3 from file via python script?
      if (receivedMessage.content.match(ttsRE)) {

        //let messageToSend = "Writing file to media/txtfiles as tts.txt";

        let ttsString = receivedMessage.content.split("!tts ")[1]

        fs.writeFile('media/' + videoCount + '-tts.txt', ttsString, function (err) {
          if (err) return console.log(err);
          console.log("Couldn't write TTS file.");
        });

        videoCount++;

        //receivedMessage.channel.send(messageToSend)

      }

      // Check for the '!save' command
      if (receivedMessage.content.match(saveYoutubeRE)) {

        // Check for number of videos downloaded, if more than 100, don't save more
        let media = fs.readdirSync('media/saved');
        let messageToSend = "";

        if (media.length < 100) {

          let youtubeURL = receivedMessage.content.split(" ")[1]
          let youtubeID = youtubeURL.split("=")[1]

          // Download file to media directory
          const stream = ytdl(youtubeURL, { filter: 'audioonly' }).pipe(fs.createWriteStream('media/saved/' + videoCount + "-" + youtubeID + '.mp3'));
          videoCount++;

          messageToSend = "Saving song...";

        }
        else {

          messageToSend = "Did not save song because storage is full (limit 100 videos saved)";

        }

        receivedMessage.channel.send(messageToSend)

      }

      // Check for the '!play' command (string needs to start with '!play' and match the youtubeRE string)
      if (receivedMessage.content.match(playYoutubeRE)) {

        // Check for number of videos downloaded, if more than 10, don't queue more
        let media = fs.readdirSync('media');
        let messageToSend = "";

        if (media.length < 10) {

          let youtubeURL = receivedMessage.content.split(" ")[1]
          let youtubeID = youtubeURL.split("=")[1]

          // Download file to media directory
          const stream = ytdl(youtubeURL, { filter: 'audioonly' }).pipe(fs.createWriteStream('media/' + videoCount + "-" + youtubeID + '.mp3'));
          videoCount++;

          messageToSend = "Queueing song...";

        }
        else {

          messageToSend = "Did not queue song because queue is full (limit 10 videos queue)";

        }

        receivedMessage.channel.send(messageToSend)

      }

      // Check for messages sent to bot (@<botname>)
      if (receivedMessage.content.includes(client.user.id.toString())) {

        //receivedMessage.channel.send("Message received from " + receivedMessage.author.toString() + ": " + receivedMessage.content)

        randomNum = Math.floor(Math.random() * 10);
        let messageToSend = "";

        switch (randomNum) {
          case 0:
            messageToSend = "Ayo what up wit it doe";
            break;
          case 1:
            messageToSend = "Oh hey didnt see u there";
            break;
          case 2:
            messageToSend = "How u doing beautiful";
            break;
          case 3:
            messageToSend = "What?";
            break;
          case 4:
            messageToSend = "you are a bitch";
            break;
          case 5:
            messageToSend = "lols!";
            break;
          case 6:
            messageToSend = "hey";
            break;
          case 7:
            messageToSend = ":^)";
            break;
          case 8:
            messageToSend = "SUP";
            break;
          case 9:
            messageToSend = "Haha!";
            break;

        }

        receivedMessage.channel.send(messageToSend)

    }

  })

  client.login(process.env.DISCORDBOTID) // Replace XXXXX with your bot token

}
else {

  console.log("Please load DISCORDBOTID as environment variable (docker run ... -e DISCORDBODID='xxx'' or 'docker run ... --env-file /path/to/envfile.txt')")

}
