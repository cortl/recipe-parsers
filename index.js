const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const budgetbytes = require('./parsers/budgetbytes');

const main = async () => {
    readline.question('what recipe url would you like to parse?\n', (url) => {
        budgetbytes.parse(url).catch(err => console.error('unable to parse url with error: ', err.message));
        readline.close();
    });
}

main();