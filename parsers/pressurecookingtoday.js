const axios = require("axios");
const cheerio = require("cheerio");
const util = require('./util');

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
    const slug = util.createSlug(title);
    const imageUrl = $('img').map((_, element) => $(element).attr('data-lazy-src')).get()[0]
    const image = await util.downloadImage(slug, imageUrl);
    return {
        title,
        slug,
        rating,
        image,
        notes: [notes],
        source: source,
        ingredients,
        instructions,
        createdDate: new Date().toLocaleDateString()
    };
}

module.exports = {
    parse
}