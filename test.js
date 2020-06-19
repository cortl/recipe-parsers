const fs = require("fs");
const assert = require('assert');
const path = require('path');

const items = fs.readdirSync('recipes');

const isAString = (thing) => assert.strictEqual(typeof (thing), 'string')
items.forEach(item => {
    console.log(`Testing ${item}`);
    const recipe = JSON.parse(fs.readFileSync(`recipes/${item}`));
    const {
        title, rating, slug, notes,
        source, image, instructions, ingredients,
        createdDate, ...unused
    } = recipe;

    assert.ok(!Object.keys(unused).length);

    assert.strictEqual(typeof (title), 'string');
    assert.strictEqual(typeof (rating), 'number');
    assert.strictEqual(typeof (slug), 'string');
    assert.strictEqual(typeof (source), 'string');

    (createdDate) && assert.ok(!isNaN(new Date(createdDate).getTime()))

    assert.ok(Array.isArray(instructions));
    instructions.forEach(isAString);

    assert.ok(Array.isArray(notes));
    notes.forEach(isAString)

    assert.ok(Array.isArray(ingredients));
    ingredients.forEach(ingredient => {
        if (ingredient instanceof Object) {
            const { category, items, ...extra } = ingredient;

            assert.ok(!Object.keys(extra).length);
            assert.strictEqual(typeof (category), 'string');
            assert.ok(Array.isArray(items));
        } else {
            isAString(ingredient)
        }
    })

    if (image) {
        const imagePath = path.normalize(`recipes/${image}`);
        assert(fs.existsSync(imagePath));
    }
});