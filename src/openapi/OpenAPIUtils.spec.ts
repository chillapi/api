import { OpenAPIV3 } from '../generated/openapiv3';
import { loadEntities, loadOperations } from './OpenAPIUtils';
const api: OpenAPIV3 = {
    openapi: '3.0.1',
    info: {
        title: 'title',
        version: '1.0'
    },
    paths: {
        "/article": {
            "get": {
                "tags": [
                    "article"
                ],
                "summary": "Get all articles",
                "operationId": "getArticles",
                "parameters": [
                    {
                        "in": "query",
                        "name": "category",
                        "schema": {
                            "type": "string",
                            "default": "BLOG"
                        }
                    },
                    {
                        "in": "query",
                        "name": "filter",
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "in": "query",
                        "name": "language",
                        "schema": {
                            "type": "string",
                            "default": "en"
                        }
                    },
                    {
                        "in": "query",
                        "name": "page",
                        "schema": {
                            "type": "integer",
                            "default": 0
                        }
                    },
                    {
                        "in": "query",
                        "name": "itemsPerPage",
                        "schema": {
                            "type": "integer",
                            "default": 20
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Articles retrieved",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Article"
                                    }
                                }
                            }
                        }
                    }
                },
                "security": [
                    {
                        "auth": [
                            "openid"
                        ]
                    }
                ]
            },
            "post": {
                "tags": [
                    "article"
                ],
                "summary": "Add an article",
                "operationId": "addArticle",
                "requestBody": {
                    "description": "Article object that needs to be added",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Article"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Article created",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Article"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid object supplied",
                        "content": {}
                    }
                },
                "security": [
                    {
                        "auth": [
                            "openid"
                        ]
                    }
                ]
            }
        },
        "/article/{id}": {
            "put": {
                "tags": [
                    "article"
                ],
                "summary": "Modify an article",
                "operationId": "updateArticle",
                "parameters": [
                    {
                        "in": "path",
                        "required": true,
                        "name": "id",
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        }
                    }
                ],
                "requestBody": {
                    "description": "Article that is updated",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Article"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Article updated",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Article"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid object supplied"
                    },
                    "404": {
                        "description": "Article not found"
                    }
                },
                "security": [
                    {
                        "auth": [
                            "openid"
                        ]
                    }
                ]
            },
            "delete": {
                "tags": [
                    "article"
                ],
                "summary": "Delete an article",
                "operationId": "deleteArticle",
                "parameters": [
                    {
                        "in": "path",
                        "required": true,
                        "name": "id",
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Article deleted"
                    },
                    "404": {
                        "description": "Article not found"
                    }
                },
                "security": [
                    {
                        "auth": [
                            "openid"
                        ]
                    }
                ]
            }
        }
    },
    components: {
        schemas: {
            Article: {
                properties: {
                    id: {
                        type: 'integer'
                    },
                    title: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

test('loads entities from OpenAPI document', () => {
    const entities = loadEntities(api);
    expect(entities.length).toBe(1);
    expect(entities[0].name).toBe('Article');
});

test('loads operations from OpenAPI document', () => {
    const operations = loadOperations(api);
    expect(operations.length).toBe(4);
    expect (operations[0].path).toBe("/article");
    expect(operations[0].method).toBe('get');
    expect(operations[0].queryParameters.length).toBe(5);
    expect(operations[0].responses[0].code).toBe(200);
    expect(operations[0].responses[0].isDefault).toBeTruthy();
    expect(operations[0].responses[0].isError).toBeFalsy();
    expect(operations[0].responses[0].content.isArray).toBeTruthy();
    expect(operations[0].responses[0].content.type).toBe('Article');
    expect(operations[0].responses[0].content.isReference).toBeTruthy();
    expect(operations[2].method).toBe('put');
    expect(operations[2].pathParameters[0].name).toBe('id');
    expect(operations[2].body.type).toBe('Article');
    expect(operations[2].body.isReference).toBeTruthy();
    expect(operations[2].responses[1].code).toBe(400);
    expect(operations[2].responses[1].isError).toBeTruthy();
})