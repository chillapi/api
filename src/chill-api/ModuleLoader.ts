import { Context } from "./Context";
import { ModuleConfig } from "./ModuleConfig";

export interface ModuleLoader {
    loadModule: (context: Context, config: ModuleConfig) => Promise<void>;
}