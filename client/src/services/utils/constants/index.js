/* eslint-disable import/prefer-default-export */
const NA = "NA";
const DEFAULT_PAGE_SIZE = 10; // Default pageSize;

const LABEL_COLOR = {
  ACTIVE: "green",
  INACTIVE: "red",
  WAITACTIVE: "orange",
  DONE: "blue",
};

const MODE_ACTION = {
  FILTER: "FILTER",
  ADD: "ADD", // common mode action
  EDIT: "EDIT", // common mode action
  SAVE: "SAVE", // Create || Update Object.
  MAKE_AND_RELEASE: "MAKE_AND_RELEASE", // USE Make and Release document (now).
  RELEASE: "RELEASE",
};

const FORMAT_EXTENTION = {
  XLS: "xls",
  PDF: "pdf",
};

const DB_USER_ROLE_ADMIN = "ADMIN";
const DB_USER_ROLE_A1 = "A1";
const DB_USER_ROLE_USER = "USER";

const LABEL_USER_ROLE_ADMIN = "ADMIN";
const LABEL_USER_ROLE_A1 = "A1";
const LABEL_USER_ROLE_USER = "USER";

const USER_ROLE_LIST = [
  {
    value: DB_USER_ROLE_ADMIN,
    label: LABEL_USER_ROLE_ADMIN,
  },
  {
    value: DB_USER_ROLE_A1,
    label: LABEL_USER_ROLE_A1,
  },
  {
    value: DB_USER_ROLE_USER,
    label: LABEL_USER_ROLE_USER,
  },
];

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

const DB_USER_STATUS_ACTIVE = 1;
const DB_USER_STATUS_INACTIVE = 0;
const LABEL_USER_STATUS_ACTIVE = "Hoạt động";
const LABEL_USER_STATUS_INACTIVE = "Ngừng hoạt động";
const USER_STATUS_LIST = [
  {
    value: DB_USER_STATUS_ACTIVE,
    label: LABEL_USER_STATUS_ACTIVE,
  },
  {
    value: DB_USER_STATUS_INACTIVE,
    label: LABEL_USER_STATUS_INACTIVE,
  },
];

const USER_STATUS_FILTER_LIST = [
  {
    value: null,
    label: "Tất cả",
  },
  {
    value: DB_USER_STATUS_ACTIVE,
    label: LABEL_USER_STATUS_ACTIVE,
  },
  {
    value: DB_USER_STATUS_INACTIVE,
    label: LABEL_USER_STATUS_INACTIVE,
  },
];

const DB_USER_VERIFY_TRUE = 1;
const DB_USER_VERIFY_FALSE = 0;
const LABEL_USER_VERIFY_TRUE = "YES";
const LABEL_USER_VERIFY_FALSE = "NO";

const DB_USER_STATE_ACTIVE = 10;
const DB_USER_STATE_INACTIVE = 0;
const LABEL_USER_STATE_ACTIVE = "Hiển thị";
const LABEL_USER_STATE_INACTIVE = "Ẩn";

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

const DB_DOCTYPE_STATUS_ACTIVE = 1;
const DB_DOCTYPE_STATUS_INACTIVE = 0;
const LABEL_DOCTYPE_STATUS_ACTIVE = "Hoạt động";
const LABEL_DOCTYPE_STATUS_INACTIVE = "Ngừng hoạt động";
const DOCTYPE_STATUS_LIST = [
  {
    value: DB_DOCTYPE_STATUS_ACTIVE,
    label: LABEL_DOCTYPE_STATUS_ACTIVE,
  },
  {
    value: DB_DOCTYPE_STATUS_INACTIVE,
    label: LABEL_DOCTYPE_STATUS_INACTIVE,
  },
];

const DOCTYPE_STATUS_FILTER_LIST = [
  {
    value: null,
    label: "Tất cả",
  },
  {
    value: DB_DOCTYPE_STATUS_ACTIVE,
    label: LABEL_DOCTYPE_STATUS_ACTIVE,
  },
  {
    value: DB_DOCTYPE_STATUS_INACTIVE,
    label: LABEL_DOCTYPE_STATUS_INACTIVE,
  },
];

