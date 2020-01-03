const budgetbytes = require('./budgetbytes');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://www.budgetbytes.com/sheet-pan-pesto-chicken-dinner/';

    const result = await budgetbytes.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();