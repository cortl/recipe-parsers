const URL = require('url-parse');
const {google} = require('googleapis');
const {GoogleAuth} = require('google-auth-library');
const fs = require('fs');

const budgetbytes = require('./parsers/budgetbytes');
const seriouseats = require('./parsers/seriouseats');
const allrecipes = require('./parsers/allrecipes');
const pressurecookingtoday = require('./parsers/pressurecookingtoday');

const PARSERS = {
    'www.budgetbytes.com': budgetbytes.parse,
    'www.seriouseats.com': seriouseats.parse,
    // 'allrecipes.com': allrecipes.parse,
    // 'www.allrecipes.com': allrecipes.parse,
    'www.pressurecookingtoday.com': pressurecookingtoday.parse
};

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SHEET_ID = '1KbyRcGUIBg-QxLXPuMHUaDtIZn1Uxju-zscQ-Olh3Qg';

let sitesNeeded = {};

const getParser = (url) => {
    const hostname = URL(url).hostname;
    const parser = PARSERS[hostname];
    return parser;
}

const createRecipe = ({url, notes, rating}) => {
    const parser = getParser(url)
    if (parser) {
        return parser(url, notes, rating)
            .then(recipe => {
                const location = `recipes/${recipe.slug}.json`
                if (fs.existsSync(location)) {
                    console.log(`file exists: ${location}`)
                    const oldRecipe = JSON.parse(fs.readFileSync(location));
                    recipe = {
                        ...oldRecipe,
                        rating,
                        notes: [notes]
                    };
                } else {
                    console.log(`recipe cached: ${location}`);
                }
                fs.writeFileSync(location, JSON.stringify(recipe, null, 2));
                return recipe;
            })
            .catch(console.error);
    } else {
        const site = URL(url).hostname;
        sitesNeeded[site] = (sitesNeeded[site] || 0) + 1;
        console.log(`Parser does not exist for ${site}`);
    };
}

const reportMissing = () => {
    Object.keys(sitesNeeded).forEach(site => {
        console.log(`Missing ${sitesNeeded[site]} total for ${site}`);
    });
}

const createRecipeFromSheet = auth =>
    google.sheets({
        version: 'v4',
        auth
    }).spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Recipes!A2:D1000',
    }).then(res => Promise.all(res.data.values.map(row => ({
        rating: parseInt(row[1], 10),
        notes: row[2],
        url: row[3]
    }))
        .filter(recipe => Boolean(recipe.rating))
        .filter(recipe => Boolean(recipe.url))
        .map(createRecipe)));

const updateMarkdown = recipes => {
    const toMarkdownLink = ({title, slug}) => `    - [${title}](recipes/${slug}.json)`;
    const template = fs.readFileSync('TEMPLATE.md');
    const write = `${template}\n${recipes.map(toMarkdownLink).join('\n')}`
    fs.writeFileSync('README.md', write);
    console.log('updated table of contents');
}

const main = () => {
    const auth = new GoogleAuth({
        scopes: SCOPES
    });
    auth.getClient()
        .then(createRecipeFromSheet)
        .then(recipes => recipes.filter(Boolean))
        .then(updateMarkdown)
        .then(reportMissing)
        .catch(console.error);
}

main();