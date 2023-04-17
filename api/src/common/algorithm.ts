// random code tenant
/**
 * function random code tenant
 * @param params a list of params
 * @returns a random code tenant with length is 10
 */
export const randomCodeTenant = (...params) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/** random a password strong which has min length is 8 and at least 1 uppercase, 1 lowercase, 1 number, 1 special character
 * @returns a random password strong with min length is 8 and at least 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export const randomPassword = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  const charactersLength = characters.length;
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/** create function partial mapping type, if field exist in dto then update or using old value in entity
 * @param entity entity object which mapping from database
 * @param dto dto object from request body
 * @returns a new object with mapping type
 * @example
 * const entity = { id: 1, name: 'name', age: 20 };
 * const dto = { name: 'new name', age: 30 };
 * const result = partialMapping(entity, dto);
 * result = { id: 1, name: 'new name', age: 30 }
 */
export const partialMapping = (entity: any, dto: any) => {
  // get all keys of entity and dto
  const entityKeys = Object.keys(entity);
  const dtoKeys = Object.keys(dto);
  const result = {};

  // if field exist in dto then update or using old value in entity
  entityKeys.forEach((key) => {
    if (dtoKeys.includes(key)) {
      result[key] = dto[key];
    } else {
      result[key] = entity[key];
    }
  });
  return result;
};
