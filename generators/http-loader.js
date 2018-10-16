const fs = require('fs');
const chalk = require('chalk');
const generate = require('./generator');
const config = require('../config');
const { ConsumeFile, InitializeAuth } = require('../utils');
const axios = require('axios');

function sendRecord (host, port, path, data, method) {
	switch(method.toUpperCase()) {
		case 'POST':
			return axios.post(`${host}:${port}/${path}`, JSON.stringify(data))
		case 'PUT':
			return axios.put(`${host}:${port}/${path}`, JSON.stringify(data));

		default:
			console.error(chalk.red(`Unknown HTTP Verb: ${method.toUpperCase()}`));
			throw new Error(`Unknown HTTP Verb: ${method.toUpperCase()}`);
	}
}

async function HTTPLoader({host, port, resourcePathList, schemaList, amount, verbose, method, optionsFile}) {
	InitializeAuth(axios, config.auth);
    if (optionsFile !== undefined){
		const commandLineOptions = ConsumeFile(optionsFile);
        resourcePathList = commandLineOptions.routes;
        schemaList = commandLineOptions.schemas;
        amount = commandLineOptions.amount;
        method = commandLineOptions.httpVerb;
	}

    for (var i = 0; i < schemaList.length; i++){
        let schema = schemaList[i];
        try {
            if (typeof(schema) !== 'object') {
				schema = ConsumeFile(schema);
            }

            for (let i = 0; i < amount; i++) {
                const data = await generate(schema);

                //dynamically changing {name} attribute in REST endpoint
                let resourceArr = resourcePathList[i].split('/')
                resourceArr[2] += i
                resourcePathList[i] = resourceArr.join('/')

                await sendRecord(host, port, resourcePathList[i], data, method);
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
