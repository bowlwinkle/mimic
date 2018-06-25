const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const generate = require('./generator');
const SchemaLoader = require('./schema-loader');

function postRecord (host, port, path, data) {
    return axios.post(`${host}:${port}/${path}`, data);
}

async function HTTPLoader({host, port, resourcePath, schema, amount, verbose}) {
    try {
        if (typeof(schema) !== 'object') {
            schema = SchemaLoader(schema);
        }

        for (let i = 0; i < amount; i++) {
            const data = await generate(schema);
            await postRecord(host, port, resourcePath, data);

            if (verbose) {
                console.log(chalk.blue('Wrote') + chalk.green(JSON.stringify(data)));
            }
        }
    } catch(e) {
        if (verbose) {
            console.error(`Error: ${e}`)
        } else {
            console.error(`Error occurred while generating data (run in verbose mode for details)`);
        }
    }
}

module.exports = HTTPLoader;