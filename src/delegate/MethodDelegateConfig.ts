import { DelegateConfig } from "./DelegateConfig";

export interface MethodDelegateConfig {
    pipe: DelegateConfig[];
    returnVar: string;
    transactional: boolean;
}