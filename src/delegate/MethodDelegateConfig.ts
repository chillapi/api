import { Config } from "../chill-api/Config";
import { DelegateConfig } from "./DelegateConfig";

export interface MethodDelegateConfig extends Config {
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    pipe: DelegateConfig[];
    returnVar: string;
    transactional: boolean;
}