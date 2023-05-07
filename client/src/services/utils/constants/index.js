/* eslint-disable import/prefer-default-export */
const NA = "NA";
const DEFAULT_PAGE_SIZE = 2; // Default pageSize;

// regex for username start with letter and contain only letter, number, underscore
const REGEX_USERNAME = /^[a-zA-Z][a-zA-Z0-9_.]*$/;

// regex for password (at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character) (https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a)
const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,30}$/;

// const REGEX_USERNAME =
//   /^(?>[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*)|(?>[_.@A-Za-z0-9-]+)$/
// const REGEX_PASSWORD =
//   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*](?=\S+$).{7,30}$/
const REGEX_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const FORM_ITEM_LAYOUT_STYLE = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const SUBMIT_FORM_LAYOUT_STYLE = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

const WHITELISTFILEUPLOAD = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
];

/* ==================    Moment  ================== */
const FORMAT_DATE = "DD/MM/YYYY";
const FORMAT_DATE_MINUTE = "DD/MM/YYYY HH:mm";
const FORMAT_DATETIME = "DD/MM/YYYY HH:mm:ss";

const ROLE_ENUM = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  OPERATOR: "operator",
};

const STATUS_QUEUE_ENUM = {
  PENDING: "pending",
  WAITING: "waiting",
  SERVING: "serving",
  IS_CLOSED: "is_closed",
};
const STATUS_ENROLL_QUEUE_ENUM = {
  PENDING: "pending",
  SERVING: "serving",
  DONE: "done",
};

const WHITE_LIST_IMAGE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",

  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];

module.exports = {
  WHITE_LIST_IMAGE,
  ROLE_ENUM,
  STATUS_QUEUE_ENUM,
  DEFAULT_PAGE_SIZE,
  FORMAT_DATE,
  FORMAT_DATE_MINUTE,
  FORMAT_DATETIME,

  REGEX_USERNAME,
  REGEX_EMAIL,
  WHITELISTFILEUPLOAD,
  REGEX_PASSWORD,
  STATUS_ENROLL_QUEUE_ENUM,
};