const DOCUMENT_LABEL_COLOR = {
  NEW: "#e6f7ff", // blue1
  CONFIRMED: "#91d5ff", // blue3
  // RELEASE: '#1890ff', // blue6
  RELEASE: "#002766", // blue10
  REVOKED: "#ff4d4f", // red5
  DELETED: "#f5222d", // red6
};
const DB_DOCUMENT_STATUS_NEW = 0;
const DB_DOCUMENT_STATUS_CONFIRMED = 1;
const DB_DOCUMENT_STATUS_REVOKED = 2;
const DB_DOCUMENT_STATUS_REVOKED_BY_A1 = 3; // don't use
const DB_DOCUMENT_STATUS_RELEASE = 9;
const DB_DOCUMENT_STATUS_RELEASECONFIRM = 10;
const DB_DOCUMENT_STATUS_DELETED = 255;

const LABEL_DOCUMENT_STATUS_NEW = "Văn bản mới";
const LABEL_DOCUMENT_STATUS_CONFIRMED = "Xác nhận đã nhận văn bản";
const LABEL_DOCUMENT_STATUS_REVOKED = "Đã thu hồi";
const LABEL_DOCUMENT_STATUS_REVOKED_BY_A1 = "Đã thu hồi (sau phát hành)";
const LABEL_DOCUMENT_STATUS_RELEASE = "Đã phát hành";
const LABEL_DOCUMENT_STATUS_RELEASECONFIRM = "Đã xác nhận phát hành";
const LABEL_DOCUMENT_STATUS_DELETED = "Đã xóa";

const DOCUMENT_STATUS_LIST = [
  {
    value: DB_DOCUMENT_STATUS_NEW,
    label: LABEL_DOCUMENT_STATUS_NEW,
  },
  {
    value: DB_DOCUMENT_STATUS_CONFIRMED,
    label: LABEL_DOCUMENT_STATUS_CONFIRMED,
  },
  {
    value: DB_DOCUMENT_STATUS_REVOKED,
    label: LABEL_DOCUMENT_STATUS_REVOKED,
  },
  {
    value: DB_DOCUMENT_STATUS_RELEASE,
    label: LABEL_DOCUMENT_STATUS_RELEASE,
  },
];

const DOCUMENT_STATUS_FILTER_LIST = [
  {
    value: null,
    label: "Tất cả",
  },
  {
    value: DB_DOCUMENT_STATUS_NEW,
    label: LABEL_DOCUMENT_STATUS_NEW,
  },
  {
    value: DB_DOCUMENT_STATUS_CONFIRMED,
    label: LABEL_DOCUMENT_STATUS_CONFIRMED,
  },
  {
    value: DB_DOCUMENT_STATUS_REVOKED,
    label: LABEL_DOCUMENT_STATUS_REVOKED,
  },
  {
    value: DB_DOCUMENT_STATUS_RELEASE,
    label: LABEL_DOCUMENT_STATUS_RELEASE,
  },
  {
    value: DB_DOCUMENT_STATUS_REVOKED_BY_A1,
    label: LABEL_DOCUMENT_STATUS_REVOKED_BY_A1,
  },
  {
    value: DB_DOCUMENT_STATUS_DELETED,
    label: LABEL_DOCUMENT_STATUS_DELETED,
  },
];

/* ==================    DOC GROUP DOCUMENT   ================== */
const DB_GROUP_STATUS_ACTIVE = 1;
const DB_GROUP_STATUS_INACTIVE = 0;
const LABEL_GROUP_STATUS_ACTIVE = "Hoạt động";
const LABEL_GROUP_STATUS_INACTIVE = "Ngừng hoạt động";
const DOC_GROUP_STATUS_LIST = [
  {
    value: DB_GROUP_STATUS_ACTIVE,
    label: LABEL_GROUP_STATUS_ACTIVE,
  },
  {
    value: DB_GROUP_STATUS_INACTIVE,
    label: LABEL_GROUP_STATUS_INACTIVE,
  },
];

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

const DOC_GROUP_STATUS_FILTER_LIST = [
  {
    value: null,
    label: "Tất cả",
  },
  {
    value: DB_GROUP_STATUS_ACTIVE,
    label: LABEL_GROUP_STATUS_ACTIVE,
  },
  {
    value: DB_GROUP_STATUS_INACTIVE,
    label: LABEL_GROUP_STATUS_INACTIVE,
  },
];

