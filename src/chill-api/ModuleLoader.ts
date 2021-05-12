import { Context } from "node:vm";
import { ModuleConfig } from "./ModuleConfig";

export interface ModuleLoader {
    loadModule: (context: Context, config: ModuleConfig) => void;
}