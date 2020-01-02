const axios = require("axios");
const cheerio = require("cheerio");

const parse = async (source, notes, rating) => {
    const $ = await axios.get(source)
        .then(res => res.data)
        .then(data => cheerio.load(data));

    let select;
    const instructionBlock = $('.mv-create-instructions');
    select = cheerio.load(cheerio.html($(instructionBlock)));
    const instructions = select('li').map((_, element) => $(element).text()).get();

    const ingredientBlock = $('.mv-create-ingredients');
    select = cheerio.load(cheerio.html($(ingredientBlock)));
    const ingredients = select('li').map((_, element) => $(element).text()).get()
        .map(ingredient => ingredient.split(' ').filter(Boolean).join(' '));

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