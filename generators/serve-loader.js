const readline = require('readline');
const chalk = require('chalk');
const generate = require('./generator');
var express = require('express')
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Stored records
let records = {};

//GET records
app.get('/', function(req, res) {
    res.json(records);
});

//GET record
app.get('/:id', function (req, res) {
    let id = req.params.id;

    try {
        if (records[id]){
            res.json(records[id]);
        } else {
            res.status(404).send('No record found');
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
})

//POST new record
app.post('/', function (req, res) {
    if (!req.body) return res.status(400).send('No body');

    try {
        records[Object.keys(records).length] = req.body;
        res.sendStatus(201);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

async function ServeLoader({port, schema, amount, verbose}) {
    try {
        for (let i = 0; i < amount; i++) {
            const data = await generate(schema);
            records[i] = data;

            if (verbose) {
                console.log(chalk.blue('Added to API: ') + chalk.green(JSON.stringify(data)));
            }
        }
    } catch(e) {
        if (verbose) {
            console.error(`Error: ${e}`)
        } else {
            console.error(`Error occurred while generating data (run in verbose mode for details)`);
        }
    }

    app.listen(port, () => console.log(chalk.blue(`localhost:${port}: `) + chalk.green('Press enter key to exit...')));

    //Stop on keypress
    readline.emitKeypressEvents(process.stdin);
    // process.stdin.setRawMode(true);
    // process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
        process.exit();
    });
}

module.exports = ServeLoader;