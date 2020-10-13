const axios = require("axios");
const cheerio = require("cheerio");
const util = require('./util');

const getMetaInfo = ($, header) => $('.recipe-info-section').find('.recipe-meta-item')
    .map((_, element) => {
        const select = cheerio.load(cheerio.html($(element)));
        const header = select('.recipe-meta-item-header').text().trim();
        const body = select('.recipe-meta-item-body').text().trim();
        return {
            header,
            body
        }
    }).get()
    .find(section => section.header.toLowerCase().includes(header.toLowerCase()))

const parse = async (source, notes, rating) => {
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
    const servings = getMetaInfo($, 'Servings:').body;

    const time = $('.two-subcol-content-wrapper').first()
        .find('.recipe-meta-item').map((_, element) => {
            const select = cheerio.load(cheerio.html($(element)));
            const label = select('.recipe-meta-item-header').text().trim().replace(':', '');
            const units = select('.recipe-meta-item-body').text().trim();
            return {
                label,
                units
            }
        }).get();

    return {
        title,
        servings: parseInt(servings),
        time,
        slug: util.createSlug(title),
        rating,
        notes: [notes],
        source: source,
        ingredients: [{
            category: 'All',
            items: ingredients
        }],
        instructions
    };
}

module.exports = {
    parse
}