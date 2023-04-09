import { Descriptions, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { TicketStatusRender } from "services/utils/format";

const TableCellTicket = ({ data }) => {
  return (
    <Descriptions column={1} title={`${data?.name}`}>
      <Descriptions.Item
        label={
          <Space>
            <i className="fe fe-check-circle" />
            <span>Trạng thái</span>
          </Space>
        }
      >
        {TicketStatusRender(data?.status)}
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <Space>
            <i className="fe fe-user" />
            <span>Tài khoản tạo</span>
          </Space>
        }
      >
        {data?.createBy}
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <Space>
            <i className="fa fa-building-o" />
            <span>Đơn vị</span>
          </Space>
        }
      >
        {data?.user?.agents?.name || "UNKNOWN"}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Space>
            <i className="fe fe-layers" />
            <span>Hệ thống</span>
          </Space>
        }
      >
        {data?.ticketSubSystem?.ticketSystem?.name}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Space>
            <i className="fe fe-layers" />
            <span>Phân hệ con</span>
          </Space>
        }
      >
        {data?.ticketSubSystem?.name}
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <Space>
            <i className="fe fe-align-left" />
            <span>Nội dung</span>
          </Space>
        }
      >
        <div> {data?.content?.split(/[\r\n]+/).map(line => <div>{line}</div>)} </div>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TableCellTicket;
