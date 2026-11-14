import type {ToBeNone} from "./to-be-none";
import type {ToBeSome} from "./to-be-some";

export {toBeSome} from './to-be-some'
export {toBeNone} from './to-be-none'

export interface ResultMatchers<R, T> {
  toBeSome: ToBeSome<R, T>;
  toBeNone: ToBeNone<R, T>;
}