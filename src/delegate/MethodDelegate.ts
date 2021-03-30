import { Delegate } from "./Delegate";

export interface MethodDelegate {
    pipe: Delegate[];
    returnVar?: string;
    transactional: boolean;
}