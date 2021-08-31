export interface Config {
    kind: 'Bootstrap' | 'Generator' | 'Module' | 'MethodDelegate' | 'DelegateFactory';
    id: string;
    apiVersion?: string;
}