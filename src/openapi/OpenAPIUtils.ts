import { OpenAPIV3, Operation as OpenAPIOperation } from "../generated/openapiv3";

const refPattern = /^#\/components\/schemas\/(.+)$/;
const batchPathPattern = /^\/([^\/]+)$/;
const idPathPattern = /^\/([^\/]+)\/\{id\}$/

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface Property extends Parameter {
    isId: boolean;
}

export interface Entity {
    name: string;
    properties: Property[];
}

export interface Parameter {
    name: string;
    type: string;
    description?: string;
    isRequired: boolean;
    isReference: boolean;
    isArray: boolean;
}

export interface Response {
    code: number;
    isDefault: boolean;
    isError: boolean;
    content: Parameter;
}

export interface Operation {
    path: string;
    id: string;
    description?: string;
    method: HttpMethod;
    queryParameters?: Parameter[];
    pathParameters?: Parameter[];
    body?: Parameter;
    responses: Response[];
    authorizationScopes?: string[]
}

export function reference(prop: any): string {
    if (!prop || !prop.$ref) {
        return null;
    }
    const ref = prop.$ref.match(refPattern);
    if (!ref || !ref[1]) {
        return null;
    }
    return ref[1];
}

export function loadEntities(api: OpenAPIV3): Entity[] {
    const entities: Entity[] = [];
    for (const [k, schema] of Object.entries(api.components.schemas)) {
        const entity: Entity = { name: k, properties: [] };
        for (const [pk, pv] of Object.entries(schema.properties)) {
            entity.properties.push({
                ...param(pk, pv, schema.required && schema.required.indexOf(pk.toLowerCase()) > 0),
                isId: pk.toLowerCase() === 'id'
            })
        }
        entities.push(entity);
    }

    // Order entities according to the references
    let iter = 0;
    let sw = true;
    while (sw && iter++ < 10) {
        sw = false;
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            for (const prop of e.properties) {
                if (prop.isReference) {
                    const si = entities.findIndex(o => o.name === prop.type);
                    if (si > i) {
                        sw = true;
                        const oe: Entity = entities[si];
                        entities[si] = entities[i];
                        entities[i] = oe;
                        break;
                    }
                }
            }
        }
    }

    if (iter === 10) {
        console.warn('Circular FK detected');
    }

    return entities;
}

export function loadOperations(api: OpenAPIV3): Operation[] {
    const re: Operation[] = [];
    for (const [path, ops] of Object.entries(api.paths)) {
        for (const [method, op] of Object.entries(ops)) {
            const opC = (op as OpenAPIOperation);

            re.push({
                path,
                method: method as HttpMethod,
                id: opC.operationId,
                pathParameters: opC.parameters?.filter(p => p.in === 'path').map(p => param(p.name as string, p.schema, p.required as boolean)),
                queryParameters: opC.parameters?.filter(p => p.in === 'query').map(p => param(p.name as string, p.schema, p.required as boolean)),
                body: opC.requestBody ? {
                    ...param(null, opC.requestBody?.content && (opC.requestBody?.content as any)['application/json'] && (opC.requestBody?.content as any)['application/json'].schema, !!opC.requestBody?.required),
                    description: opC.requestBody?.description
                } : null,
                responses: Object.entries(opC.responses).map(([code, res]) => ({
                    code: Number(code),
                    isDefault: Number(code) < 300,
                    isError: Number(code) >= 400,
                    description: res.description,
                    content: { ...param(null, res?.content && res?.content['application/json'] && res?.content['application/json'].schema), description: res.description }
                }))
            });
        }
    }
    return re;
}

function param(name: string, content: any, isRequired?: boolean): Parameter {
    if (!content) {
        return null;
    }
    if (content.type === 'array') {
        return { ...param(name, content.items, isRequired), isArray: true };
    }
    const ref = reference(content);
    return {
        name,
        type: ref || (content.format ? `${content.type}:${content.format}` : content.type),
        isReference: !!ref,
        description: content.description,
        isRequired: !!isRequired,
        isArray: false
    };
}

