const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');
const generate = require('../generator');
const express = require('express');
const cors = require('cors');
const SchemaLoader = require('../schema-loader');
const bodyParser = require('body-parser')
var app = express();

//Setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Stored records
let g_records = {};
const RECORDTYPE = {
    OBJECT: 0,
    ARRAY: 1
};

function HTTPError(status, message) {
    this.status = status;
    this.message = message;
}

HTTPError.prototype = Error.prototype;

//GET records
app.get('/', function(req, res) {
    const params = require('url').parse(req.url, true).query;
    try {
        if (Object.keys(params).length > 0) {
            const paginatedRecords = paginateRecords(params);
            if (g_records) {
                if (paginatedRecords) {
                    res.send(paginatedRecords);
                }
            } else {
                res.status(400).send('Invalid request');
            }
        } else {
            res.json(g_records);
        }
    } catch (e) {
        if (e instanceof HTTPError) { //HTTPError
            res.status(e.status).send(e.message);
        } else {
            res.status(500).send('Internal Server Error')
        }
    }
});

//Always revert to index based slice
function paginateRecords(params) {
    if (Array.isArray(g_records)) {
        let {startIndex, endIndex, page, perPage } = {...params};

        //Determine indices of page based pagination.
        if (page && perPage) {
            endIndex = params.perPage * params.page;
            startIndex = endIndex - params.perPage;
        }

        //Index based pagination
        if (startIndex >= 0 && endIndex > 0) {
            return g_records.slice(startIndex, endIndex);
        } else {
            throw new HTTPError(400, 'Bad request')
        }
    } else {
        throw new HTTPError(500, 'Internal Server Error: Cannot paginate on underlying data structure.')
    }
}

//GET record
app.get('/:id', function (req, res) {
    const id = req.params.id;

    try {
        if (g_records[id]){
            res.json(g_records[id]);
        } else {
            res.status(404).send('No record found');
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});

//POST new record
app.post('/', function (req, res) {
    if (!req.body) return res.status(400).send('No body');

    try {
        g_records[Object.keys(g_records).length] = req.body;
        res.sendStatus(201);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

async function ServeLoader({port, schema, amount, type, verbose}) {
    try {
        if (typeof(schema) !== 'object') {
            schema = SchemaLoader(schema);
        }

        //Init records object
        g_records = (type === RECORDTYPE.ARRAY) ? [] : {};

        for (let i = 0; i < amount; i++) {
            const data = await generate(schema);
            if (type === RECORDTYPE.ARRAY) {
                g_records.push(data);
            } else { //Default to object
                g_records[i] = data;
            }

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

    //Stop on enter
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', (str, key) => {
        process.exit();
    });
}

//Create a has of the routes
const

module.exports = ServeLoader;