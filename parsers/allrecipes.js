const axios = require("axios");
const cheerio = require("cheerio");

const parse = async (source, notes, rating) => {
    const $ = await axios.get(source)
        .then(res => res.data)
        .then(data => cheerio.load(data));

    const ingredients = $('span.recipe-ingred_txt').map((_, element) => $(element).text()).get()
        .filter(Boolean)
        .filter(ingredient => !ingredient.includes('ingredients'));

    const instructions = $('.recipe-directions__list--item')
        .map((_, element) => $(element).text()).get()
        .filter(Boolean)
        .map(instruction => instruction.replace(/\n/gi, ''))
    const title = $('h1').text();
    return {
        title,
        rating,
        notes: [notes],
        source: source,
        ingredients,
        instructions
    };
}

module.exports = {
    parse
}