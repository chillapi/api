export interface GeneratorConfig {
        apiPath: string;
        dbType: 'postgres' | 'mongo';
        privateKeyPassPhrase: string;
}