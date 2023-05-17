import {
  EnrollQueueDto,
  EnrollQueuesControllerUpdateStatusEnrollQueueStatus,
} from "@api/waitingQueue.schemas";
import { Badge, Card, Col, Descriptions, Divider, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import { FORMAT_DATE_MINUTE } from "services/utils/constants";
import {
  StatusEnrollQueueRender,
  StatusEnrollQueueRenderColor,
  StatusQueueRender,
} from "services/utils/format";

interface IEnrollQueuePublicCardProps {
  item: EnrollQueueDto;
}

const EnrollQueuePublicCard: React.FC<IEnrollQueuePublicCardProps> = ({
  item,
}) => {
  return (
    <>
      <Col sm={12} xs={24} md={8} lg={8} xl={8} xxl={8}>
        <Badge.Ribbon
          text={StatusEnrollQueueRender(item?.status)}
          color={StatusEnrollQueueRenderColor(item?.status)}
        >
          <Card
            className={`br-8 ${
              item.status ===
              EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving
                ? "box-shadow-ant"
                : ""
            }`}
            title={
              <Typography.Title level={5} ellipsis>
                Sự kiện: {item?.queue?.event?.name}
              </Typography.Title>
            }
          >
            <Row justify="center">
              <Typography.Title level={1} ellipsis>
                Số {item?.sequenceNumber}
              </Typography.Title>
            </Row>
            <Divider />
            <Row justify="center">
              <Col>
                <Descriptions
                  title={
                    // <Typography.Text ellipsis>
                    `Tên hàng đợi: ${item?.queue?.name}`
                    // </Typography.Text>
                  }
                  column={1}
                >
                  {item?.status ===
                    EnrollQueuesControllerUpdateStatusEnrollQueueStatus.pending && (
                    <>
                      <Descriptions.Item label="Phục vụ trung bình">
                        <b>
                          {(item?.serveTimeAvg &&
                            item?.serveTimeAvg &&
                            item?.serveTimeAvg !== 0 &&
                            item?.serveTimeAvg) + " s" ?? "Chưa có dữ liệu"}
                        </b>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <span>
                            Dự tính được <br /> phục vụ lúc
                          </span>
                        }
                      >
                        <b>
                          {(item?.willEnrollWhen &&
                            moment(item?.willEnrollWhen).format(
                              FORMAT_DATE_MINUTE
                            )) ??
                            "Chưa có dữ liệu"}
                        </b>
                      </Descriptions.Item>
                    </>
                  )}
                  <Descriptions.Item label="Mô tả">
                    {item?.queue?.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái hàng đợi">
                    {StatusQueueRender(item?.queue?.status)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Badge.Ribbon>
      </Col>
    </>
  );
};

export default EnrollQueuePublicCard;
