import { Tag } from "antd";
import moment from "moment";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  LABEL_COLOR,
  DB_AGENT_STATUS_ACTIVE,
  DB_AGENT_STATUS_INACTIVE,
  LABEL_AGENT_STATUS_ACTIVE,
  LABEL_AGENT_STATUS_INACTIVE,
  DB_AGENT_TYPE_A1,
  DB_AGENT_TYPE_AGENT,
  LABEL_AGENT_TYPE_A1,
  LABEL_AGENT_TYPE_AGENT,
  DB_DOCTYPE_STATUS_ACTIVE,
  LABEL_DOCTYPE_STATUS_ACTIVE,
  LABEL_DOCTYPE_STATUS_INACTIVE,
  DB_DOCTYPE_STATUS_INACTIVE,
  DB_GROUP_STATUS_ACTIVE,
  DB_GROUP_STATUS_INACTIVE,
  LABEL_GROUP_STATUS_ACTIVE,
  LABEL_GROUP_STATUS_INACTIVE,
  DB_USER_STATUS_ACTIVE,
  LABEL_USER_STATUS_ACTIVE,
  LABEL_USER_STATUS_INACTIVE,
  DB_USER_STATUS_INACTIVE,
  DB_DOCUMENT_STATUS_NEW,
  LABEL_DOCUMENT_STATUS_NEW,
  DB_DOCUMENT_STATUS_CONFIRMED,
  LABEL_DOCUMENT_STATUS_CONFIRMED,
  DB_DOCUMENT_STATUS_REVOKED,
  LABEL_DOCUMENT_STATUS_REVOKED,
  DB_DOCUMENT_STATUS_REVOKED_BY_A1,
  LABEL_DOCUMENT_STATUS_REVOKED_BY_A1,
  DB_DOCUMENT_STATUS_RELEASE,
  LABEL_DOCUMENT_STATUS_RELEASE,
  DB_DOCUMENT_STATUS_DELETED,
  LABEL_DOCUMENT_STATUS_DELETED,
  DOCUMENT_LABEL_COLOR,
  FORMAT_DATE,
  ROLE_ENUM,
  STATUS_QUEUE_ENUM,
} from "../constants";

export const AgentStatusRender = (status = 0) => {
  switch (status) {
    case DB_AGENT_STATUS_ACTIVE:
      return <Tag color={LABEL_COLOR.ACTIVE}>{LABEL_AGENT_STATUS_ACTIVE}</Tag>;
    case DB_AGENT_STATUS_INACTIVE:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_AGENT_STATUS_INACTIVE}</Tag>
      );
    default:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_AGENT_STATUS_INACTIVE}</Tag>
      );
  }
};
export const TicketStatusRender = (status = 0) => {
  switch (status) {
    case 2:
      return <Tag color={LABEL_COLOR.DONE}>Đã xử lý</Tag>;
    case 0:
      return <Tag color={LABEL_COLOR.INACTIVE}>Chờ xử lý</Tag>;
    case 1:
      return <Tag color={LABEL_COLOR.ACTIVE}>Đang xử lý</Tag>;
    default:
      return <Tag color={LABEL_COLOR.INACTIVE}>Chờ xử lý</Tag>;
  }
};

export const TicketCommentStatusRender = (status = "Tạo ticket") => {
  switch (status) {
    case "Hoàn thành Ticket":
      return (
        <Tag icon={<CheckOutlined />} color={LABEL_COLOR.DONE}>
          Hoàn thành Ticket
        </Tag>
      );
    case "Mở lại ticket":
      return (
        <Tag
          icon={<i className="fa fa-refresh mr-2" />}
          color={LABEL_COLOR.WAITACTIVE}
        >
          Mở lại Ticket
        </Tag>
      );
    case "Nhận Ticket":
      return (
        <Tag icon={<CheckCircleOutlined />} color={LABEL_COLOR.ACTIVE}>
          Nhận Ticket
        </Tag>
      );
    default:
      return <Tag color={LABEL_COLOR.INACTIVE}>Tạo Ticket</Tag>;
  }
};

export const SubSystemsStatusRender = (status = 0) => {
  if (status === true) {
    status = 1;
  } else {
    status = 0;
  }
  switch (status) {
    // samestatus
    case DB_AGENT_STATUS_ACTIVE:
      return <Tag color={LABEL_COLOR.ACTIVE}>{LABEL_AGENT_STATUS_ACTIVE}</Tag>;
    case DB_AGENT_STATUS_INACTIVE:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_AGENT_STATUS_INACTIVE}</Tag>
      );
    default:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_AGENT_STATUS_INACTIVE}</Tag>
      );
  }
};
export const SystemStatusRender = (status = 0) => {
  if (status === true) {
    status = 1;
  } else {
    status = 0;
  }
  switch (status) {
    // samestatus
    case DB_AGENT_STATUS_ACTIVE:
      return <Tag color={LABEL_COLOR.ACTIVE}>{LABEL_AGENT_STATUS_ACTIVE}</Tag>;
    case DB_AGENT_STATUS_INACTIVE:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_AGENT_STATUS_INACTIVE}</Tag>
      );
    default:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_AGENT_STATUS_INACTIVE}</Tag>
      );
  }
};

export function AgentTypeRender(type = 1) {
  switch (type) {
    case DB_AGENT_TYPE_A1:
      return LABEL_AGENT_TYPE_A1;
    case DB_AGENT_TYPE_AGENT:
      return LABEL_AGENT_TYPE_AGENT;
    default:
      return "Unknown";
  }
}

