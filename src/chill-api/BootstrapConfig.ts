import { Config } from "./Config";

export interface BootstrapConfig extends Config {
    apiPath: string;
    hostname: string;
    port: number;
    tenant?: string;
    corsOrigin?: string;
}