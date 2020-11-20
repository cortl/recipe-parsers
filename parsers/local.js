const parser = require('./budgetbytes');

const SOURCE = 'https://www.budgetbytes.com/easy-roasted-brussels-sprouts/',
    RATING = 8.2,
    NOTES = 'test';

const main = async () => {
    const result = await parser.parse(SOURCE, NOTES, RATING);
    console.log(JSON.stringify(result, null, 2));
};

main();