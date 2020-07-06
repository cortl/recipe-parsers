const axios = require("axios");
const cheerio = require("cheerio");
const util = require('./util');

const parse = async (source, notes, rating) => {
    const $ = await axios.get(source)
        .then(res => res.data)
        .then(data => cheerio.load(data));

    const ingredients = $('.ingredient').map((_, element) => $(element).text()).get()
    const instructions = $('.recipe-procedure-text')
        .map((_, element) => $(element).text()).get()
        .map(instruction => instruction.replace(/\n/gi, ''))
        .map(instruction => instruction.replace(/\s{2,}/gi, ''));
    const title = $('.recipe-title').text();
    const slug = util.createSlug(title);

    const imageUrl = $('.photo').attr('src');
    const image = imageUrl
        ? await util.downloadImage(slug, imageUrl)
        : "";

    return {
        title,
        slug: util.createSlug(title),
        image,
        rating,
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