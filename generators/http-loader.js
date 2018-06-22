const chalk = require('chalk');
const axios = require('axios');
const generate = require('./generator');

function postRecord (host, port, path, data) {
    return axios.post(`${host}:${port}/${path}`, data);
}

async function HTTPLoader({host, port, resourcePath, schema, amount, verbose}) {
    try {
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