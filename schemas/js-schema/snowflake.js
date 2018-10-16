module.exports = {
    "type": "object",
    "properties": {
        "read": {
            "type": "object",
            "properties": {
                "database": {
                    "type": "string",
                    "pattern": "DB1|DB2|DB3"
                },
                "excludeTables": {
                    "type": "boolean"
                },
                "frequency":  {
                    "type":  "integer",
                    "faker": "random.number"
                },
                "host": {
                    "type": "string",
                    "faker": "internet.url"
                },
                "password": {
                    "type": "string",
                    "faker": "random.word"
                },
                "query": {
                    "type": "string",
                    "pattern": "SELECT * FROM table1|INSERT INTO table2 VALUES (3, 4, 5)"
                },
                "role": {
                    "type": "string",
                    "faker": "lorem.word"
                },
                "schema": {
                    "type": "string",
                    "faker": "lorem.word"
                },
                "sequenceColumn": {
                    "type": "string",
                    "faker": "database.column"
                },
                "tables": {
                    "type": "array",
                    "items": { "faker": "random.word" }
                },
                "updateColumn": {
                    "type": "string",
                    "faker": "database.column"
                },
                "user": {
                    "type": "string",
                    "faker": "random.firstName"
                },
                "warehouse": {
                    "type": "string",
                    "faker": "lorem.word"
                }
            },
            "required": ["role", "warehouse", "database", "excludeTables", "host"]
        }
    },
    "required": ["read"]
};
