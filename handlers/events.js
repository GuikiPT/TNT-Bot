const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors/safe');

module.exports = async function (client, spinnies) {
    // TODO: Number of Load events in spinnies, upgrade the code bellow.
    var numberOfLoadedEvents = 0;
    spinnies.add('eventHandler', { text: 'Loading event handler', color: 'white' });

    const eventFolders = fs.readdirSync(__dirname + '/../events');

    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(__dirname + `/../events/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            try{
                const event = require(__dirname + `/../events/${folder}/${file}`);
                if (event.once) {
                    if(event.name === Discord.Events.ClientReady) {
                        await client.once(event.name, (...args) => event.execute(...args, spinnies));
                    }
                    else {
                        await client.once(event.name, (...args) => event.execute(...args));
                    }
                } else {
                    await client.on(event.name, (...args) => event.execute(...args));
                }
                numberOfLoadedEvents++;
            }
            catch (err) {
                console.error(colors.red(err.stack || err));
            }
        }
        spinnies.succeed('eventHandler', { text: colors.green(`Loaded ${numberOfLoadedEvents} events`) });
    }
}