/* ==================    AGENTS DOCUMENT   ================== */
const DB_AGENT_STATUS_ACTIVE = 1;
const DB_AGENT_STATUS_INACTIVE = 0;
const LABEL_AGENT_STATUS_ACTIVE = "Hoạt động";
const LABEL_AGENT_STATUS_INACTIVE = "Ngừng hoạt động";
const DB_AGENT_TYPE_A1 = 1;
const DB_AGENT_TYPE_AGENT = 2;
const LABEL_AGENT_TYPE_A1 = "A1";
const LABEL_AGENT_TYPE_AGENT = "Đơn vị";

const AGENT_STATUS_LIST = [
  {
    value: DB_AGENT_STATUS_ACTIVE,
    label: LABEL_AGENT_STATUS_ACTIVE,
  },
  {
    value: DB_AGENT_STATUS_INACTIVE,
    label: LABEL_AGENT_STATUS_INACTIVE,
  },
];

const AGENT_TYPE_LIST = [
  {
    value: DB_AGENT_TYPE_A1,
    label: LABEL_AGENT_TYPE_A1,
  },
  {
    value: DB_AGENT_TYPE_AGENT,
    label: LABEL_AGENT_TYPE_AGENT,
  },
];

const AGENT_STATUS_FILTER_LIST = [
  {
    value: null,
    label: "Tất cả",
  },
  {
    value: DB_AGENT_STATUS_ACTIVE,
    label: LABEL_AGENT_STATUS_ACTIVE,
  },
  {
    value: DB_AGENT_STATUS_INACTIVE,
    label: LABEL_AGENT_STATUS_INACTIVE,
  },
];

const AGENT_TYPE_FILTER_LIST = [
  {
    value: null,
    label: "Tất cả",
  },
  {
    value: DB_AGENT_TYPE_A1,
    label: LABEL_AGENT_TYPE_A1,
  },
  {
    value: DB_AGENT_TYPE_AGENT,
    label: LABEL_AGENT_TYPE_AGENT,
  },
];

/* ==================    FAKE DATA  ================== */
const FAKE_DATA_LIST = [
  {
    value: 1,
    label: "Label 01",
  },
  {
    value: 2,
    label: "Label 02",
  },
  {
    value: 3,
    label: "Label 03",
  },
];

/* ==================    Moment  ================== */
const FORMAT_DATE = "DD/MM/YYYY";
const FORMAT_DATE_MINUTE = "DD/MM/YYYY HH:mm";
const FORMAT_DATETIME = "DD/MM/YYYY HH:mm:ss";

/* ==================    Extension  ================== */
const PDF_EXT = [".pdf"]; // extension of file.
const PDF_ICON_FILE = "file-pdf"; // antd

const DOC_EXT = [".txt", ".doc", ".docx"];
const DOC_ICON_FILE = "file-word";

const EXCEL_EXT = [".xls", ".xlsx", ".xlsm", ".xlsb", ".csv"];
const EXCEL_ICON_FILE = "file-excel";

const IMAGE_EXT = [".png", ".jpg", ".jpeg"];
const IMAGE_ICON_FILE = "file-image";

const DEFAULT_ICON_FILE = "file";

const EXTENSION_TO_ICON = [
  {
    extension: PDF_EXT,
    icon: PDF_ICON_FILE,
  },
  {
    extension: EXCEL_EXT,
    icon: EXCEL_ICON_FILE,
  },
  {
    extension: DOC_EXT,
    icon: DOC_ICON_FILE,
  },
  {
    extension: IMAGE_EXT,
    icon: IMAGE_ICON_FILE,
  },
];

const EXTENSION = ["doc", "excel", "pdf", "image", "file"];

const SHOWMORE_SIZE = 4;
const NOTIFICATION_TYPE = {
  DOCUMENT_PUBLISHED: "DOCUMENT_PUBLISHED",
  DOCUMENT: "DOCUMENT",
  DOCUMENT_COMMENT: "DOCUMENT_COMMENT",
  TICKET: "TICKET",
  TICKET_COMMENT: "TICKET_COMMENT",
};

