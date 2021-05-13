export interface Config {
    kind: 'Bootstrap' | 'Generator' | 'Module' | 'MethodDelegate';
    id: string;
    apiVersion?: string;
}