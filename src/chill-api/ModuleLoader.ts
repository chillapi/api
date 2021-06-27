import { ModuleConfig } from "./ModuleConfig";
import { OpenAPIV3 } from '../generated/openapiv3';

export interface ModuleLoader {
    loadModule: (config: ModuleConfig) => Promise<any>;
    generateStubs: (api: OpenAPIV3, rootPath: string) => Promise<void>;
}