const NOTIFICATION_ERROR_MESSAGE = {
  DOCUMENT_IS_NULL: "Văn bản này không tồn tại hoặc đã bị xóa",
  DOCUMENT_COMMENT_IS_NULL: "Phản hồi này không tồn tại hoặc đã bị xóa",
  TICKET_IS_NULL: "Ticket này không tồn tại hoặc đã bị xóa",
  TICKET_COMMENT_IS_NULL: "Phản hồi này không tồn tại hoặc đã bị xóa",
};
module.exports = {
  NOTIFICATION_ERROR_MESSAGE,
  NOTIFICATION_TYPE,
  DB_DOCUMENT_STATUS_NEW,
  DB_DOCUMENT_STATUS_CONFIRMED,
  DB_DOCUMENT_STATUS_REVOKED,
  DB_DOCUMENT_STATUS_REVOKED_BY_A1,
  DB_DOCUMENT_STATUS_RELEASE,
  DB_DOCUMENT_STATUS_DELETED,
  LABEL_DOCUMENT_STATUS_CONFIRMED,
  LABEL_DOCUMENT_STATUS_REVOKED_BY_A1,
  LABEL_DOCUMENT_STATUS_REVOKED,
  LABEL_DOCUMENT_STATUS_RELEASE,
  LABEL_DOCUMENT_STATUS_DELETED,
  LABEL_DOCUMENT_STATUS_NEW,
  DB_AGENT_TYPE_A1,
  LABEL_AGENT_TYPE_A1,
  DB_AGENT_TYPE_AGENT,
  LABEL_AGENT_TYPE_AGENT,
  DB_DOCTYPE_STATUS_ACTIVE,
  DB_DOCTYPE_STATUS_INACTIVE,
  LABEL_DOCTYPE_STATUS_ACTIVE,
  LABEL_DOCTYPE_STATUS_INACTIVE,
  NA,
  DEFAULT_PAGE_SIZE,
  LABEL_COLOR,
  MODE_ACTION,
  FORMAT_EXTENTION,
  USER_ROLE_LIST,
  USER_STATUS_LIST,
  USER_STATUS_FILTER_LIST,
  DB_USER_VERIFY_TRUE,
  DB_USER_VERIFY_FALSE,
  LABEL_USER_VERIFY_TRUE,
  LABEL_USER_VERIFY_FALSE,
  DB_USER_STATE_ACTIVE,
  DB_USER_STATE_INACTIVE,
  LABEL_USER_STATE_ACTIVE,
  LABEL_USER_STATE_INACTIVE,
  FORM_ITEM_LAYOUT_STYLE,
  SUBMIT_FORM_LAYOUT_STYLE,
  DOCTYPE_STATUS_LIST,
  DOCTYPE_STATUS_FILTER_LIST,
  DOCUMENT_LABEL_COLOR,
  DB_DOCUMENT_STATUS_RELEASECONFIRM,
  LABEL_DOCUMENT_STATUS_RELEASECONFIRM,
  DOCUMENT_STATUS_LIST,
  DOCUMENT_STATUS_FILTER_LIST,
  DOC_GROUP_STATUS_LIST,
  DOC_GROUP_STATUS_FILTER_LIST,
  AGENT_STATUS_LIST,
  AGENT_TYPE_LIST,
  AGENT_STATUS_FILTER_LIST,
  AGENT_TYPE_FILTER_LIST,
  FAKE_DATA_LIST,
  FORMAT_DATE,
  FORMAT_DATE_MINUTE,
  FORMAT_DATETIME,
  DEFAULT_ICON_FILE,
  EXTENSION_TO_ICON,
  EXTENSION,
  SHOWMORE_SIZE,
  REGEX_USERNAME,
  REGEX_EMAIL,
  LABEL_USER_STATUS_ACTIVE,
  LABEL_USER_STATUS_INACTIVE,
  DB_USER_STATUS_ACTIVE,
  DB_USER_STATUS_INACTIVE,
  DB_AGENT_STATUS_ACTIVE,
  DB_AGENT_STATUS_INACTIVE,
  LABEL_AGENT_STATUS_ACTIVE,
  LABEL_AGENT_STATUS_INACTIVE,
  DB_GROUP_STATUS_ACTIVE,
  DB_GROUP_STATUS_INACTIVE,
  LABEL_GROUP_STATUS_ACTIVE,
  LABEL_GROUP_STATUS_INACTIVE,
  WHITELISTFILEUPLOAD,
  REGEX_PASSWORD,
};
