const fs = require("fs");
const assert = require('assert');
const path = require('path');

const items = fs.readdirSync('recipes');

migrateToComplexIngredients = (title, ingredients) => {
    const alreadyComplex = ingredients.some(ingredient => ingredient instanceof Object);
    if (!alreadyComplex) {
        return [{
            category: 'All',
            items: ingredients
        }]
    }
    return ingredients;
}

items.forEach(item => {
    const recipe = JSON.parse(fs.readFileSync(`recipes/${item}`));
    const location = `recipes/${recipe.slug}.json`

    recipe.ingredients = migrateToComplexIngredients(recipe.title, recipe.ingredients);

    fs.writeFileSync(location, JSON.stringify(recipe, null, 2));
});