const parser = require('./allrecipes');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://www.allrecipes.com/recipe/14041/delicious-black-bean-burritos/';

    const result = await parser.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();