const budgetbytes = require('./budgetbytes');
const seriouseats = require('./seriouseats');
const allrecipes = require('./allrecipes');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://www.allrecipes.com/recipe/222599/omelet-in-a-mug/';

    const result = await allrecipes.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();