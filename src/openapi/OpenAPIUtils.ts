import { OpenAPIV3 } from "../generated/openapiv3";

const refPattern = /^#\/components\/schemas\/(.+)$/;
const batchPathPattern = /^\/([^\/]+)$/;
const idPathPattern = /^\/([^\/]+)\/\{id\}$/

export interface Property {
    name: string;
    isId: boolean;
    type: string;
    isRequired: boolean;
    reference?: string;
}

export interface Entity {
    name: string;
    properties: Property[];
}

function reference(prop: any): string {
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
                name: pk,
                isId: pk.toLowerCase() === 'id',
                isRequired: schema.required && schema.required.indexOf(pk.toLowerCase()) > 0,
                type: pv.format ? `${pv.type}:${pv.format}` : pv.type,
                reference: reference(pv)
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
                if (prop.reference) {
                    const si = entities.findIndex(o => o.name === prop.reference);
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
