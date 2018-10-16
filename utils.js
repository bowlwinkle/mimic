const path = require('path');
const fs = require('fs');

function ConsumeFile(file) {
	//Get the absolute path to the file
	file = path.resolve(file);

	if (fs.lstatSync(file).isFile()) {
		const fileEXT = path.extname(file);
		if (path.extname(file) === '.js') {
			return require(file);
		} else if (fileEXT === '.json') {
			return JSON.parse(fs.readFileSync(file, 'utf8'));
		} else {
			throw new Error("Unknown file type: use .js or .json");
		}
	} else {
		throw new Error('Unknown file type: use .js or .json');
	}
}

function InitializeAuth(axios, auth) {
	if (auth && Object.keys(auth).length > 0) {
		switch (auth.type) {
			case "BASIC":
				axios.defaults.headers.common['Authorization'] = "Basic " + btoa(auth.username + ":" + auth.password)
			case "JWT":
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.token;
		}

		return axios;
	}
}

module.exports = { ConsumeFile, InitializeAuth }