export const DocTypeStatusRender = (status = 0) => {
  switch (status) {
    case DB_DOCTYPE_STATUS_ACTIVE:
      return (
        <Tag color={LABEL_COLOR.ACTIVE}>{LABEL_DOCTYPE_STATUS_ACTIVE}</Tag>
      );
    case DB_DOCTYPE_STATUS_INACTIVE:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_DOCTYPE_STATUS_INACTIVE}</Tag>
      );
    default:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_DOCTYPE_STATUS_INACTIVE}</Tag>
      );
  }
};

export const DocGroupStatusRender = (status = 0) => {
  switch (status) {
    case DB_GROUP_STATUS_ACTIVE:
      return <Tag color={LABEL_COLOR.ACTIVE}>{LABEL_GROUP_STATUS_ACTIVE}</Tag>;
    case DB_GROUP_STATUS_INACTIVE:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_GROUP_STATUS_INACTIVE}</Tag>
      );
    default:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_GROUP_STATUS_INACTIVE}</Tag>
      );
  }
};

export const UserStatusRender = (status = 0) => {
  switch (status) {
    case DB_USER_STATUS_ACTIVE:
      return <Tag color={LABEL_COLOR.ACTIVE}>{LABEL_USER_STATUS_ACTIVE}</Tag>;
    case DB_USER_STATUS_INACTIVE:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_USER_STATUS_INACTIVE}</Tag>
      );
    default:
      return (
        <Tag color={LABEL_COLOR.INACTIVE}>{LABEL_USER_STATUS_INACTIVE}</Tag>
      );
  }
};

export const DocumentStatusRender = (status = 0) => {
  switch (status) {
    case DB_DOCUMENT_STATUS_NEW:
      return (
        <Tag
          color={DOCUMENT_LABEL_COLOR.NEW}
          style={{ color: "#333" }}
          className="linewrap"
        >
          {LABEL_DOCUMENT_STATUS_NEW}
        </Tag>
      );
    case DB_DOCUMENT_STATUS_CONFIRMED:
      return (
        <Tag
          color={DOCUMENT_LABEL_COLOR.CONFIRMED}
          style={{ color: "#333" }}
          className="linewrap"
        >
          {LABEL_DOCUMENT_STATUS_CONFIRMED}
        </Tag>
      );
    case DB_DOCUMENT_STATUS_REVOKED:
      return (
        <Tag color={DOCUMENT_LABEL_COLOR.REVOKED} className="linewrap">
          {LABEL_DOCUMENT_STATUS_REVOKED}
        </Tag>
      );
    case DB_DOCUMENT_STATUS_REVOKED_BY_A1:
      return (
        <Tag color={DOCUMENT_LABEL_COLOR.REVOKED} className="linewrap">
          {LABEL_DOCUMENT_STATUS_REVOKED_BY_A1}
        </Tag>
      );
    case DB_DOCUMENT_STATUS_RELEASE:
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color={DOCUMENT_LABEL_COLOR.RELEASE}
          className="linewrap"
        >
          {LABEL_DOCUMENT_STATUS_RELEASE}
        </Tag>
      );
    case DB_DOCUMENT_STATUS_DELETED:
      return (
        <Tag
          icon={<DeleteOutlined />}
          color={DOCUMENT_LABEL_COLOR.DELETED}
          className="linewrap"
        >
          {LABEL_DOCUMENT_STATUS_DELETED}
        </Tag>
      );
    default:
      return (
        <Tag color={DOCUMENT_LABEL_COLOR.NEW} className="linewrap">
          {LABEL_DOCUMENT_STATUS_NEW}
        </Tag>
      );
  }
};

// eslint-disable-next-line no-unused-vars
export function DocumentCommentStatusRender(status = 0, comment) {
  return DocumentStatusRender(status);
}

export const DueDateStatusRender = (date) => {
  const diffDays = date.startOf("day").diff(moment().startOf("day"), "days");
  if (diffDays > 1) {
    return (
      <Tag icon={<ClockCircleOutlined />} color="blue">
        {date.format(FORMAT_DATE)}
      </Tag>
    );
  }
  if (diffDays === 1) {
    return (
      <Tag icon={<ClockCircleOutlined />} color="gold">
        {date.format(FORMAT_DATE)}
      </Tag>
    );
  }
  if (diffDays === 0) {
    return (
      <Tag icon={<ClockCircleOutlined />} color="#2db7f5">
        {date.format(FORMAT_DATE)}
      </Tag>
    );
  }
  return (
    <Tag icon={<ClockCircleOutlined />} color="#f50">
      {date.format(FORMAT_DATE)}
    </Tag>
  );
};

export const StatusRender = (status) => {
  if (status) {
    return <Tag>Hoạt động</Tag>;
  } else {
    return <Tag>Ngừng hoạt động</Tag>;
  }
};

export const RoleRender = (role) => {
  switch (role) {
    case ROLE_ENUM.ADMIN:
      return <Tag color="blue">Quản trị viên</Tag>;
    case ROLE_ENUM.SUPER_ADMIN:
      return <Tag color="blue">Quản trị hệ thống</Tag>;
    default:
      return <Tag color="blue">Người điều hành </Tag>;
  }
};

export const StatusQueueRender = (status) => {
  switch (status) {
    case STATUS_QUEUE_ENUM.PENDING:
      return <Tag>Chờ phục vụ</Tag>;
    case STATUS_QUEUE_ENUM.SERVING:
      return <Tag>Đang phục vụ</Tag>;
    case STATUS_QUEUE_ENUM.WAITING:
      return <Tag>Đang chờ người mới</Tag>;
    case STATUS_QUEUE_ENUM.IS_CLOSED:
      return <Tag>Đã đóng</Tag>;
    default:
      return <Tag>Đã đóng</Tag>;
  }
};
