/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import { Button, Descriptions, Space, Tag, Tooltip } from "antd";
import moment from "moment";
import { DocumentStatusRender } from "services/utils/format";
import {
  FORMAT_DATE,
  FORMAT_DATETIME,
  SHOWMORE_SIZE,
} from "services/utils/constants";

const TableCellDetailDocument = ({ data }) => {
  return (
    <Descriptions
      column={1}
      key={Math.random()}
      title={
        <span>
          {data?.name}{" "}
          {data?.dueDate && (
            <Tooltip title="Hạn hoàn thành">
              <Tag color="orange">
                <i className="fe fe-clock mr-1" />
                {moment(data?.dueDate).format(FORMAT_DATE)}
              </Tag>
            </Tooltip>
          )}
        </span>
      }
      size="small"
    >
      <Descriptions.Item
        key={Math.random()}
        label={
          <Space>
            <i className="fe fe-folder" />
            <span>Nhóm văn bản</span>
          </Space>
        }
      >
        {data?.docgroup && data?.docgroup?.name}
      </Descriptions.Item>
      <Descriptions.Item
        key={Math.random()}
        label={
          <Space>
            <i className="fe fe-info" />
            <span>Mô tả</span>
          </Space>
        }
      >
        {data?.description}
      </Descriptions.Item>
      <Descriptions.Item
        key={Math.random()}
        label={
          <Space>
            <i className="fa fa-calendar-plus-o" />
            <span>Ngày tạo</span>
          </Space>
        }
      >
        {data?.createDate && moment(data?.createDate).format(FORMAT_DATETIME)}
      </Descriptions.Item>
      {data?.userHasA1Role && (
        <Descriptions.Item
          key={Math.random()}
          label={
            <>
              <Space>
                <i className="fa fa-calendar-plus-o" />
                <span>Đơn vị nhận</span> (
                {data?.publishToReceivers.filter((u) => u?.confirmDate).length}/
                {data?.publishToReceivers.length})
              </Space>{" "}
            </>
          }
          className="tag-fl"
        >
          <div>
            {data?.publishToReceivers?.slice(0, SHOWMORE_SIZE).map((a) => (
              <Tooltip
                key={a?.id}
                placement="top"
                title={
                  a?.confirmDate
                    ? moment(a?.confirmDate).format(FORMAT_DATETIME)
                    : "Chưa xác nhận"
                }
              >
                <Tag key={a?.id} color={a?.confirmDate ? "#87d068" : "magenta"}>
                  {a?.fullName}
                </Tag>
              </Tooltip>
            ))}
            {data?.publishToReceivers?.length > SHOWMORE_SIZE && (
              <span className="display-more">
                {data?.publishToReceivers?.slice(SHOWMORE_SIZE).map((a) => (
                  <Tooltip
                    key={a?.id}
                    placement="top"
                    title={
                      a?.confirmDate
                        ? moment(a?.confirmDate).format(FORMAT_DATETIME)
                        : "Chưa xác nhận"
                    }
                  >
                    <Tag
                      key={a?.id}
                      color={a?.confirmDate ? "#87d068" : "magenta"}
                    >
                      {a?.fullName}
                    </Tag>
                  </Tooltip>
                ))}
                <a
                  href="#"
                  className="showmore"
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.parentNode.classList.add("show");
                  }}
                  title="Xem thêm"
                >
                  ......
                </a>
                <a
                  href="#"
                  className="showless"
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.parentNode.classList.remove("show");
                  }}
                  title="Thu gọn"
                >
                  <i className="fe fe-chevrons-up" />
                </a>
              </span>
            )}
            <span style={{ visibility: "hidden" }}>hidden</span>
          </div>
        </Descriptions.Item>
      )}
      <Descriptions.Item
        key={Math.random()}
        label={
          <Space>
            <i className="fe fe-user-plus" />
            <span>Tài khoản được chia sẻ</span>
          </Space>
        }
      >
        <>
          <span>
            {data?.publishToUsers?.slice(0, SHOWMORE_SIZE).map((a) => (
              <Tag color="blue" key={a?.id}>
                {a?.fullName}
              </Tag>
            ))}
          </span>
          {data?.publishToUsers?.length > SHOWMORE_SIZE && (
            <span className="display-more">
              {data?.publishToUsers?.slice(SHOWMORE_SIZE).map((a) => (
                <Tag color="blue" key={a?.id}>
                  {a?.fullName}
                </Tag>
              ))}
              <Button
                type="link"
                href="#"
                className="showmore"
                onClick={(e) => {
                  e.preventDefault();
                  e.currentTarget.parentNode.classList.add("show");
                }}
                title="Xem thêm"
              >
                ......
              </Button>
              <Button
                type="link"
                href="#"
                className="showless"
                onClick={(e) => {
                  e.preventDefault();
                  e.currentTarget.parentNode.classList.remove("show");
                }}
                title="Thu gọn"
              >
                <i className="fe fe-chevrons-up" />
              </Button>
            </span>
          )}
        </>
      </Descriptions.Item>
      <Descriptions.Item
        key={Math.random()}
        label={
          <Space>
            <i className="fe fe-check-circle" />
            <span>Trạng thái</span>
          </Space>
        }
      >
        <p>{DocumentStatusRender(data?.status)}</p>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TableCellDetailDocument;
