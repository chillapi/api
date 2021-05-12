export interface Context {
    getComponent(name: string): any;
    setComponent(name: string, comp: any): void;
}