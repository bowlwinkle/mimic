# MDGEN - Mock Data Generator

Generate mock data based on a JSON schema and the amount of records you wish to generate.  You can generate to a file, Elasticsearch index, HTTP interface or host the generated data from `mdgen`

Project uses [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) for constructing the data. See their documentation for writing a schema.

### Config
You will need to pass a schema file otherwise, `mdgen` will use the example schema to generate data.
See CLI examples below...

### Commands
```bash
mdgen es -h [hostname] -p [port] -i [index-name] -s [schema file path] -a [amount] -v [verbose]
mdgen http -h [hostname] -p [port] -r [resource URL path] -s [schema file path] -a [amount] -v [verbose]
mdgen file -f [file] -s [schema file path] -a [amount] -v [verbose]
mdgen serve -p [port] -s [schema file path] -a [amount] -v [verbose]
```

### Examples
_All examples below use \<root\>/schema.js as the JSON schema_

**Elasticsearch PUT Data**
```bash
mdgen load -s schema.js
mdgen es -h http://localhost -p 9999 -i my_index -a 100 -v true
```

**HTTP POST Data**
```bash
mdgen load -s schema.js
mdgen http -h http://localhost -p 9999 -r  -a 100 -v true
```

**File Data**
```bash
mdgen load -s schema.js
mdgen serve -f ./hello-file.txt -a 100 -v true
```

**Serve Data**
```bash
mdgen load -s schema.js
mdgen serve -p 9999 -a 100
```