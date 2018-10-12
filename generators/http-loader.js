const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const generate = require('./generator');
const SchemaLoader = require('./schema-loader');
const config = require('../config');

function postRecord (host, port, path, data, method) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.token
    if (method.toLowerCase() === 'put'){
        return axios.put(`${host}:${port}/${path}`, JSON.stringify(data));
    }
    return axios.post(`${host}:${port}/${path}`, JSON.stringify(data))
}

async function HTTPLoader({host, port, resourcePathList, schemaList, amount, verbose, method, optionsFile}) {
    if (optionsFile !== undefined){
        const commandLineOptions = require('../' + optionsFile);
        resourcePathList = commandLineOptions.routes;
        schemaList = commandLineOptions.schemas;
        amount = commandLineOptions.amount;
        method = commandLineOptions.httpVerb;
    }
    for (var i = 0; i < schemaList.length; i++){
        let schema = schemaList[i];
        try {
            if (typeof(schema) !== 'object') {
                schema = SchemaLoader(schema);
            }


            for (let i = 0; i < amount; i++) {
                const data = await generate(schema);

                //dynamically changing {name} attribute in REST endpoint
                let resourceArr = resourcePathList[i].split('/')
                resourceArr[2] += i
                resourcePathList[i] = resourceArr.join('/')

                await postRecord(host, port, resourcePathList[i], data, method);
                if (verbose) {
                    console.log(chalk.blue('Wrote') + chalk.green(JSON.stringify(data)));
                }
            }
        } catch(e) {
            if (verbose) {
                console.error(chalk.red('Error: ' + e));
            } else {
                console.error(chalk.red(`Error occurred while generating data (run in verbose mode for details)`));
            }
        }
    }
}

module.exports = HTTPLoader;
