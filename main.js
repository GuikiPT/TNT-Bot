const Discord = require('discord.js');
const colors = require('colors/safe');
require('dotenv').config({});

module.exports = async function (spinnies) {
    const client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.AutoModerationConfiguration,
            Discord.GatewayIntentBits.AutoModerationExecution,
            Discord.GatewayIntentBits.DirectMessageReactions,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.GuildEmojisAndStickers,
            Discord.GatewayIntentBits.GuildIntegrations,
            Discord.GatewayIntentBits.GuildInvites,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildMessageReactions,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildModeration,
            Discord.GatewayIntentBits.GuildPresences,
            Discord.GatewayIntentBits.GuildScheduledEvents,
            Discord.GatewayIntentBits.GuildVoiceStates,
            Discord.GatewayIntentBits.GuildWebhooks,
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.MessageContent,
        ],
        partials: [
            Discord.Partials.Channel,
            Discord.Partials.GuildMember,
            Discord.Partials.GuildScheduledEvent,
            Discord.Partials.Message,
            Discord.Partials.Reaction,
            Discord.Partials.ThreadMember,
            Discord.Partials.User,
        ],
    });

    (async function () {
        try {
            const handlers = ['events'];

            for (const handler of handlers) {
                await require(`./handlers/${handler}`)(client, spinnies);
            }
        }
        catch (err) {
            console.error(colors.red(err.stack || err));
        }
    })();

    (async function () {
        try {
            const DiscordToken = process.env.DiscordToken;

            if (!DiscordToken) {
                spinnies.fail('startingBot', { text: colors.red('Discord Token is not defined or passed correctly! Please check your .env file and try again.\n') });
                process.exit(1);
            } else {
                await client.login(DiscordToken);
            }
        } catch (err) {
            console.error(colors.red(err.stack || err));
        }
    })();
};