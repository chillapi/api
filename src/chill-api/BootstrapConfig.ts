import { Config } from "./Config";

export interface BootstrapConfig extends Config {
    configPath: string;
    apiPath: string;
    hostname: string;
    port: number;
    tenant?: string;
    corsOrigin?: string;
}