//Guessing how the structure of the source will look from an MDCat perspective
// const source = {
//     id: "asdf", //UUID
//     name: "",
//     description: "",
//     type: "",
//     sinkCount: 2,
//     entitlements: ["SuperUser", "EP", "CrabPeople"],
//     status: "Active", //Active, Paused, etc
//     streams: ["lucasStream", "boss stream"] //idk; maybe ids?
// };

module.exports = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            faker: 'random.uuid'
        },
        name: {
            type: 'string',
            faker: 'name.jobType'
        },
        description: {
            type: 'string',
            faker: 'lorem.sentences'
        },
        image: {
            type: "string",
            default: "https://picsum.photos/200/200/?random"
        },
        type: {
            type: 'string',
            pattern: 'S3|snowflake|fluentd|file'
        },
        //Do we care about the number of sinks or the number of streams?
        // sinkCount: {
        //     $ref: '#/definitions/positiveInt'
        // },
        entitlements: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            uniqueItems: true,
            items: {
                type: 'string',
                pattern: 'SuperUser|EP|CrabPeople'
            }
        },
        status: {
            type: 'string',
            pattern: 'Up|Down|Terminated'
        },
        streams: {
            type: 'array',
            minItems: 1,
            maxItems: 1000,
            items: {
                type: 'object',
                properties: {
                    count: {
                        $ref: '#/definitions/positiveInt'
                    },
                    streamIds: {
                        type: 'array',
                        minItems: 10,
                        maxItems: 1000,
                        uniqueItems: true,
                        items: {
                            id: {
                                type: 'string',
                                faker: 'random.uuid'
                            }
                        }
                    }
                }
            },
            required: ['count', 'streamIds']
        },
        owner: {
            type: 'string',
            format: 'email',
            faker: 'internet.email'
        },
        tags: {
            type: 'array',
            minItems: 1,
            maxItems: 10,
            items: {
                type: 'string',
                pattern: 'good|bad|ugly|new|deprecated|fancy'
            }
        }
    },
    required: ['id', 'name', 'description', 'image', 'type', 'entitlements', 'status', 'streams', 'owner', 'tags'],
    definitions: {
        positiveInt: {
            type: 'integer',
            minimum: 0,
            exclusiveMinimum: true
        }
    }
};