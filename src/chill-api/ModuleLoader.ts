import { ModuleConfig } from "./ModuleConfig";

export interface ModuleLoader {
    loadModule: (config: ModuleConfig) => Promise<any>;
}