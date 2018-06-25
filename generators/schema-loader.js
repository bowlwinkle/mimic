const path = require('path');
const fs = require('fs');

function schemaLoader(file) {
    //Get the absolute path to the file
    file = path.resolve(file);

    if (fs.lstatSync(file).isFile()) {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } else {
        throw new Error('Unknown schema type');
    }
}

module.exports = schemaLoader;