import { Tag } from "antd";
import moment from "moment";

import {
  ROLE_ENUM,
  STATUS_ENROLL_QUEUE_ENUM,
  STATUS_QUEUE_ENUM,
} from "../constants";

export const StatusRender = (status) => {
  if (status) {
    return <Tag color="green">Hoạt động</Tag>;
  } else {
    return <Tag color="red">Ngừng hoạt động</Tag>;
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
      return "Chờ phục vụ";
    case STATUS_QUEUE_ENUM.SERVING:
      return "Đang phục vụ";
    case STATUS_QUEUE_ENUM.WAITING:
      return "Đang chờ người mới";
    case STATUS_QUEUE_ENUM.IS_CLOSED:
      return "Đã đóng";
    default:
      return "Đã đóng";
  }
};

export const StatusEnrollQueueRender = (status) => {
  switch (status) {
    case STATUS_ENROLL_QUEUE_ENUM.PENDING:
      return "Chờ phục vụ";
    case STATUS_ENROLL_QUEUE_ENUM.SERVING:
      return "Đang phục vụ";
    case STATUS_ENROLL_QUEUE_ENUM.DONE:
      return "Đã phục vụ";
    default:
      return "Chờ phục vụ";
  }
};
export const StatusEnrollQueueRenderColor = (status) => {
  switch (status) {
    case STATUS_ENROLL_QUEUE_ENUM.PENDING:
      return "purple";
    case STATUS_ENROLL_QUEUE_ENUM.SERVING:
      return "blue";
    case STATUS_ENROLL_QUEUE_ENUM.DONE:
      return "green";
    default:
      return "purple";
  }
};
