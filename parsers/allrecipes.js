const axios = require("axios");
const cheerio = require("cheerio");
const util = require('./util');

const parse = async (source, notes, rating) => {
    console.log(source)
    const $ = await axios.get(source)
        .then(res => res.data)
        .then(data => cheerio.load(data));

    const ingredients = $('span.ingredients-item-name')
        .map((_, element) => $(element).text()).get()
        .map(ingredient => ingredient.trim())

    const instructions = $('li.instructions-section-item')
        .map((_, element) => {
            const select = cheerio.load(cheerio.html($(element)))
            return select('.paragraph').text();
        }).get()
        .map(instruction => instruction.trim())

    const title = $('h1.headline').text();
    const servings = $('.recipe-info-section').find('.recipe-meta-item')
        .map((_, element) => {
            const select = cheerio.load(cheerio.html($(element)));
            const header = select('.recipe-meta-item-header').text().trim();
            const body = select('.recipe-meta-item-body').text().trim();
            return {
                header,
                body
            }
        }).get()
        .find(section => section.header.includes('Servings:')).body;

    return {
        title,
        servings: parseInt(servings),
        slug: util.createSlug(title),
        rating,
        notes: [notes],
        source: source,
        ingredients: {
            category: 'All',
            items: ingredients
        },
        instructions
    };
}

module.exports = {
    parse
}