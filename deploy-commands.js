const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
		new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
		new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
		new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
		new SlashCommandBuilder().setName('read').setDescription('Reads text and turns it into speech.')
			.addStringOption(option => 
				option.setName('text')
					.setDescription('Enter some text')
					.setRequired(true)),
		new SlashCommandBuilder().setName('play').setDescription('Plays audio from a Youtube video')
                        .addStringOption(option => 
				option.setName('youtubeurl')
					.setDescription('Enter a full Youtube URL')
					.setRequired(true)),
		new SlashCommandBuilder().setName('save').setDescription('Reads text and turns it into speech.')
	                .addStringOption(option => 
				option.setName('youtubeurl')
					.setDescription('Enter a full Youtube URL')
					.setRequired(true))
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

