// export deepstring to object like: 'a.b.c:d' => {a: {b: {c: operator('d')}}}
/**
 * transform deep string to object
 * @param str string to transform
 * @param operator operator to transform value typeORM
 * @returns object
 * @example
 * deepStringToObject('a.b.c:d', (value) => Equal(value));
 * // return {a: {b: {c: Equal('d')}}}
 * deepStringToObject('a.b.c:d', (value) => MoreThan(value));
 * // return {a: {b: {c: MoreThan('d')}}}
 */
export function deepStringToObject(
  str: string,
  operator: (value: string) => any,
): { [key: string]: any } {
  const [key, value] = str.split(':');
  const keys = key.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce((obj, key) => {
    if (!obj[key]) {
      obj[key] = {};
    }
    return obj[key];
  }, {});
  lastObj[lastKey] = operator(value);
  return lastObj;
}
