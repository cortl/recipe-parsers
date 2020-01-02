const pressurecookingtoday = require('./pressurecookingtoday');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://www.pressurecookingtoday.com/easy-pressure-cooker-pulled-pork/';

    const result = await pressurecookingtoday.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();