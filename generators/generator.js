const jsf = require('json-schema-faker');

//Setup faker.js
jsf.extend('faker', function() {
    return require('faker');
});

function generate(schema) {
    return jsf.resolve(schema);
}

module.exports = generate;