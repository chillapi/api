import { Config } from "./Config";

export interface ModuleConfig extends Config {
    library: string;
    loaderClass?: string;
    id?: string;
}