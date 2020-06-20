const fs = require("fs");
const assert = require('assert');
const path = require('path');

const items = fs.readdirSync('recipes');

const isAString = (thing) => assert.strictEqual(typeof (thing), 'string')
items.forEach(item => {
    console.log(`📑 ${item}`);
    console.group()
    const recipe = JSON.parse(fs.readFileSync(`recipes/${item}`));
    const {
        title, rating, slug, notes,
        source, image, instructions, ingredients,
        createdDate, ...unused
    } = recipe;

    console.log('✅ exact number of fields')
    assert.ok(!Object.keys(unused).length);

    console.log('✅ title')
    assert.strictEqual(typeof (title), 'string');

    console.log('✅ rating')
    assert.strictEqual(typeof (rating), 'number');

    console.log('✅ slug')
    assert.strictEqual(typeof (slug), 'string');

    console.log('✅ source')
    assert.strictEqual(typeof (source), 'string');

    if (createdDate) {
        console.log('✅ created date');
        assert.ok(!isNaN(new Date(createdDate).getTime()))
    }

    console.log('✅ instructions')
    assert.ok(Array.isArray(instructions));
    instructions.forEach(isAString);

    console.log('✅ notes')
    assert.ok(Array.isArray(notes));
    notes.forEach(isAString)

    console.log('✅ ingredients')
    assert.ok(Array.isArray(ingredients));
    ingredients.forEach(ingredient => {
        const { category, items, ...extra } = ingredient;

        assert.ok(!Object.keys(extra).length);
        assert.strictEqual(typeof (category), 'string');
        assert.ok(Array.isArray(items));
    })

    if (image) {
        console.log('✅ image')
        const imagePath = path.normalize(`recipes/${image}`);
        assert(fs.existsSync(imagePath));
    }
    console.log('Looks 👌')
    console.groupEnd()
});