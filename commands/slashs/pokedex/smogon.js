const Discord = require('discord.js');
const colors = require('colors/safe');
const fetch = require('node-fetch');
const axios = require('axios');
var toHex = require('colornames')

const { Dex } = require('@pkmn/dex');
const { Generations } = require('@pkmn/data');
const { Smogon } = require('@pkmn/smogon');
const gens = new Generations(Dex);
const smogon = new Smogon(fetch);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('smogon')
        .setDescription('Smogon API')
        .addIntegerOption(option =>
            option.setName('generation')
                .setDescription('O número da geração (e.g., 8 para a geração 8)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('pokemon')
                .setDescription('O nome do Pokémon')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const generationInput = interaction.options.getInteger('generation');
            const pokemonNameInput = interaction.options.getString('pokemon');

            if (generationInput >= 10) {
                return interaction.reply({ content: 'Essa geração é inválida. Por favor, forneça uma geração válida entre `1 <=> 9` !', ephemeral: true });
            }

            const generationData = gens.get(generationInput);
            if (!generationData) {
                return interaction.reply('A geração especificada não é suportada. Por favor, forneça uma geração entre 1 e 9.');
            }

            const pokemonData = await fetchPokemonInfo(pokemonNameInput);
            if (!pokemonData) {
                return interaction.reply({ content: 'O Pokémon especificado não existe.', ephemeral: true });
            }

            const pokemonExistsGeneration = await checkPokemonExistsInGeneration(pokemonNameInput, generationInput);
            if (!pokemonExistsGeneration) {
                return interaction.reply({ content: 'Esse Pokémon não existe nessa geração `' + generationInput + '`.', ephemeral: true });
            }


            const dataMovesets = await smogon.sets(gens.get(generationInput), pokemonNameInput.toLowerCase());
            const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonNameInput.toLowerCase()}`);
            const pokeColor = await toHex(speciesResponse.data.color.name);


            const pokemonEmbedToCollect = new Discord.EmbedBuilder()
                .setColor(pokeColor ?? 'White')
                .setTitle(dataMovesets[0].species + ' #' + pokemonData.id)
                .setThumbnail(pokemonData.spriteUrl)
                .addFields(
                    { name: '**Nome do Moveset**', value: '```' + (dataMovesets[0].name ? dataMovesets[0].name : 'Sem Informação') + '```' },
                    { name: '**Species**', value: '```' + (dataMovesets[0].species ? dataMovesets[0].species : 'Sem Informação') + '```', inline: true },
                    { name: '**Level**', value: '```' + (dataMovesets[0].level ? dataMovesets[0].level : 'Sem Informação') + '```', inline: true },
                    { name: '**Item**', value: '```' + (dataMovesets[0].item ? dataMovesets[0].item : 'Sem Informação') + '```', inline: false },
                    { name: '**Ability**', value: '```' + (dataMovesets[0].ability ? dataMovesets[0].ability : 'Sem Informação') + '```', inline: true },
                    { name: '**Natures**', value: '```' + (dataMovesets[0].nature ? dataMovesets[0].nature : 'Sem Informação') + '```', inline: true },
                    { name: '**Ivs**', value: '```' + (dataMovesets[0].ivs && Object.keys(dataMovesets[0].ivs).length > 0 ? formatJsonToText(dataMovesets[0].ivs) : 'Sem Informação') + '```', inline: false },
                    { name: '**Evs**', value: '```' + (dataMovesets[0].evs && Object.keys(dataMovesets[0].evs).length > 0 ? formatJsonToText(dataMovesets[0].evs) : 'Sem Informação') + '```', inline: false },
                    { name: '**Moves**', value: '```' + (dataMovesets[0].moves && Object.keys(dataMovesets[0].moves).length > 0 ? formatJsonToText(dataMovesets[0].moves) : 'Sem Informação') + '```', inline: false },
                    { name: '**GigantaMax**', value: '```' + (dataMovesets[0].gigantaMax ? '✅' : '❌') + '```', inline: false },
                    { name: '**TeraType**', value: '```' + (dataMovesets[0].teraType ? dataMovesets[0].teraType : 'Sem Informação') + '```', inline: false }
                )
                .setTimestamp()
            return await interaction.reply({ embeds: [pokemonEmbedToCollect] });

        }
        catch (err) {
            console.log(colors.red(err));
        }
    },
};
function formatJsonToText(input) {
    let text = '';

    for (const key in input) {
        text += `${key.toUpperCase()}: ${input[key]}\n`;
    }

    return text;
}

async function checkPokemonExistsInGeneration(pokemonName, generationNumber) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`);
        const generationData = response.data.generation;
        const generationUrl = generationData.url;
        const generationNumberRegex = /\/(\d+)\/$/;
        const match = generationUrl.match(generationNumberRegex);
        if (match && parseInt(match[1]) === generationNumber) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log('Ocorreu um erro:', error.message);
        return false;
    }
}

async function fetchPokemonInfo(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);

        const pokemon = response.data;
        const name = pokemon.name;
        const id = pokemon.id;
        const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');
        const types = pokemon.types.map(type => type.type.name).join(', ');
        const spriteUrl = pokemon.sprites.front_default;

        return {
            name,
            id,
            abilities,
            types,
            spriteUrl
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`${pokemonName} não existe.`);
            return false;
        }
        console.log('Error occurred:', error.message);
        throw error;
    }
}