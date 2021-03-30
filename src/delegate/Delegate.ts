export interface Delegate {
    process(context: any, params: any): Promise<void>;
}
