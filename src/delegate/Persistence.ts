export interface Persistence {
    beginTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    executeQuery(context: any, params?: any[]): Promise<void>;
    executeMigration(migrationSet: { id: string, apply: string, rollback: string }[]): Promise<void>;
}