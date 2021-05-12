import { Delegate } from "./Delegate";
import { MethodDelegateConfig } from "./MethodDelegateConfig";

export interface MethodDelegate {
    config: MethodDelegateConfig;
    pipe: Delegate[];
}