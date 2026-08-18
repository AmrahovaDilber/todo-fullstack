const swaggerJSDoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Todo API',
            version: '1.0.0',
            description: 'API for creating and managing todos.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        tags: [
            {
                name: 'Todos',
                description: 'Todo management endpoints',
            },
        ],
        components: {
            schemas: {
                Todo: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '65f1a7c3e4b8a2d1c9f01234',
                        },
                        title: {
                            type: 'string',
                            maxLength: 100,
                            example: 'Learn Swagger',
                        },
                        completed: {
                            type: 'boolean',
                            default: false,
                            example: false,
                        },
                    },
                },
                TodoResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success',
                        },
                        data: {
                            $ref: '#/components/schemas/Todo',
                        },
                    },
                },
                TodoListResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success',
                        },
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Todo',
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'fail',
                        },
                        message: {
                            type: 'string',
                            example: 'Todo not found',
                        },
                    },
                },
            },
        },
        paths: {
            '/todos': {
                get: {
                    tags: ['Todos'],
                    summary: 'Get all todos',
                    responses: {
                        200: {
                            description: 'Todos returned successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/TodoListResponse',
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Todos'],
                    summary: 'Create a todo',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title'],
                                    properties: {
                                        title: {
                                            type: 'string',
                                            maxLength: 100,
                                            example: 'Learn Swagger',
                                        },
                                        completed: {
                                            type: 'boolean',
                                            example: false,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Todo created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/TodoResponse',
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Invalid todo data',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/todos/{id}': {
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        example: '65f1a7c3e4b8a2d1c9f01234',
                    },
                ],
                get: {
                    tags: ['Todos'],
                    summary: 'Get one todo',
                    responses: {
                        200: {
                            description: 'Todo returned successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/TodoResponse',
                                    },
                                },
                            },
                        },
                        404: {
                            description: 'Todo not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                    },
                },
                put: {
                    tags: ['Todos'],
                    summary: 'Update a todo',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string', maxLength: 100, example: 'Read OpenAPI docs' },
                                        completed: { type: 'boolean', example: true },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Todo updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/TodoResponse',
                                    },
                                },
                            },
                        },
                    },
                },
                delete: {
                    tags: ['Todos'],
                    summary: 'Delete a todo',
                    responses: {
                        204: {
                            description: 'Todo deleted successfully',
                        },
                    },
                },
            },
        },
    },
    apis: [],
}

module.exports = swaggerJSDoc(options)
