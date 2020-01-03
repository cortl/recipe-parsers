const budgetbytes = require('./pressurecookingtoday');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://www.pressurecookingtoday.com/spinach-artichoke-dip-in-the-pressure-cooker/';

    const result = await budgetbytes.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();