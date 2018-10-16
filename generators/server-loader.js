const readline = require('readline');
const chalk = require('chalk');
const generate = require('./generator');
const express = require('express');
const cors = require('cors');
const { ConsumeFile } = require('../utils');
const bodyParser = require('body-parser')

function HTTPError(status, message) {
	this.status = status;
	this.message = message;
}

HTTPError.prototype = Error.prototype;

const STORAGETYPE = {
	OBJECT: 0,
	ARRAY: 1
};

//Currently no custom paths; just standard verbs
class MDRoute {
	constructor(expressServer, route, schema, amount, watchInitialization, storageType = STORAGETYPE.ARRAY, verboseLogging = false) {
		this.storageType = storageType;
		this.records = (storageType === STORAGETYPE.ARRAY) ? [] : {};
		this.verbose = verboseLogging;
		this.route = route;

		const initializer = this.generateData(schema, amount);
		if (watchInitialization)
			watchInitialization(initializer);
		this.initRoutes(expressServer, route);
	}

	generateData(schema, amount) {
		return new Promise(async (resolve, reject) => {
			try {
				for (let i = 0; i < amount; i++) {
					let data = undefined;
					if (Array.isArray(schema)) {
						data = await generate(schema[Math.floor(Math.random() * (schema.length - 0) + 0)]);
					} else {
						data = await generate(schema);
					}

					if (this.storageType === STORAGETYPE.ARRAY) {
						this.records.push(data);
					} else { //Default to object
						this.records[i] = data;
					}

					if (this.verbose) {
						console.log(chalk.blue('Added to API: ') + chalk.green(JSON.stringify(data)));
					}
				}
				resolve();
			} catch (e) {
				if (this.verbose) {
					console.error(`Error: ${e}`)
				} else {
					console.error(`Error occurred while generating data (run in verbose mode for details)`);
				}
				reject(e);
			}
		});
	}

	initRoutes(app, route){
		const self = this;
		app.get(route, (req, res) => {
			return this.getData(req, res, self)
		});
		app.put(route, (req, res) => {
			return this.putData(req, res, self)
		});
		app.post(route, (req, res) => {
			this.postData(req, res, self);
		});
	}

	paginateRecords(params) {
		if (this.storageType === STORAGETYPE.ARRAY) {
			let { startIndex, endIndex, page, perPage } = { ...params };

			//Determine indices of page based pagination.
			if (page && perPage) {
				endIndex = params.perPage * params.page;
				startIndex = endIndex - params.perPage;
			}

			//Index based pagination
			if (startIndex >= 0 && endIndex > 0) {
				return this.records.slice(startIndex, endIndex);
			} else {
				throw new HTTPError(400, 'Bad request')
			}
		} else {
			throw new HTTPError(500, 'Internal Server Error: Cannot paginate on underlying data structure. Must be type Array.')
		}
	}

	getData(req, res, self) {
		const params = require('url').parse(req.url, true).query;
		try {
			if (Object.keys(params).length > 0) {
				const paginatedRecords = self.paginateRecords(params);
				if (paginatedRecords) {
					res.send(paginatedRecords);
				} else {
					res.status(400).send('Invalid request');
				}
			} else {
				res.json(self.records);
			}
		} catch(e) {
			if (e instanceof HTTPError) { //HTTPError
				res.status(e.status).send(e.message);
			} else {
				res.status(500).send('Internal Server Error')
			}
		}
	}

	putData(req, res) {
		if (!req.body) return res.status(400).send('No body');

		try {
			//Works for array and hash
			this.records[Object.keys(this.records).length] = req.body;
			res.status(201).send('PUT works as a post; this does NOT find an existing entry and replaces');
		} catch (e) {
			res.status(500).send(e.message);
		}
	}

	postData(req, res) {
		if (!req.body) return res.status(400).send('No body');

		try {
			//Works for array and hash
			this.records[Object.keys(this.records).length] = req.body;
			res.sendStatus(201);
		} catch (e) {
			res.status(500).send(e.message);
		}
	}
}

class MDServer {
	constructor(port, schema, initialized) {
		this.routes = [];
		this.port = port;
		this.app = express();
		this.initializedCB = initialized;

		//Setup server
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		this.app.use(cors());

		if (typeof (schema) !== 'object') {
			this.schema = ConsumeFile(schema);
		}

		const loadingPromises = this.constructRoutes(this.schema);
		Promise.all(loadingPromises).then(() => {
			this.start();
		});
	}

	constructRoutes(schema) {
		try {
			const loadingPromises = [];
			if (Array.isArray(schema)) {
				for (let i = 0; i < schema.length; i++) {
					//TODO: Add the passed type to the new route construction.
					this.routes.push(new MDRoute(this.app, schema[i].rootPath, schema[i].schema, schema[i].amount, (initializer) => {
						loadingPromises.push(initializer);
					}));
				}
			} else {
				this.routes.push(new MDRoute(this.app, schema.rootPath, schema.schema, schema.amount, (initializer) => {
					loadingPromises.push(initializer);
				}));
			}

			return loadingPromises;
		} catch(e) {
			console.error(`Error loading schema (check if valid file format): ${e}`)
		}
	}

	start() {
		this.server = this.app.listen(this.port, () => {
			for (let i = 0; i < this.routes.length; i++) {
				console.log(chalk.magenta(`localhost:${this.port}${this.routes[i].route} `));
			}

			if (this.initializedCB)
				this.initializedCB();
		});
	}

	stop() {
		if (this.server)
			this.server.close();
	}
}

async function ServeLoader({ port, schema, amount, type, verbose }) {
	try {
		const server = new MDServer(port, schema, () => {
			console.log(chalk.cyan(`localhost:${port}: `) + chalk.green('Press enter key to exit...'))
		});

		//Stop on enter
		readline.emitKeypressEvents(process.stdin);
		process.stdin.on('keypress', (str, key) => {
			server.stop();
			process.exit();
		});
	} catch (e) {
		if (verbose) {
			console.error(`Error: ${e}`)
		} else {
			console.error(`Error occurred while generating data (run in verbose mode for details)`);
		}
	}
}

module.exports = ServeLoader;