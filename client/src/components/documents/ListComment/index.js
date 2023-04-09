/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, Button, List, Row, Tag, Tooltip } from "antd";
import moment from "moment";
import { DocumentCommentStatusRender } from "services/utils/format";
import {
  DB_DOCUMENT_STATUS_RELEASE,
  FORMAT_DATE,
  FORMAT_DATETIME,
  SHOWMORE_SIZE,
} from "services/utils/constants";
import { Element } from "react-scroll";
import FileList from "../DocumentForm/FilesList";

const ListComment = ({
  data,
  listChooseFile,
  setListChooseFile,
  publishData,
}) => (
  <List
    // loading={loadingGetComment}
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item key={item?.id}>
        <List.Item.Meta
          avatar={
            <Avatar
              style={{ color: "white", backgroundColor: "rgb(119 207 71)" }}
            >
              {item?.sender?.fullName[0]}
            </Avatar>
          }
          title={
            <Element name={`comment-${item?.id}`}>
              <b>{item?.sender?.fullName} </b>
              <small className="ml-2">
                {moment(item?.createDate).from(moment().add(1, "seconds"))}
              </small>
            </Element>
          }
          description={
            <>
              {Math.abs(item?.id) === item?.status ? (
                DocumentCommentStatusRender(item?.status)
              ) : (
                <p> {item?.content}</p>
              )}

              {item?.dueDate && (
                <Tooltip title="Hạn hoàn thành">
                  <Tag color="blue">
                    <i className="fe fe-clock" />{" "}
                    {moment(item?.dueDate).format(FORMAT_DATE)}
                  </Tag>
                </Tooltip>
              )}
              {item?.status === DB_DOCUMENT_STATUS_RELEASE ? (
                <>
                  <h5 className="mt-3 mb-2">Thông tin phát hành</h5>
                  <p className="mb-2">
                    <i className="fe fe-align-left mr-2" />
                    Tên phát hành: {publishData?.publishName}
                  </p>
                  <p className="mb-2">
                    <i className="fe fe-info mr-2" />
                    Mô tả: {publishData?.publishDescription}
                  </p>
                  {publishData?.userHasA1Role && (
                    <div style={{ width: "100%" }} className="tag-fl">
                      <div>
                        <Row className="mb-2">
                          <i
                            className="fa fa-calendar-plus-o mr-2"
                            style={{ marginTop: "2px" }}
                          />
                          <span>Đơn vị nhận</span> (
                          {
                            publishData?.publishToReceivers.filter(
                              (u) => u?.confirmDate
                            )?.length
                          }
                          /{publishData?.publishToReceivers?.length}):
                          {publishData?.publishToReceivers
                            ?.slice(0, SHOWMORE_SIZE)
                            .map((a) => (
                              <Tooltip
                                placement="top"
                                title={
                                  a?.confirmDate
                                    ? moment(a?.confirmDate).format(
                                        FORMAT_DATETIME
                                      )
                                    : "Chưa xác nhận"
                                }
                                key={a?.id}
                              >
                                <Tag
                                  className="ml-2"
                                  color={a?.confirmDate ? "#87d068" : "magenta"}
                                >
                                  {a?.fullName}
                                </Tag>
                              </Tooltip>
                            ))}
                          {publishData?.publishToReceivers?.length >
                            SHOWMORE_SIZE && (
                            <span className="display-more">
                              {publishData?.publishToReceivers
                                ?.slice(SHOWMORE_SIZE)
                                .map((a) => (
                                  <Tooltip
                                    placement="top"
                                    key={a?.id}
                                    title={
                                      a?.confirmDate
                                        ? moment(a?.confirmDate).format(
                                            FORMAT_DATETIME
                                          )
                                        : "Chưa xác nhận"
                                    }
                                  >
                                    <Tag
                                      color={
                                        a?.confirmDate ? "#87d068" : "magenta"
                                      }
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
                                  e.currentTarget.parentNode.classList.add(
                                    "show"
                                  );
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
                                  e.currentTarget.parentNode.classList.remove(
                                    "show"
                                  );
                                }}
                                title="Thu gọn"
                              >
                                <i className="fe fe-chevrons-up" />
                              </a>
                            </span>
                          )}
                        </Row>
                      </div>
                    </div>
                  )}
                  <div span={24}>
                    <Row className="mb-3">
                      <i
                        className="fe fe-user-plus mr-2"
                        style={{ marginTop: "2px" }}
                      />
                      <span>Tài khoản được chia sẻ: </span>

                      {publishData?.publishToUsers
                        ?.slice(0, SHOWMORE_SIZE)
                        .map((a) => (
                          <Tag className="ml-2 h-auto" color="blue" key={a?.id}>
                            {a?.fullName}
                          </Tag>
                        ))}
                      {publishData?.publishToUsers?.length > SHOWMORE_SIZE && (
                        <span className="display-more">
                          {data?.publishToUsers
                            ?.slice(SHOWMORE_SIZE)
                            .map((a) => (
                              <Tag className="ml-2" key={a?.id}>
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
                              e.currentTarget.parentNode.classList.remove(
                                "show"
                              );
                            }}
                            title="Thu gọn"
                          >
                            <i className="fe fe-chevrons-up" />
                          </Button>
                        </span>
                      )}
                      <span style={{ visibility: "hidden" }}>hidden</span>
                    </Row>
                  </div>
                </>
              ) : null}
              {item?.files && (
                <FileList
                  type="detail"
                  statusDocument={publishData?.status}
                  listChooseFile={listChooseFile}
                  setListChooseFile={setListChooseFile}
                  ListFileData={item?.files}
                  documentId={item?.id}
                />
              )}
            </>
          }
        />
      </List.Item>
    )}
  />
);

export default ListComment;
