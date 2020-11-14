const axios = require("axios");
const cheerio = require("cheerio");
const util = require('./util');

const parse = async (source, notes, rating) => {
    const $ = await axios.get(source)
        .then(res => res.data)
        .then(data => cheerio.load(data));

    const title = $('.fit-post-single-title').text().trim();
    const slug = util.createSlug(title);

    const imageUrl = $('div.fit-main').find('img')
        .map((_, element) => $(element).attr('src'))
        .get()[0];

    if (!Boolean(imageUrl)) {
        console.log(`no image for ${title} from ${source}`);
    }

    const servings = $('div.gap-bottom-small').find('h4').text().trim().split(' ')
        .map(word => parseInt(word))
        .find(Boolean);

    const time = $('div.recipe-time-info').map((_, element) => {
        const select = cheerio.load(cheerio.html($(element)));
        const label = select('span.recipe-time-label').text().trim();
        const units = select('span.macros').text().trim();
        return {
            label,
            units
        }
    }).get();

    const image = imageUrl
        ? await util.downloadImage(slug, imageUrl)
        : "";

    return {
        title,
        servings,
        time,
        slug,
        image,
        rating,
        notes: [notes],
        source: source,
        // ingredients,
        // instructions,
        createdDate: new Date().toLocaleDateString()
    };
}

module.exports = {
    parse
}