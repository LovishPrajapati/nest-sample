import { Struct } from '../../@types/types';

/**
 * `pick` picks keys fields from an object and returns them
 * @param obj Target from which keys to be picked
 * @param keys Keys to be picked
 * @returns {Object}
 */
export function pick(obj: Struct, keys: string[]): Struct {
  return keys.reduce((acc, key) => {
    return Object.assign(acc, { [key]: obj[key] });
  }, {});
}
