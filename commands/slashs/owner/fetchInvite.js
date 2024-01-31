const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('fetch-invite')
        .setDescription('Well, talvez este comando não seja para você :D')
        .addStringOption(option =>
            option.setName('invite')
                .setDescription('Link do Invite ou seu ID')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const allowedUsers = ['164800165222285313', '926914230924509264'];
            if (!allowedUsers.includes(interaction.user.id)) {
                return interaction.reply({ content: '<:trolled:1068537229976281229>' });
            }

            const argedInvite = interaction.options.getString('invite');
            interaction.client.fetchInvite(argedInvite)
                .then((invite) => {
                    const formattedInviteData = JSON.stringify(invite, null, 2);
                    return interaction.reply('```json\n' + formattedInviteData + '\n```');

                })
                .catch((error) => {
                    console.error(error.stack || error)
                    return interaction.reply('There was an error trying to fetch the invite', { ephemeral: true })
                });
        }
        catch (err) {
            console.log(colors.red(err));
        }
    },
};