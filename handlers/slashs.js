const fs = require('fs');
const colors = require('colors/safe');

module.exports = async function (client, spinnies) {
    var numberOfLoadedSlashs = 0;
    spinnies.add('slashsHandler', { text: 'Loading command handler', color: 'white' });

    const commandFolders = fs.readdirSync(__dirname + '/../commands/slashs/');

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(__dirname + `/../commands/slashs/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            try{
                const command = require(__dirname + `/../commands/slashs/${folder}/${file}`);
                client.slashsCmds.set(command.data.name, command);

                numberOfLoadedSlashs++;
            }
            catch (err) {
                console.error(colors.red(err.stack || err));
            }
        }
    }
    spinnies.succeed('slashsHandler', { text: colors.green(`Loaded ${numberOfLoadedSlashs} slashs`) });
}