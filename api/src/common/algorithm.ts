// random code tenant
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

// random a password strong which has min length is 8 and at least 1 uppercase, 1 lowercase, 1 number, 1 special character
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

// create funtion partial mapping type, if field exist in dto then update or using old value in entity
export const partialMapping = (entity, dto) => {
  const entityKeys = Object.keys(entity);
  const dtoKeys = Object.keys(dto);
  const result = {};
  entityKeys.forEach((key) => {
    if (dtoKeys.includes(key)) {
      result[key] = dto[key];
    } else {
      result[key] = entity[key];
    }
  });
  return result;
};
