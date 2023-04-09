/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import { Badge, Button, Descriptions, List, Space, Tag, Tooltip } from "antd";
import moment from "moment";
import { FORMAT_DATETIME, SHOWMORE_SIZE } from "services/utils/constants";

const TableCellDocument = ({ data }) => {
  return (
    <List itemLayout="vertical" bordered={false}>
      <List.Item>
        <List.Item.Meta title={<b>{data?.name}</b>} className="mb-0" />
        <Space direction="vertical" size={3}>
          <Space>
            <i className="fe fe-info" />
            <span>Mô tả:</span>
            <span className="text-muted">{data?.description}</span>
          </Space>
          <Space>
            <i className="fe fe-folder" />
            <span>Nhóm văn bản:</span>
            <span className="text-muted">
              {data?.docgroup && data?.docgroup?.name}
            </span>
          </Space>
          <Space>
            <i className="fa fa-calendar-plus-o" />
            <span>Ngày tạo:</span>
            <span className="text-muted">
              {data?.createDate &&
                moment(data?.createDate).format(FORMAT_DATETIME)}
            </span>
          </Space>
          {data?.userHasA1Role && (
            <Space direction="vertical" size={1}>
              <Space>
                <i className="fe fe-user-plus" />
                <span>
                  Đơn vị nhận (
                  {
                    data?.publishToReceivers.filter((u) => u?.confirmDate)
                      .length
                  }
                  /{data?.publishToReceivers.length}):
                </span>
              </Space>
              {data?.publishToReceivers?.length > 0 && (
                <div className="text-muted">
                  {data?.publishToReceivers.slice(0, SHOWMORE_SIZE).map((a) => (
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
                  {data?.publishToReceivers.length > SHOWMORE_SIZE && (
                    <span className="display-more">
                      {data?.publishToReceivers
                        .slice(SHOWMORE_SIZE)
                        .map((a) => (
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
                </div>
              )}
            </Space>
          )}

          <Space direction="vertical" size={1}>
            <Space>
              <i className="fe fe-user-plus" />
              <span>Tài khoản được chia sẻ:</span>
            </Space>
            {data?.publishToUsers?.length > 0 && (
              <div className="text-muted">
                {data?.publishToUsers.slice(0, SHOWMORE_SIZE).map((a) => (
                  <Tag color="blue" key={a}>
                    {a}
                  </Tag>
                ))}
                {data?.publishToUsers.length > SHOWMORE_SIZE && (
                  <span className="display-more">
                    {data?.publishToUsers.slice(SHOWMORE_SIZE).map((a) => (
                      <Tag color="blue" key={a}>
                        {a}
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
              </div>
            )}
          </Space>

          {data?.receiverConfirmable && (
            <Space align="center">
              <i className="fe fe-check-circle" />
              <span>Trạng thái</span>
              {!data?.receiverConfirmDate && (
                <Button
                  type="link"
                  href={`/documents/${data?.id}/view?receiver=1`}
                  target="_blank"
                >
                  <span className="ant-badge-status-dot ant-badge-status-processing" />{" "}
                  Chưa xác nhận (click để xác nhận)
                </Button>
              )}
              {data?.receiverConfirmDate && (
                <>
                  <Badge
                    status="success"
                    text={`Đã xác nhận vào ${moment(
                      data?.receiverConfirmDate
                    ).format(FORMAT_DATETIME)} `}
                  />

                  <Button
                    type="link"
                    href={`/documents/${data?.id}/view?receiver=1`}
                    target="_blank"
                  >
                    (Xem chi tiết)
                  </Button>
                </>
              )}
            </Space>
          )}
        </Space>
      </List.Item>
    </List>
  );
};

export default TableCellDocument;
