const axios = require("axios");
const cheerio = require("cheerio");

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