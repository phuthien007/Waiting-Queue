import { Tag } from "antd";
import moment from "moment";

import {
  ROLE_ENUM,
  STATUS_ENROLL_QUEUE_ENUM,
  STATUS_QUEUE_ENUM,
} from "../constants";

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

export const StatusEnrollQueueRender = (status) => {
  switch (status) {
    case STATUS_ENROLL_QUEUE_ENUM.PENDING:
      return <Tag>Chờ phục vụ</Tag>;
    case STATUS_ENROLL_QUEUE_ENUM.SERVING:
      return <Tag>Đang phục vụ</Tag>;
    case STATUS_ENROLL_QUEUE_ENUM.DONE:
      return <Tag>Đã phục vụ</Tag>;
    default:
      return <Tag>Chờ phục vụ</Tag>;
  }
};
