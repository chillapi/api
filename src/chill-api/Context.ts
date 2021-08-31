
export interface ResponseContainer {
    code?: number,
    type?: 'json' | 'void' | 'xml' | 'stream',
    content?: any
}

export interface Context {
    response: ResponseContainer;
    getVar(key: string): any;
    setVar(key: string, value: any): void
}