const { Client, Intents } = require('discord.js');
const ytdl = require('ytdl-core')
const fs = require('fs')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let youtubeURLRE = /^https:\/\/www.youtube.com\/watch\?v=.{11}$/;
let ttsRE = /^[a-zA-Z0-9]*$/;

let videoCount = 0;

client.once('ready', () => {
		console.log('Ready!');
		client.user.setActivity("your every move", {type: "WATCHING"})

});

client.on('interactionCreate', async interaction => {

	console.log("interaction triggered")

		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (commandName === 'ping') {
			await interaction.reply('Pong!');
		}
		else if (commandName === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}
		else if (commandName === 'user') {
			await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
		}
		else if (commandName === 'read') {

			let messageToSend = "";
			// Get string to speak
			const text = interaction.options.getString('text')

			// Validate text
			if (text.match(ttsRE)) {

				fs.writeFile('media/' + videoCount + '-tts.txt', text, function (err) {
					if (err) return console.log(err);
	        console.log("Couldn't write TTS file.");
	      });

				messageToSend = `Processing text to speech for: '${text}'`

				videoCount++;
				
			}
			else {

				messageToSend = 'Invalid entry: Enter text and numbers only'

			}

			await interaction.reply(messageToSend)

		}
		else if (commandName === 'play') {

			// Check for number of videos downloaded, if more than 10, don't queue more
      let media = fs.readdirSync('media');
      let messageToSend = "";

      if (media.length < 10) {

				// Get string from interaction
				const youtubeURL = interaction.options.getString('youtubeurl')

				// Validate youtubeURL
				if (youtubeURL.match(youtubeURLRE)) {

	        let youtubeID = youtubeURL.split("=")[1]

	        // Download file to media directory
	        const stream = ytdl(youtubeURL, { filter: 'audioonly' }).pipe(fs.createWriteStream('media/' + videoCount + "-" + youtubeID + '.mp3'));
	        videoCount++;

	        messageToSend = "Queueing song...";

				}
				else {

					messageToSend = "Invalid URL: Copy & paste the complete Youtube URL into this command e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"

				}
      }
      else {

        messageToSend = "Did not queue song because queue is full (limit 10 videos queue)";

      }

			await interaction.reply(messageToSend)

		}
		else if (commandName === 'save') {

			// Check for number of videos downloaded, if more than 100, don't save more
      let media = fs.readdirSync('media/saved');
      let messageToSend = "";

      if (media.length < 100) {

				// Get string from interaction
				const youtubeURL = interaction.options.getString('youtubeurl')

				// Validate youtubeURL
				if (youtubeURL.match(youtubeURLRE)) {

	        let youtubeID = youtubeURL.split("=")[1]

	        // Download file to media directory
	        const stream = ytdl(youtubeURL, { filter: 'audioonly' }).pipe(fs.createWriteStream('media/saved/' + videoCount + "-" + youtubeID + '.mp3'));
	        videoCount++;

	        messageToSend = "Saving song...";

				}
				else {

					messageToSend = "Invalid URL: Copy & paste the complete Youtube URL into this command e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"

				}
      }
      else {

        messageToSend = "Did not save song because storage is full (limit 100 videos saved)";

      }

			await interaction.reply(messageToSend)

		}

});

client.on('messageCreate', receivedMessage => {

    console.log(`received message`);
    // TODO restrict !play command to authorized users

    // TODO add command to clear queue

    // Set bot status

    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
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
          messageToSend = "SUP lols";
          break;
        case 9:
          messageToSend = "bro don't @ me";
          break;

      }

      receivedMessage.channel.send(messageToSend)

  }

});

if (process.env.DISCORDBOTID) {
      client.login(process.env.DISCORDBOTID)
}
