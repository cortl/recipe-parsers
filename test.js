const fs = require("fs");
const assert = require('assert');
const path = require('path');

const items = fs.readdirSync('recipes');
items.forEach(item => {
    console.log(`Testing ${item}`);
    const recipe = JSON.parse(fs.readFileSync(`recipes/${item}`));
    const {title, rating, slug, notes, source, image, instructions} = recipe;

    assert.strictEqual(typeof(title), 'string');
    assert.strictEqual(typeof(rating), 'number');
    assert.strictEqual(typeof(slug), 'string');
    assert.strictEqual(typeof(source), 'string');
    assert.strictEqual(typeof(instructions), 'object');
    assert.strictEqual(typeof(notes), 'object');

    if (image) {
        const imagePath = path.normalize(`recipes/${image}`);
        assert(fs.existsSync(imagePath));
    }
});