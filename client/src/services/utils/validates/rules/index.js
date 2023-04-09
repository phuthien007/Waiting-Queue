export const DocTypeRule = {
  name: [
    { required: true, message: "Tên loại văn bản không được bỏ trống" },
    { max: 256, message: "Tên đơn vị chỉ chứa tối đa 256 kí tự" },
  ],
  maxSize: [{ required: true, message: "Dung lượng không được bỏ trống" }],
  fileType: [{ required: true, message: "Loại file không được bỏ trống" }],
  code: [
    { required: true, message: "Mã loại văn bản không được bỏ trống" },
    { max: 256, message: "Tên đơn vị chỉ chứa tối đa 256 kí tự" },
  ],
  emailCc: [{ required: true, message: "Email CC không được bỏ trống" }],
  emailBcc: [{ required: true, message: "Email BCC không được bỏ trống" }],
  status: [{ required: true, message: "Trạng thái không được bỏ trống" }],
  description: [{ max: 500, message: "Mô tả chỉ chứa tối đa 500 kí tự" }],
};

export const DocGroupRules = {
  name: [{ required: true, message: "Tên nhóm văn bản không được bỏ trống" }],
  description: [{ max: 500, message: "Mô tả chỉ chứa tối đa 500 kí tự" }],
  status: [
    { required: true, message: "Trạng thái nhóm văn bản không được bỏ trống" },
  ],
};

export const AgentRules = {
  name: [
    { required: true, message: "Tên đơn vị không được bỏ trống" },
    { max: 256, message: "Tên đơn vị chỉ chứa tối đa 256 kí tự" },
  ],
  description: [{ max: 500, message: "Mô tả chỉ chứa tối đa 500 kí tự" }],
  status: [{ required: true, message: "Trạng đơn vị không được bỏ trống" }],
  type: [{ required: true, message: "Trạng đơn vị không được bỏ trống" }],
};

const emailValidator = (rule, values, callback) => {
  const emailRegex = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
  const invalidInputs = values?.filter((value) => !value.match(emailRegex));
  if (!invalidInputs || invalidInputs.length === 0) {
    callback();
  } else if (invalidInputs.length === 1) {
    callback(`${invalidInputs.join("")} không phải địa chỉ email`);
  } else {
    callback(
      `${invalidInputs.slice(0, -1).join(", ")} và ${invalidInputs.slice(
        -1
      )} không phải địa chỉ email`
    );
  }
};
export const EmailCollectionRule = {
  name: [
    { required: true, message: "Tên danh sách không được bỏ trống" },
    { max: 256, message: "Tên danh sách chỉ chứa tối đa 256 kí tự" },
  ],
  cc: [{ validator: emailValidator }],
  bcc: [{ validator: emailValidator }],
};

export const AccountRule = {
  fullName: [
    { required: true, message: "Họ tên không được bỏ trống" },
    { max: 256, message: "Họ tên chỉ chứa tối đa 256 kí tự" },
  ],
  userName: [
    { required: true, message: "Tên đăng nhập không được bỏ trống" },
    { max: 256, message: "Tên đăng nhập chỉ chứa tối đa 256 kí tự" },
    {
      pattern:
        "^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$",
      message: "Tên đăng nhập chỉ chứa kí tự 0-9, A-Z và một số ký tự khác",
    },
  ],
  email: [
    { required: true, type: "email", message: "Email không được bỏ trống" },
    {},
  ],
  agent: [{ required: true, message: "Đơn vị không được bỏ trống" }],
  roles: [{ required: true, message: "Quyền hạn không được bỏ trống" }],
  groups: [{ required: true, message: "Nhóm tài liệu không được bỏ trống" }],
  status: [{ required: true, message: "Trạng thái không được bỏ trống" }],
  password: [{ required: true, message: "Mật khẩu không được bỏ trống" }], // optional
};

export const ConfigurationCommonRule = {
  attachFiles: [
    { required: true, message: "Tệp tin đính kèm không được bỏ trống" },
  ],
};

