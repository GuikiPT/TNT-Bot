const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    async execute(message) {
        try {
            if (message.author.bot) return;
            //TODO: check later
            if (message.channel.type === 1) return message.reply('Não irei responder a mensagens no privado. Por favor execute comandos em um servidor.')
            
            
            if (message.content.startsWith("# ")) {
                try {
                    const member = await message.guild.members.fetch(message.author.id);
                    if (!member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
                        try {
                            await message.author.send({ content: 'Não permitimos envio de mensagens com \`# <mensagem>\` devido a spamms.', ephemeral: true });
                        } catch (error) {
                            if (error.code === 50007) {
                                return;
                            } else {
                                console.error(colors.red('Error:', error));
                            }
                        }
                        return await message.delete();
                    } 
                } catch (error) {
                    if (error.code === 10008) {
                        return;
                    } else {
                        console.error(colors.red('Error:', error));
                    }
                }
            }
            
            

            const CounterChannelId = process.env.CounterChannelId;
            const CounterAlternativeChannelId = process.env.CounterAlternativeChannelId;
            const CounterLogChannelId = process.env.CounterLogChannelId;
            const CounterGuildId = process.env.CounterGuildId;

            const counterGuild = await message.client.guilds.cache.get(CounterGuildId);

            if (CounterGuildId) {
                if (!counterGuild) {
                    return console.warn(colors.yellow('CounterGuildId is not find in client. Ignoring counter for this case.'));
                }
                else {
                    if (message?.guild?.id !== CounterGuildId) return;

                    if (CounterChannelId) {
                        // check if channel exists
                        const counterChannel = await message.guild.channels.cache.get(CounterChannelId);
                        if (!counterChannel) {
                            return console.warn(colors.yellow('CounterChannelId is not find in guild. Ignoring counter channel for this case.'));
                        }

                        else if (message.channel.id === CounterChannelId) {
                            const member = await message.guild.members.cache.get(message.author.id);

                            var messageContent;
                            if (message.content.length <= 512) {
                                messageContent = message.content;
                            } else {
                                messageContent = message.content.substring(0, 512) + '...';
                            }

                            if (isNaN(message.content)) {
                                if (member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                                    const warnAdmAboutNumericOnlyChannelEmbed = new Discord.EmbedBuilder()
                                        .setColor('Red')
                                        .setTitle('Você mandou uma mensagem com texto no canal `' + message.channel.name + '`')
                                        .setDescription('Se você não fez propositadamente aconselho-o a eliminar a [mensagem de texto](' + message.url + ').')
                                        .addFields(
                                            { name: '***Conteúdo da sua mensagem:***', value: '```' + messageContent + '```' },
                                        )
                                        .setTimestamp()
                                    return await message.author.send({ embeds: [warnAdmAboutNumericOnlyChannelEmbed] }).catch(async () => {
                                        if (CounterLogChannelId) {
                                            const logChannel = await message.guild.channels.cache.get(CounterLogChannelId);
                                            if (!logChannel) {
                                                return console.warn(colors.yellow('CounterLogChannelId is not find in guild. Ignoring log for this case.'));
                                            }
                                            return await logChannel.send({ content: `<@${message.author.id}>`, embeds: [warnAdmAboutNumericOnlyChannelEmbed] });
                                        }
                                        else {
                                            return console.warn(colors.yellow('CounterLogChannelId is not set in .env. Ignoring log for this case.'));
                                        }
                                    });
                                }

                                // TODO: Check permissions
                                await message.delete();
                                await member.timeout(60_000);

                                const onlyNumberChannelWarnEmbed = new Discord.EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle('❌ | Apenas são aceitos números no canal do `' + message.channel.name + '` !')
                                    .setDescription('Como aviso, você foi mutado por 1 minuto.')
                                    .addFields(
                                        { name: '***Conteúdo da sua mensagem:***', value: '```' + messageContent + '```' },
                                    )
                                    .setTimestamp()
                                await message.author.send({ embeds: [onlyNumberChannelWarnEmbed] }).catch(async () => {
                                    if (CounterAlternativeChannelId) {
                                        const alternativeChannel = await message.guild.channels.cache.get(CounterAlternativeChannelId);
                                        if (!alternativeChannel) {
                                            return console.warn(colors.yellow('CounterAlternativeChannelId is not find in guild. Ignoring alternative channel for this case.'));
                                        }
                                        return await alternativeChannel.send({ content: `<@${message.author.id}>`, embeds: [onlyNumberChannelWarnEmbed] });
                                    }
                                    else {
                                        return console.warn(colors.yellow('CounterAlternativeChannelId is not set in .env. Ignoring alternative channel for this case.'));
                                    }
                                });

                                const logWarnNonNumberMessageEmbed = new Discord.EmbedBuilder()
                                    .setColor('Red')
                                    .setThumbnail(message.author.displayAvatarURL({ format: 'png', size: 2048, dynamic: 'true' }))
                                    .setTitle('❌ | `' + message.author.tag + '` foi avisado por enviar caracteres não numericos.')
                                    .setDescription('```Como consequencia de ter postado caracteres não numericos o membro levou mute de 1 minuto como aviso```')
                                    .addFields(
                                        { name: 'Texto que você enviou:', value: '```' + messageContent + '```' },
                                    )
                                    .setTimestamp()

                                if (CounterLogChannelId) {
                                    const logChannel = await message.guild.channels.cache.get(CounterLogChannelId);
                                    if (!logChannel) {
                                        return console.warn(colors.yellow('CounterLogChannelId is not find in guild. Ignoring log for this case.'));
                                    }
                                    return await logChannel.send({ content: `<@${message.author.id}>`, embeds: [logWarnNonNumberMessageEmbed] });
                                }
                                else {
                                    return console.warn(colors.yellow('CounterLogChannelId is not set in .env. Ignoring log for this case.'));
                                }
                            }
                            else {
                                message.channel.messages.fetch({ limit: 2 }).then(async messages => {
                                    let nextToLastMessageContent;

                                    if (!messages.last().content.length <= 512) {
                                        nextToLastMessageContent = messages.last().content;
                                    }
                                    else {
                                        nextToLastMessageContent = messages.last().content.substring(0, 512) + '...';
                                    }

                                    if (Number(messages.last().content) + 1 === Number(messages.first().content)) { }
                                    else {
                                        if (member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                                            // TODO: Try to delete admin author message and warn it. If the bot can't delete the message, warn adm author to delete they mistake.
                                            const admMistakeCounterEmbed = new Discord.EmbedBuilder()
                                                .setColor('Red')
                                                .setTitle('❌ | Você errou a contagem!')
                                                .setDescription('***Você deve eliminar sua [mensagem](' + message.url + ')!***\nVisto que você tambêm é administrador, é possivel eu não ter permissões para eliminar mensagens de outros administradores.\nOs administradores não conseguem eliminar mensagens uns dos outros dependendo das configurações dos cargos!')
                                                .addFields(
                                                    { name: 'Número que você enviou:', value: '```' + messageContent + '```' },
                                                    { name: 'Número que foi enviado antes da sua mensagem:', value: '```' + nextToLastMessageContent + '```' },
                                                )
                                                .setTimestamp()
                                            try {
                                                return await message.author.send({ embeds: [admMistakeCounterEmbed] }).catch(async () => {
                                                    if (CounterLogChannelId) {
                                                        const logChannel = await message.guild.channels.cache.get(CounterLogChannelId);
                                                        if (!logChannel) {
                                                            return console.warn(colors.yellow('CounterLogChannelId is not find in guild. Ignoring log for this case.'));
                                                        }
                                                        return logChannel.send({ content: `<@${message.author.id}>`, embeds: [admMistakeCounterEmbed] });
                                                    }
                                                    else {
                                                        return console.warn(colors.yellow('CounterLogChannelId is not set in .env. Ignoring log for this case.'));
                                                    }
                                                });
                                            }
                                            catch (error) {
                                                console.error(error.stack || error);
                                            }
                                        }

                                        await message.delete();
                                        await member.timeout(900_000);

                                        const sendWarnToUserEmbed = new Discord.EmbedBuilder()
                                            .setTitle('❌ | Você foi mutado por 15 minutos por ter errado a contagem numérica em `' + message.channel.name + '`')
                                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
                                            .setImage('https://media.tenor.com/NyG-ox1TuXAAAAAC/purplecliffe-cliffe.gif')
                                            .addFields(
                                                { name: 'Número que você enviou:', value: '```' + messageContent + '```' },
                                                { name: 'Número que foi enviado antes da sua mensagem:', value: '```' + nextToLastMessageContent + '```' },
                                            )
                                            .setTimestamp()
                                        await message.author.send({ embeds: [sendWarnToUserEmbed] }).catch(async () => {
                                            if (CounterAlternativeChannelId) {
                                                const alternativeChannel = await message.guild.channels.cache.get(CounterAlternativeChannelId);
                                                if (!alternativeChannel) {
                                                    return console.warn(colors.yellow('CounterAlternativeChannelId is not find in guild. Ignoring alternative channel for this case.'));
                                                }
                                                return await alternativeChannel.send({ content: `<@${message.author.id}>`, embeds: [sendWarnToUserEmbed] });
                                            }
                                            else {
                                                return console.warn(colors.yellow('CounterAlternativeChannelId is not set in .env. Ignoring alternative channel for this case.'));
                                            }
                                        });

                                        const alertChannelEmbed = new Discord.EmbedBuilder()
                                            .setTitle('❌ | Novo Membro foi mutado por 15 Minutos por errar na contagem')
                                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
                                            .setImage('https://media.tenor.com/NyG-ox1TuXAAAAAC/purplecliffe-cliffe.gif')
                                            .addFields(
                                                { name: 'Membro', value: `<@${message.author.id}> - ${message.author.tag} - ${message.author.id}` },
                                                { name: 'Número que ele enviou:', value: '```' + messageContent + '```' },
                                                { name: 'Número que foi enviado antes da mensagem dele:', value: '```' + nextToLastMessageContent + '```' },
                                            )

                                        if (CounterLogChannelId) {
                                            const logChannel = await message.guild.channels.cache.get(CounterLogChannelId);
                                            if (!logChannel) {
                                                return console.warn(colors.yellow('CounterLogChannelId is not find in guild. Ignoring log for this case.'));
                                            }
                                            return await logChannel.send({ embeds: [alertChannelEmbed] });
                                        }
                                        else {
                                            return console.warn(colors.yellow('CounterLogChannelId is not set in .env. Ignoring log for this case.'));
                                        }
                                    }
                                });
                            }
                        }
                    }
                    else {
                        console.warn(colors.yellow('CounterChannelId is not set in .env. Ignoring counter for this case.'));
                    }
                }
            }

        }
        catch (err) {
            console.error(colors.red(err.stack || err));
        }
    },
};
