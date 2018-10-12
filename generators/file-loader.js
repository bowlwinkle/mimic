const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const beautify = require('json-beautify');
const generate = require('./generator');
const SchemaLoader = require('./schema-loader');

function writeRecord(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFileSync(file, data, e => (e) ? reject(e) : resolve());
    });
}

async function FileLoader({fileList, schemaList, amount, verbose, optionsFile}) {

    if (optionsFile !== undefined){
        const commandLineOptions = require('../' + optionsFile);
        fileList = commandLineOptions.files;
        schemaList = commandLineOptions.schemas;
        amount = commandLineOptions.amount;
    }

    var promisesArray = []
    for (var i = 0; i < schemaList.length; i++){
        var schema = schemaList[i]
        let record = []; //Single object
        try {
            if (typeof(schema) !== 'object') {
                schema = SchemaLoader(schema);
            }

            for (let i = 0; i < amount; i++){
                const data = await generate(schema);
                console.log(data)
                record.push(data);

                if (verbose) {
                    console.log(chalk.blue('Wrote') + chalk.green(JSON.stringify(data)));
                }
            }

            promisesArray.push(writeRecord(path.resolve(fileList[i]), beautify(record, null, 2)));
            //Write all of the data once.
            // await writeRecord(path.resolve(fileList[i]), beautify(record, null, 2));
        } catch(e) {
            if (verbose) {
                console.error(chalk.red(`Error: ${e}`))
            } else {
                console.error(chalk.red(`Error occurred while generating data (run in verbose mode for details)`));
            }
        }
    }
    Promise.all(promisesArray).catch(e => {
        console.error(chalk.red(`Error: ${e}`));
    })

}

module.exports = FileLoader;
