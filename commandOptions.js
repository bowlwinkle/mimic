module.exports = {
    amount: 100,
    routes: ['v1/sources/mockData/snowflake-jdbc-config'],
    files: ['output/snowflake.txt']
    httpVerb: 'PUT',
    schemas: ['schemas/snowflakeSource.js']
}
