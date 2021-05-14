import { ModuleConfig } from "./ModuleConfig";
import { OpenAPIV3 } from '../generated/openapi';

export interface ModuleLoader {
    loadModule: (config: ModuleConfig) => Promise<any>;
    generateStubs: (api: OpenAPIV3) => Promise<void>;
}