const URL = require('url-parse');
const { google } = require('googleapis');
const { authenticate } = require('./client.js');
const fs = require('fs');
const budgetbytes = require('./parsers/budgetbytes');

const PARSERS = {
    'www.budgetbytes.com': budgetbytes.parse
}
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SHEET_ID = '1KbyRcGUIBg-QxLXPuMHUaDtIZn1Uxju-zscQ-Olh3Qg';

const getParser = (url) => {
    const hostname = URL(url).hostname;
    const parser = PARSERS[hostname];
    return parser;
}

const createFileName = title => `${title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s/g, '-')}.json`;

const createRecipe = ({ url, notes, rating }) => {
    const parser = getParser(url)
    if (parser) {
        return parser(url, notes, rating)
            .then(recipe => {
                const fileName = createFileName(recipe.title);
                const location = `recipes/${fileName}`
                fs.writeFileSync(location, JSON.stringify(recipe, null, 2));
                console.log(`Recipe wrote to ${location}`);
                return recipe;
            })
            .catch(console.error);
    } else {
        console.log(`Parser does not exist for ${URL(url).hostname}`);
    };
}

const createRecipeFromSheet = client =>
    google.sheets({
        version: 'v4',
        auth: client.oAuth2Client,
    }).spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Recipes!A2:D1000',
    }).then(res => Promise.all(res.data.values.map(row => ({
        rating: row[1],
        notes: row[2],
        url: row[3]
    }))
        .filter(recipe => Boolean(recipe.rating))
        .filter(recipe => Boolean(recipe.url))
        .map(createRecipe)));

const updateMarkdown = recipes => {
    const toMarkdownLink = ({ title }) => `    - [${title}](recipes/${createFileName(title)})`;
    const template = fs.readFileSync('TEMPLATE.md');
    const write = `${template}\n${recipes.map(toMarkdownLink).join('\n')}`
    fs.writeFileSync('README.md', write);
    console.log('updated table of contents');
}

const main = () => {
    authenticate(SCOPES)
        .then(createRecipeFromSheet)
        .then(recipes => recipes.filter(Boolean))
        .then(updateMarkdown)
        .catch(console.error);
}

main();