import { OpenAPIV3 } from '../generated/openapi';
import { loadEntities } from './OpenAPIUtils';
const api: OpenAPIV3 = {
    openapi: '3.0.1',
    info: {
        title: 'title',
        version: '1.0'
    },
    paths: {
    },
    components: {
        schemas: {
            MyEntity: {
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

test('loads test module', async () => {
    const entities = loadEntities(api);
    expect(entities.length).toBe(1);
    expect(entities[0].name).toBe('MyEntity');
});