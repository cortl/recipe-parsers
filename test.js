const fs = require("fs");
const assert = require('assert');
const path = require('path');

const fieldIsA = (name, field, type) => {
    assert.strictEqual(typeof (field), type, `❌ ${name} isn\'t a ${type}`)
    console.log(`✅ ${name}`)
};
const fieldIsAnArray = (name, field) => {
    assert.ok(Array.isArray(field), `❌ ${name} is not an array`);
    field.forEach(isAString);
    console.log(`✅ ${name}`)
}
const isAString = (field) => assert.strictEqual(typeof (field), 'string')

const items = fs.readdirSync('recipes');
items.forEach(item => {
    console.log(`📑 ${item}`);
    console.group()
    try {
        const recipe = JSON.parse(fs.readFileSync(`recipes/${item}`));
        const {
            title, rating, slug, notes,
            source, image, instructions, ingredients,
            createdDate, ...unused
        } = recipe;

        assert.ok(!Object.keys(unused).length, '❌ extra fields found in JSON');
        console.log('✅ exact number of fields')

        fieldIsA('title', title, 'string');
        fieldIsA('rating', rating, 'number');
        fieldIsA('slug', slug, 'string');
        fieldIsA('source', source, 'string');

        if (createdDate) {
            assert.ok(!isNaN(new Date(createdDate).getTime()), '❌ created date is not a date')
            console.log('✅ created date');
        }

        fieldIsAnArray('instructions', instructions)
        fieldIsAnArray('notes', instructions)

        assert.ok(Array.isArray(ingredients), '❌ ingredients is not an array');
        ingredients.forEach(ingredient => {
            const { category, items, ...extra } = ingredient;

            assert.ok(!Object.keys(extra).length, '❌ extra fields underneath ingredients');
            assert.strictEqual(typeof (category), 'string', '❌ category is not a string');
            assert.ok(Array.isArray(items), '❌ items is not an array');
        })
        console.log('✅ ingredients')

        if (image) {
            const imagePath = path.normalize(`recipes/${image}`);
            assert(fs.existsSync(imagePath), '❌ image path is not correct');
            console.log('✅ image')
        }
        console.log('Looks 👌')
    } catch (err) {
        console.error(err);
        assert.fail('❌ failed to test')
    } finally {
        console.groupEnd()
    }
});