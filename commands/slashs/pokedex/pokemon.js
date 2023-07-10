const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Give information about a pokémon')
        .addStringOption(option =>
            option.setName('pokemon')
                .setDescription('Name or dex id of the pokémon')
                .setRequired(true)
        ),
    async execute(interaction) {
        return interaction.reply({ content: 'This command is not available yet', ephemeral: true });

        // TODO: Manually create a wrap for pokeapi.co
        // The pokedex-promise-v2 is not working properly

    //     try {
    //         const pokemon = interaction.options.getString('pokemon');
    //         const P = new Pokedex();
    //         const pokeData = P.getPokemonByName(pokemon.toLowerCase());

    //         // if pokemon undefined
    //         if (!pokeData.name) return await interaction.reply({ content: 'Pokémon not found', ephemeral: true });
            

    //         const pokeSpecieData = await P.getPokemonSpeciesByName(pokemon);
    //         const pokeColor = await toHex(pokeSpecieData.color.name);

    //         const englishFlavorTexts = pokeSpecieData.flavor_text_entries.filter(entry => entry.language.name === 'en');
    //         const randomEnglishFlavorText = englishFlavorTexts[Math.floor(Math.random() * englishFlavorTexts.length)].flavor_text.replace(/(\r\n|\n|\r)/gm, " ");

    //         const pokemonEmbed = new Discord.EmbedBuilder()
    //             .setTitle(pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1))
    //             // check why sprites of gen viii are not working
    //             // .setThumbnail(pokeData.sprites.versions['generation-viii'].icons.front_default.toString())
    //             .setColor(pokeColor ?? 'White')
    //             .setDescription(randomEnglishFlavorText)

    //             //TODO: add Fields Info/Data
    //             .setTimestamp()

    //         return await interaction.reply({ embeds: [pokemonEmbed] });
    //     }
    //     catch (err) {
    //         console.log(colors.red(err));
    //     }
    },
};