const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const beautify = require('json-beautify');
const generate = require('./generator');

function writeRecord(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFileSync(file, data, e => (e) ? reject(e) : resolve());
    });
}

async function FileLoader({file, schema, amount, verbose}) {
    let record = []; //Single object

    try {
        for (let i = 0; i < amount; i++){
            const data = await generate(schema);
            record.push(data);

            if (verbose) {
                console.log(chalk.blue('Wrote') + chalk.green(JSON.stringify(data)));
            }
        }

        //Write all of the data once.
        await writeRecord(path.resolve(file), beautify(record, null, 2));
    } catch(e) {
        if (verbose) {
            console.error(`Error: ${e}`)
        } else {
            console.error(`Error occurred while generating data (run in verbose mode for details)`);
        }
    }
}

module.exports = FileLoader;