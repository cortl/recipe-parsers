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
    const ingredients = select('li')
        .map((_, element) => $(element).text()).get()
        .map(ingredient => ingredient.split(' ').filter(Boolean).join(' '))
        .map(str => str.replace(/[\t\n\r]/gm,''));
    const title = $('h1').text();
    const slug = util.createSlug(title);
    const imageUrl = $('img').map((_, element) => $(element).attr('data-lazy-src')).get()[0]
    const image = await util.downloadImage(slug, imageUrl);
    const servings = $('.mv-create-yield').text()
        .split(' ')
        .map(word => parseInt(word))
        .find(Boolean);

    const time = $('.mv-create-time').map((i, element) => {
        const label = $(element).find('.mv-create-time-label').text();
        const units = $(element).find('span.mv-time-part').text();
        return {
            label,
            units
        }
    }).get();

    return {
        title,
        servings,
        time,
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