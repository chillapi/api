export interface Config {
    kind: 'Bootstrap' | 'Generator' | 'Module' | 'MethodDelegate';
    apiVersion?: string;
}