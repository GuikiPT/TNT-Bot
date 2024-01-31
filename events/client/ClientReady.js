const Discord = require("discord.js");
const colors = require("colors/safe");

module.exports = {
  name: Discord.Events.ClientReady,
  once: true,
  async execute(client, spinnies) {
    spinnies.succeed("startingBot", {
      text: colors.green(`Logged in as ${client.user.tag}!`),
    });

    try {
      await client.user.setPresence({
        activities: [
          {
            name: ":D",
            type: Discord.ActivityType.Watching,
          },
        ],
        status: "idle",
      });
    } catch (err) {
      console.error(colors.red(err.stack || err));
    }
  },
};