export const ConfigurationEmailRule = {
  host: [{ required: true, message: "Địa chỉ server không được bỏ trống" }],
  port: [{ required: true, message: "Cổng không được bỏ trống" }],
  username: [{ required: true, message: "Tên đăng nhập không được bỏ trống" }],
  password: [{ required: true, message: "Mật khẩu không được bỏ trống" }],
  sender: [{ required: true, message: "Email không được bỏ trống" }],
};

export const SecurityRule = {
  logoutAfter: [{ required: true, message: "Không được bỏ trống" }],
  changePasswordAfter: [{ required: true, message: "Không được bỏ trống" }],
};

export const ConfigurationTestEmailRule = {
  email: [
    {
      required: true,
      type: "email",
      message: "Địa chỉ email không được bỏ trống",
    },
  ],
};

export const ChangePwdRule = {
  currentPassword: [
    { required: true, message: "Mật khẩu hiện tại không được bỏ trống" },
  ],
  newPassword: [
    { required: true, message: "Mật khẩu mới không được bỏ trống" },
  ],
  reNewPassword: [
    {
      required: true,
      message: "Xác nhận mật khẩu mới không không được bỏ trống",
    },
  ],
};

export const UpdateProfileRule = {
  fullName: [
    { required: true, message: "Họ tên không thể bỏ trống" },
    { max: 256, message: "Họ tên chỉ chứa tối đa 256 kí tự" },
  ],
  userName: [{ required: true, message: "Tên đăng nhập không thể bỏ trống" }],
  email: [{ required: true, message: "Email không thể bỏ trống" }],
};

export const FileRule = {
  name: [
    { required: true, message: "Tên file không thể bỏ trống" },
    { max: 256, message: "Tên file chỉ chứa tối đa 256 kí tự" },
  ],
  description: [{ max: 500, message: "Mô tả file chỉ chứa tối đa 500 kí tự" }],
  status: [{ required: true, message: "Trạng thái không thể bỏ trống" }],
  agentId: [{ required: true, message: "Đơn vị không thể bỏ trống" }],
  groupId: [{ required: true, message: "Nhóm văn bản không thể bỏ trống" }],
  file: [{ required: true, message: "File văn bản không thể bỏ trống" }],
};

export const AuthenticatieRule = {
  userName: [{ required: true, message: "Tên file không thể bỏ trống" }],
  password: [{ required: true, message: "Tên file không thể bỏ trống" }],
};

/*= ======================   Document Validate   ======================= */
/**
 * 1. Make
 * 2. Edit
 * 3. Phat hanh van ban.
 */
export const DocumentRule = {
  name: [
    { required: true, message: "Tên văn bản không thể bỏ trống" },
    { max: 256, message: "Tên văn bản chỉ chứa tối đa 256 kí tự" },
  ],
  doctype: [{ required: true, message: "Loại văn bản không thể bỏ trống" }],
  docgroup: [{ required: true, message: "Nhóm văn bản không thể bỏ trống" }],
  description: [
    { max: 500, message: "Mô tả văn bản chỉ chứa tối đa 500 kí tự" },
  ],
  emailCC: [{ required: true, message: "EmailCc không thể bỏ trống" }],
  emailBCC: [{ required: true, message: "EmailBcc không thể bỏ trống" }],
  attachFiles: [
    { required: true, message: "Tệp tin đính kèm không thể bỏ trống" },
  ],
};

export const CommentRule = {
  content: [
    { required: true, message: "Nội dung phản hồi không thể bỏ trống" },
  ],
};

export const DocumentReleaseRule = {
  name: [
    { required: true, message: "Tiêu đề phát hành văn bản không thể bỏ trống" },
    {
      max: 256,
      message: "Tiêu đề phát hành văn bản chỉ chứa tối đa 256 kí tự",
    },
  ],
  description: [
    { max: 500, message: "Mô tả phát hành văn bản chỉ chứa tối đa 500 kí tự" },
  ],
  agents: [{ required: true, message: "Đơn vị không thể bỏ trống" }],
};

export const DocumentDueDateRule = {
  dueDate: [{ required: true, message: "Hạn hoàn thành không được bỏ trống" }],
};
