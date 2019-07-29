module.exports = {
  "amount": 5,
  "rootPath": "/metrics",
  "schema": {
    "type": "object",
    "properties": {
      "type": {
        "type": ["string", "number"],
        "pattern": "number|string"
      },
      "name": {
        "type": "string",
        "faker": "name.firstName"
      },
      "value": {
        "type": ["string", "number"],
        "faker": "random.number"
      }
    },
    "required": ["type", "name", "value"]
  }
};
