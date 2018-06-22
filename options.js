const config = require('./config');

function esOptions (yargs) {
    return yargs
        .option('h', {
            alias: 'host',
            demandOption: false,
            default: config.elasticHost,
            describe: 'ElasticSearch URL'
        })
        .option('p', {
            alias: 'port',
            demandOption: false,
            default: config.port,
            describe: 'The port to run the auth code server on'
        })
        .option('i', {
            alias: 'index',
            demandOption: false,
            default: config.index,
            describe: 'Index to PUT records',
        })
        .option('s', {
            alias: 'schema',
            demandOption: false,
            default: config.exampleSchema,
            describe: 'Schema to use for generating data'
        })
        .option('a', {
            alias: 'amount',
            demandOption: false,
            default: config.amount,
            describe: 'Amount of records to generator'
        })
        .option('v', {
            alias: 'verbose',
            demandOption: false,
            default: false,
            describe: 'Verbose mode'
        });
}

function httpOptions (yargs) {
    return yargs
        .option('h', {
            alias: 'host',
            demandOption: false,
            default: config.elasticHost,
            describe: 'ElasticSearch URL'
        })
        .option('p', {
            alias: 'port',
            demandOption: false,
            default: config.port,
            describe: 'The port to run the auth code server on'
        })
        .option('p', {
            alias: 'path',
            demandOption: false,
            default: config.path,
            describe: 'Path to POST records',
        })
        .option('s', {
            alias: 'schema',
            demandOption: false,
            default: config.exampleSchema,
            describe: 'Schema to use for generating data'
        })
        .option('a', {
            alias: 'amount',
            demandOption: false,
            default: config.amount,
            describe: 'Amount of records to generator'
        })
        .option('v', {
            alias: 'verbose',
            demandOption: false,
            default: false,
            describe: 'Verbose mode'
        });
}

function fileOptions (yargs) {
    return yargs
        .option('f', {
            alias: 'file',
            demandOption: false,
            default: config.elasticHost,
            describe: 'File path to write generated data'
        })
        .option('s', {
            alias: 'schema',
            demandOption: false,
            default: config.exampleSchema,
            describe: 'Schema to use for generating data'
        })
        .option('a', {
            alias: 'amount',
            demandOption: false,
            default: config.amount,
            describe: 'Amount of records to generator'
        })
        .option('v', {
            alias: 'verbose',
            demandOption: false,
            default: false,
            describe: 'Verbose mode'
        });
}

function serveOptions (yargs) {
    return yargs
        .option('p', {
            alias: 'port',
            demandOption: false,
            default: config.port,
            describe: 'The port to run the auth code server on'
        })
        .option('s', {
            alias: 'schema',
            demandOption: false,
            default: config.exampleSchema,
            describe: 'Schema to use for generating data'
        })
        .option('a', {
            alias: 'amount',
            demandOption: false,
            default: config.amount,
            describe: 'Amount of records to generator'
        })
        .option('v', {
            alias: 'verbose',
            demandOption: false,
            default: false,
            describe: 'Verbose mode'
        });
}

module.exports = {
    esOptions,
    httpOptions,
    fileOptions,
    serveOptions
};