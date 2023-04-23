type Operator = (value: string) => any;
interface Obj {
  [key: string]: Obj | Operator;
}

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
) {
  const [arrKey, value] = str.split(':');
  const obj: Obj = {};
  let currentObj = obj;
  const keys = arrKey.split('.');
  const lastKey = keys.pop();

  for (const key of keys) {
    currentObj[key] = {};
    currentObj = currentObj[key] as Obj;
  }

  currentObj[lastKey!] = operator(value);

  return obj;
}
