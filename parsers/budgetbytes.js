const axios = require("axios");
const cheerio = require("cheerio");
const util = require('./util');

const parse = async (source, notes, rating) => {
    const $ = await axios.get(source)
        .then(res => res.data)
        .then(data => cheerio.load(data));

    const ingredients = $('.wprm-recipe-ingredient').map((_, element) => {
        const select = cheerio.load(cheerio.html($(element)));

        const name = select('.wprm-recipe-ingredient-name').text();
        const unit = select('.wprm-recipe-ingredient-unit').text();
        const amount = select('.wprm-recipe-ingredient-amount').text();
        const measurement = Boolean(unit) ? `${amount} ${unit}` : `${amount}`;

        return `${measurement} ${name}`
    }).get()
    const instructions = $('.wprm-recipe-instruction-text').map((_, element) => $(element).text()).get();
    const title = $('h1').text();
    return {
        title,
        slug: util.createSlug(title),
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