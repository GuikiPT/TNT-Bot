const fs = require('fs');
const colors = require('colors/safe');

module.exports = async function (client) {
    const eventFolders = fs.readdirSync(__dirname + '/../events');

    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(__dirname + `/../events/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            try{
                const event = require(__dirname + `/../events/${folder}/${file}`);
                if (event.once) {
                    await client.once(event.name, (...args) => event.execute(...args));
                } else {
                    await client.on(event.name, (...args) => event.execute(...args));
                }
            }
            catch (err) {
                console.error(colors.red(err.stack || err));
            }
        }
    }
}