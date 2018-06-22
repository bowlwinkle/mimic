const axios = require('axios');
const chalk = require('chalk');
const generate = require('./generator');

function putRecord (host, port, index, data) {
    return axios.put(`${host}:${port}/${index}/_doc/${data.id}`, data);
}

async function ESLoader({host, port, index, schema, amount, verbose}) {
    esPutVerbose = verbose;

    try {
        for (let i = 0; i < amount; i++) {
            const data = await generate(schema);
            await putRecord(host, port, index, data);

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

module.exports = ESLoader;