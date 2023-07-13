const axios = require('axios');

module.exports = {
    fetchPokemon: async function (pokemonName) {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);

            const pokemon = response.data;
            const name = pokemon.name;
            const id = pokemon.id;
            const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');
            const types = pokemon.types.map(type => type.type.name).join(', ');
            const spriteUrl = pokemon.sprites.front_default;
            const speciesUrl = pokemon.species.url;

            return {
                name,
                id,
                abilities,
                types,
                spriteUrl,
                speciesUrl,
            };
        }
        catch (error) {
            console.error(error);
        }
    },

    formatJsonToText: async function (input) {
        let text = '';
    
        for (const key in input) {
            let formattedKey = key;
            if (!isNaN(key)) {
                formattedKey = (+key + 1).toString();
            }
            text += `${formattedKey.toUpperCase()} - ${input[key]}\n`;
        }
    
        return text;
    }

}