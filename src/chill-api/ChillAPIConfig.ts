export interface ChillAPIConfig {
    version: string;
    apiPath?: string;
    methodPaths?: { [path: string]: { [method: string]: { path: string } } };
    corsOrigin?: string;
    permissionClaim?: string;
    modules: string[];
}
export const DEFAULT_CONFIG: ChillAPIConfig = {
    version: '0.0.1',
    modules: ['@chillapi/postgres']
}
