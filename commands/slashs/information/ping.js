const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra o ping/latência atual do bot.'),
	async execute(interaction) {
		try {
			await interaction.reply({ content: '<a:DiscordLoading:1035119091662454836>', fetchReply: true }).then(async (reply) => {
				const ping = reply.createdTimestamp - interaction.createdTimestamp;
				const pingEmbed = new Discord.EmbedBuilder()
					.setColor('Green')
					.setTitle('🧨 | Pong!')
					.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: false, size: 1024, format: 'png' }))
					.addFields(
						{ name: '**Bot Latency**', value: '```ini\n [ ' + ping + 'ms ]\n```', inline: false },
						{ name: '**API Connection Latency**', value: '```ini\n [ ' + Math.round(interaction.client.ws.ping) + 'ms ]\n```', inline: false },
						)
					.setTimestamp()
				await interaction.editReply({ content: '', embeds: [pingEmbed] });
			});
		}
		catch (err) {
			console.log(colors.red(err));
		}
	},
};