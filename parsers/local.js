const parser = require('./seriouseats');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://www.seriouseats.com/recipes/2014/02/roasted-carrot-salad-peanut-sesame-mole-recipe.html';

    const result = await parser.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();