const fs = require('fs');
const URL = require('url-parse');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const budgetbytes = require('./parsers/budgetbytes');

const PARSERS = {
    'www.budgetbytes.com': budgetbytes.parse
}

const main = async () => {
    readline.question('what recipe url would you like to parse?\n', async (url) => {
        await PARSERS[URL(url).hostname](url)
            .then(recipe => {
                const fileName = `${recipe.title.toLowerCase().replace(/\s/g, '-')}.json`;
                const location = `recipes/${fileName}`
                fs.writeFileSync(location, JSON.stringify(recipe, null, 2));
                console.log(`Recipe wrote to ${location}`);
            })
            .catch(err => console.error('unable to parse url with error: ', err.message));

        readline.close();
    });
}

main();