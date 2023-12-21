const Discord = require('discord.js');
const colors = require('colors/safe');
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('author')
        .setDescription('Mostra informações mais detalhadas sobre o criador do bot.'),
    async execute(interaction) {
        try {
            const author = await interaction.client.users.fetch('926914230924509264', { force: true });

            const repositoryOwner = 'GuikiPT';
            const repositoryName = 'TNT-Bot';

            const repoInfo = await fetchLatestCommit(repositoryOwner, repositoryName);

            const authorInfoEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL({ size: 2048, format: 'png', dynamic: true}) })
                .setColor('Orange')
                .setTitle(`GuikiPT`)
                .setThumbnail(author.displayAvatarURL({ size: 2048, format: 'png', dynamic: true}))
                .setDescription(`
                    Olá a todos! Eu sou o <@!${interaction.client.user.id}>, criado por <@!${author.id}> (${author.tag}).

                    Fui concebido para moderar o chat do canal <#1062025388064260188>.
                
                    Além disso, estou recebendo atualizações de tempos em tempos com novas funcionalidades.
                `)
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: '**Último Update ao Código Fonte**', value: `[${repoInfo.commit.message}](https://github.com/GuikiPT/TNT-Bot/commits)`},
                )
                .setImage(author.bannerURL({ size: 2048, format: 'png', dynamic: true }))
            const authorInfoEmbed2 = new Discord.EmbedBuilder()
                .setColor('Orange')
                .setImage('https://camo.githubusercontent.com/3c5f664d60e104cd9a6d718861b8ec70914b9dae0ae2c1b67f879659f64ad686/68747470733a2f2f646973636f72642e6339392e6e6c2f7769646765742f7468656d652d332f3932363931343233303932343530393236342e706e67')


            const githubRepository = new Discord.ButtonBuilder()
                .setLabel('Meu Repositorio')
                .setURL('https://github.com/GuikiPT/TNT-Bot')
                .setStyle(Discord.ButtonStyle.Link);

            const GuikiPTGithub = new Discord.ButtonBuilder()
                .setLabel('GuikiPT GitHub')
                .setURL('https://github.com/GuikiPT')
                .setStyle(Discord.ButtonStyle.Link)
            
            const GuikiPTYouTube = new Discord.ButtonBuilder()
                .setLabel('GuikiPT YouTube')
                .setURL('https://www.youtube.com/@GuikiPT')
                .setStyle(Discord.ButtonStyle.Link)

            // TODO: REMOVE FUTURE
            const GuikiPTWebsite = new Discord.ButtonBuilder()
                .setLabel('Future GuikiPT Website')
                .setURL('https://guiki.pt/')
                .setStyle(Discord.ButtonStyle.Link)

            const ButtonCompontents = new Discord.ActionRowBuilder()
                .addComponents(githubRepository, GuikiPTGithub, GuikiPTYouTube, GuikiPTWebsite);
    

            return await interaction.reply({ embeds: [authorInfoEmbed, authorInfoEmbed2], components: [ButtonCompontents] });
        }
        catch (err) {
            console.log(colors.red(err));
        }
    },
};


async function fetchLatestCommit(repoOwner, repoName) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`);
      const latestCommit = response.data[0];
      return latestCommit;
    } catch (error) {
      console.error('Error fetching latest commit:', error);
      return null;
    }
  }