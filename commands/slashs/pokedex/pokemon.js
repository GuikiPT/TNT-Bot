const Discord = require('discord.js');
const { fetchPokemon, fetchPokemonBySpeciesUrl, translatedPokemonTypes, firstLetterToUppercase } = require('../../../functions/functions');
var toHex = require('colornames');
const colors = require('colors/safe');

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
        try {
            return interaction.reply({ content: 'This function isn\'t working properly and get desactivated!'});

            const pokemonNameInput = await interaction.options.getString('pokemon');

            const pokemonData = await fetchPokemon(pokemonNameInput);
            if (!pokemonData) {
                return interaction.reply({ content: 'O Pokémon especificado não existe.', ephemeral: true });
            }

            const pokemonBySpeciesData = await fetchPokemonBySpeciesUrl(pokemonData.species.url);
            const pokeColor = await toHex(pokemonBySpeciesData.color || '#FFFFFF');
            const pkmnTypes = await translatedPokemonTypes(pokemonData.types.map(type => type.type.name));

            let joinedTypes;
            if (pkmnTypes.length === 1) {
                joinedTypes = pkmnTypes[0];
            } else {
                joinedTypes = pkmnTypes.join(', ');
            }

            const pokemonDataEmbed = new Discord.EmbedBuilder()
                .setColor(pokeColor ?? 'White')
                .setTitle(pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1) + ' #' + pokemonData.id)
                .setDescription(':D')
                .setThumbnail(pokemonData.sprites.front_default)
                .addFields(
                    { name: '**ID**', value: '```\n' + pokemonData.id + '\n```', inline: true },
                    { name: '**Exp Base**', value: '```\n' + pokemonData.baseExp + '\n```', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },

                )
                .addFields(
                    { name: '**Abilidades**', value: '```\n' + pokemonData.abilities.map(ability => firstLetterToUppercase(ability.ability.name)).join(', ') + '\n```', inline: true },
                    { name: '**Tipos**', value: '```\n' + joinedTypes + '\n```', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                )
                .addFields(
                    { name: '**Altura**', value: '```\n' + (pokemonData.height / 10) + 'm\n```', inline: true },
                    { name: '**Peso**', value: '```\n' + (pokemonData.weight / 10) + 'kg\n```', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                )
                .setTimestamp()

            return interaction.reply({ embeds: [pokemonDataEmbed] });


        }
        catch (err) {
            console.error(colors.red(err.stack || err));
        }

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