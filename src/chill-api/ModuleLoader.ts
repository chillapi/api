import { ModuleConfig } from "./ModuleConfig";

export interface ModuleLoader {
    loadModule: (context: any, config: ModuleConfig) => void;
}