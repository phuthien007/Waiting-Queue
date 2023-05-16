import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
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

/**
 * function create token reset password
 * @returns a random token with length is 10
 */
export const createResetTokenPassword = () => {
  // random token
  const token = randomPassword();
  // hash token
  // const hashToken = bcrypt.hash(token, 10);
  return token;
};

/**
 * function create code queue
 * @param parmas a list of params
 * @returns a random code queue with length is 5
 */
export const createCodeQueue = (...parmas) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const handleHashQueue = (randomQueueCode: string, uxTime: string) => {
  return getHashSHARandomQueue([randomQueueCode, uxTime]);
};
export const handleValidateHashQueue = (
  randomQueueCode: string,
  uxTime: string,
  h: string,
) => {
  const encryptText = getHashSHARandomQueue([randomQueueCode, uxTime]);

  return [encryptText.substring(0, 20), h];
};

export function encryptAES(text: string) {
  const iv = CryptoJS.lib.WordArray.random(16); // tạo vector khởi tạo ngẫu nhiên 16 byte

  // Mã hóa thông điệp
  const ciphertext = CryptoJS.AES.encrypt(text, process.env.JWT_SECRET, {
    iv: iv,
  });
  const encryptedMessage = iv.toString() + ':' + ciphertext.toString();
  return encryptedMessage;
}

// Giải mã văn bản
export function decryptAES(text: string) {
  const parts = text.split(':');
  const decipher = CryptoJS.AES.decrypt(parts[1], process.env.JWT_SECRET, {
    iv: CryptoJS.enc.Hex.parse(parts[0]),
  });
  const decryptedMessage = decipher.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

// random queue code
export const getRandomQueueCode = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getHashSHARandomQueue = (plainText: string[]) => {
  const encryptText = CryptoJS.HmacSHA512(
    plainText.join('|'),
    process.env.JWT_SECRET,
  );
  return encryptText.toString(CryptoJS.enc.Hex);
};
