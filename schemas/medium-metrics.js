module.exports = {
  "amount": 1,
  "rootPath": "/metrics",
  "schema": {
    "definitions": {
      "NumberRange": {
        "type": "number",
        "minLength": 0,
        "maxLength": 150,
        "faker": "random.number"
      },
      "AreaChartData": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "faker": "address.city" },
          "Employed": { "$ref": "#/definitions/NumberRange" },
          "Unemployed": { "$ref": "#/definitions/NumberRange" },
          "Bums": { "$ref": "#/definitions/NumberRange" },
        },
        "required": ["name", "Employed", "Unemployed", "Bums"]
      },
      "AreaChartData2D": {
        "type": "array",
        "minItems": 1,
        "maxItems": 20,
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string", "faker": "address.city" },
            "Employed": { "type": "number", "faker": "random.number" },
            "Unemployed": { "type": "number", "faker": "random.number" },
            "Destroyed": { "type": "number", "faker": "random.number" },
          },
          "required": ["name", "Employed", "Unemployed", "Destroyed"]
        }
      },
    },
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "pattern": "chart"
      },
      "name": {
        "type": "string",
        "faker": "name.firstName"
      },
      "value": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "pattern": "AreaChart|BarChart|LineChart|ComposedChart|PieChart|RadarChart|RadialBarChart|ScatterChart|Treemap",
          },
          "data": {
            "type": "array",
            "minItems": 5,
            "maxItems": 20,
            "items": {
              "$ref": "#/definitions/AreaChartData"
            }
          }
        },
        "required": ["type", "data"]
      }
    },
    "required": ["type", "name", "value"]
  }
};
