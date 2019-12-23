const axios = require("axios");
const cheerio = require("cheerio");

const parse = async (source) => {
    const $ = await axios.get(source)
    .then(res => res.data)
    .then(data => cheerio.load(data));

    const ingredients = $('.wprm-recipe-ingredient').map((_, element) =>{ 
        const select = cheerio.load(cheerio.html($(element)));
        const name = select('.wprm-recipe-ingredient-name').text();
        const unit = select('.wprm-recipe-ingredient-unit').text();
        const amount = select('.wprm-recipe-ingredient-amount').text();
        return {
            quantity: Boolean(unit) ? `${amount} ${unit}` : `${amount}`,
            name
        }
    }).get()

    const title = $('h1').text();
    console.log(JSON.stringify({
        title,
        rating: 0,
        notes: [],
        source: source,
        ingredients
    }, null, 2));
}

module.exports = {
    parse
}