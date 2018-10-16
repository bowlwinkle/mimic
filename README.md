![logo](https://user-images.githubusercontent.com/2514697/47020644-ae5edd00-d10e-11e8-959b-05fbb4f0aba9.png)

# MDGEN - Mock Data Generator

Generate mock data based on a JSON schema and the amount of records you wish to generate.  You can generate to a file, HTTP interface or host the generated data from `mdgen` iteself.

Project uses [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) for constructing the data. See their documentation for writing a schema.

### Config
You will need to pass a schema file otherwise, `mdgen` will use the example schema to generate data.
See CLI examples below...

### Commands
```bash
mdgen http -h [hostname] -p [port] -r [resource URL path] -s [schema file path] -a [amount] -v [verbose]
mdgen file -f [file] -s [schema file path] -a [amount] -v [verbose]
mdgen serve -p [port] -s [schema file path] -a [amount] -v [verbose]
```

### Examples
_All examples below use \<root\>/schema.js as the JSON schema_

**HTTP POST Data**
```bash
mdgen http -h localhost -p 8888 -r /v1/sources -s schemas/file-schemas/file-test-schema.json -a 10 -v true
```

**File Data**
```bash
mdgen file -f ./output.json -s schemas/file-schemas/file-test-schema.json -a 100 -v
```

**Serve Data**
```bash
mdgen serve -p 9999 -a 100
```

![mdgen](https://user-images.githubusercontent.com/2514697/41861872-3f79854e-7857-11e8-8716-84301c26dd16.gif)
