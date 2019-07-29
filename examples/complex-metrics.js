module.exports = {
  "amount": 1,
  "rootPath": "/metrics",
  "schema": {
    "definitions": {
      "NumberRange": {
        "type": "number",
        "faker": "random.number",
        "minimum": 0,
        "maximum": 150
      },
      "CoreChartPlotData": {
        "type": "object",
        "properties": {
          // "type": { "enum": ["AreaChart", "BarChart", "LineChart", "RadarChart", "PieChart", "RadarChart", "RadialBarChart", "ScatterChart"] },
          "type": {
            "type": "string",
            "pattern": "AreaChart | BarChart | LineChart | RadarChart | PieChart | RadarChart | RadialBarChart | ScatterChart",
            "enum": ["AreaChart", "BarChart", "LineChart", "RadarChart", "PieChart", "RadarChart", "RadialBarChart", "ScatterChart"]
          },
          "data": {
            "type": "array",
            "minItems": 5,
            "maxItems": 20,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string", "faker": "address.city" },
                "Employed": { "$ref": "#/definitions/NumberRange" },
                "Unemployed": { "$ref": "#/definitions/NumberRange" },
                "Bums": { "$ref": "#/definitions/NumberRange" },
              },
              "required": ["name", "Employed", "Unemployed", "Bums"]
            },
          }
        },
        "required": ["data"]
      },
      "ArrayOfChartDataSets": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "pattern": "Lucas",
            "enum": ["Lucas"]
           },
          "data": {
            "type": "array",
            "minItems": 5,
            "maxItems": 20,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string", "faker": "address.city" },
                "earned": { "$ref": "#/definitions/NumberRange" },
                "lost": { "$ref": "#/definitions/NumberRange" }
              },
              "required": ["name", "earned", "lost"]
            },
          }
        },
        "required": [ "data"]
      },
      "CoreRootChartData": {
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
                "pattern": "AreaChart | BarChart | LineChart | RadarChart | PieChart | RadarChart | RadialBarChart | ScatterChart | Lucas",
                "enum": ["AreaChart", "BarChart", "LineChart", "RadarChart", "PieChart", "RadarChart", "RadialBarChart", "ScatterChart"],
              }
            },
            "required": ["type"],
            "oneOf": [
              { "$ref": "#/definitions/CoreChartPlotData" },
              { "$ref": "#/definitions/ArrayOfChartDataSets" }
            ],
          },
        },
        "required": ["type", "name", "value"]
      },
      "RadarChartData": {
        "allOf": [
          { "$ref": "#/definitions/CoreRootChartData" },
          { "properties": {
            "fullMark": {
              "$ref": "#/definitions/NumberRange",
            },
            "required": "fullMark"
          } }
        ]
      },
    },
    "$ref": "#/definitions/CoreRootChartData"
  }
};
