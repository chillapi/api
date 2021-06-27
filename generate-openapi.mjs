import { compile } from 'json-schema-to-typescript';
import fs from 'fs'
import https from 'https'
import path from 'path';

const OpenAPIJsonSchemaURL = 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json';

fs.mkdirSync('src/generated', { recursive: true });

https.get(OpenAPIJsonSchemaURL, (response) => {
    let str = '';

    response.on('data', (chunk) => {
        str += chunk;
    });

    response.on('end', () => {
        str = str.replace(/^\s*"id":\s*"(.+)",\s*$/gm,"\"id\":\"OpenAPIV3\",");
        compile(JSON.parse(str), "OpenAPIV3").then(ts => fs.writeFileSync(path.join('src', 'generated', 'openapiv3.d.ts'), ts))
    });
});