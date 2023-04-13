export const ERROR_TYPE = {
  REQUIRED: 'required',
  MINLENGTH: 'minlength',
  MAXLENGTH: 'maxlength',
  EMAIL: 'email',
  PATTERN: 'pattern',
  MIN: 'min',
  MAX: 'max',
};

export const transformError = (field: string, type: string) => {
  // using vietnamese message
  switch (type) {
    case ERROR_TYPE.REQUIRED:
      return `${field} không được để trống`;
    case ERROR_TYPE.MINLENGTH:
      return `${field} phải có ít nhất 6 ký tự`;
    case ERROR_TYPE.MAXLENGTH:
      return `${field} không được vượt quá 20 ký tự`;
    case ERROR_TYPE.EMAIL:
      return `${field} không đúng định dạng email`;
    case ERROR_TYPE.PATTERN:
      return `${field} không đúng định dạng`;
    case ERROR_TYPE.MIN:
      return `${field} phải lớn hơn hoặc bằng 0`;
    case ERROR_TYPE.MAX:
      return `${field} phải nhỏ hơn hoặc bằng 100`;
    default:
      return `${field} không hợp lệ`;
  }
};
