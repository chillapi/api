import { Context } from '../chill-api/Context';

export interface Delegate {
    process(context: Context, params: any): Promise<void>;
}
