import { Delegate } from "./Delegate";
import { DelegateConfig } from "./DelegateConfig";

export interface DelegateFactory {
    createDelegate(config: DelegateConfig): Delegate;
}