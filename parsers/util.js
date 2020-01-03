const axios = require('axios');
const Path = require('path');
const fs = require('fs');

const createSlug = title => title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s/g, '-');
const downloadImage = async (slug, url) => {
    const split = url.split('.');
    const imageName = `${slug}.${split[split.length -1]}`;
    await axios({
        method: "get",
        url,
        responseType: "stream"
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream(`images/${imageName}`));
    });
    return imageName
};
module.exports = {
    createSlug,
    downloadImage
}