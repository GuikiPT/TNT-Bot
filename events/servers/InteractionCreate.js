const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = await interaction.client.slashsCmds.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(colors.red(error.stack || error));
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
        else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashsCmds.get(interaction.commandName);
    
            if (!command) return;
    
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(colors.red(error.stack || error));
            }
        }
    },
};