const parser = require('./fitmencook');

const main = async () => {
    const rating = 8.2, notes = 'test';
    const source = 'https://fitmencook.com/beef-pepper-steak/';

    const result = await parser.parse(source, notes, rating);
    console.log(JSON.stringify(result, null, 2));
};

main();