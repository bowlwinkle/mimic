#! /usr/bin/env node
const ESLoader = require('./generators/es-loader');
const HTTPLoader = require('./generators/http-loader');
const FileLoader = require('./generators/file-loader');
const ServeLoader = require('./generators/serve-loader');
const { esOptions, httpOptions, fileOptions, serveOptions } = require('./options');

require('yargs')
    .command({
        command: 'load',
        desc: 'loads elasticsearch instance with data defined by provided schema',
        builder: esOptions,
        handler: argv => loadSchema({ schema: argv.s })
    })
    .command({
        command: 'es',
        desc: 'loads elasticsearch instance with data defined by provided schema',
        builder: esOptions,
        handler: argv => ESLoader({ host: argv.h, port: argv.p, index: argv.i, schema: argv.s, amount: argv.a, verbose: argv.v })
    })
    .command({
        command: 'http',
        desc: 'Posts generated data to provided resource path',
        builder: httpOptions,
        handler: argv => HTTPLoader({ host: argv.h, port: argv.p, resourcePath: argv.r, schema: argv.s, amount: argv.a, verbose: argv.v })
    })
    .command({
        command: 'file',
        desc: 'Writes generated data to provided file path',
        builder: fileOptions,
        handler: argv => FileLoader({ file: argv.f, schema: argv.s, amount: argv.a, verbose: argv.v })
    })
    .command({
        command: 'serve',
        desc: 'Serves generated data; incremental index 0...n.  New entries can be posted',
        builder: serveOptions,
        handler: argv => ServeLoader({ port: argv.p, schema: argv.s, amount: argv.a, verbose: argv.v })
    })
    .demandCommand(1, 'You must provide a command')
    .help()
    .argv;

//Read the file provided; write the file contents into schema.js
function loadSchema(schema) {

}