// @flow
import _bind from 'lodash.bind';
import _findIndex from 'lodash.findindex';
import _isFunction from 'lodash.isfunction';
import _isEqual from 'lodash.isequal';

type CompareArg<T> = T | T => boolean;

function toCompareFunc<T>(o: CompareArg<T>): (T => boolean) {
  if (_isFunction((o: any))) {
    return (o: any);
  }
  return _bind(_isEqual, {}, o);
}

export function includes<T>(array: Array<T>, compare: CompareArg<T>): boolean {
  const index = _findIndex(array, toCompareFunc(compare));
  return index !== -1;
}

export default includes;
