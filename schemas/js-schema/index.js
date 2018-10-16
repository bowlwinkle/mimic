const Oracle = require('./oracle');
const Snowflake = require('./snowflake');

module.exports = {
	amount: 100,
	rootPath: "/v1/sources",
	"schema": [
		{...Oracle},
		{...Snowflake}
	]
}