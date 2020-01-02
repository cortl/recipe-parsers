const createSlug = title => title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s/g, '-');
module.exports = {
    createSlug
}