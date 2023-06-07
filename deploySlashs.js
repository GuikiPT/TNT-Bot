const Discord = require('discord.js');
const fs = require('node:fs');
require('dotenv').config({});

const commands = [];

const commandFolders = fs.readdirSync('./commands/slashs/');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/slashs/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/slashs/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

(async () => {
    const token = process.env.DiscordToken;
    if (!token) {
        console.error('Missing Discord Token!');
        process.exit(1);
    }
    const clientId = process.env.DiscordClientId;
    if (!clientId) {
        console.error('Missing Client ID!');
        process.exit(1);
    }
    const guildId = process.env.DiscordSlashsGuildId;
    if (!guildId) {
        console.error('Missing Guild ID!');
        process.exit(1);
    }

    const rest = new Discord.REST().setToken(token);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Discord.Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
