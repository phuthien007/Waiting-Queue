import { Avatar, Descriptions, List } from "antd";
import moment from "moment";
import { TicketCommentStatusRender } from "services/utils/format";
import { Element } from "react-scroll";
import TextArea from "antd/lib/input/TextArea";
import FileList from "../FormTicket/FilesList";
// import FileList from 'components/documents/DocumentForm/FilesList'

const ListComment = ({ data, loadingGetComment }) => (
  <List
    loading={loadingGetComment}
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item id={`#comment-${item?.id}`} key={`#comment-${item?.id}`}>
        <List.Item.Meta
          avatar={
            <Avatar
              style={{ color: "white", backgroundColor: "rgb(119 207 71)" }}
            >
              {item?.user?.fullName[0]}{" "}
            </Avatar>
          }
          title={
            <Element name={`comment-${item?.id}`}>
              <b>{item?.user?.fullName}</b>{" "}
              <small className="ml-2">
                {moment(item?.createDate)
                  .from(moment().add(1, "seconds"))}
              </small>
            </Element>
          }
          description={
            <>
              {/* {item?.files && (
                <FileList type="detail" ListFileData={item?.files} documentId={item?.id} />
              )} */}

              {item?.executor ? (
                TicketCommentStatusRender(item?.contents)
              ) : (
                <div>
                  {" "}
                  {item?.contents?.split(/[\r\n]+/).map((line) => (
                    <div>{line}</div>
                  ))}{" "}
                </div>
              )}

              {item?.ticketAttachFiles && (
                <FileList
                  type="detail"
                  ListFileData={item?.ticketAttachFiles}
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
