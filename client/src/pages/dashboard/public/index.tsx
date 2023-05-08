import React, { useEffect } from "react";
import { Badge, Card, Col, Descriptions, Divider, Row, Typography } from "antd";
import { useEnrollQueuesControllerFindAllMyEnrollQueue } from "@api/waitingQueue";
import Title from "antd/lib/skeleton/Title";
import {
  StatusEnrollQueueRender,
  StatusEnrollQueueRenderColor,
  StatusQueueRender,
} from "services/utils/format";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

const PublicDashboard = () => {
  const { isFetching, refetch, data } =
    useEnrollQueuesControllerFindAllMyEnrollQueue();

  useEffect(() => {
    const intervalEnrollQueue = setInterval(() => {
      refetch();
    }, 1000);
    return () => {
      clearInterval(intervalEnrollQueue);
    };
  }, []);

  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <Row justify="center">
          {data && data?.length > 0 && (
            <Typography.Title level={2}>
              Danh sách số thứ tự chờ của bạn
            </Typography.Title>
          )}
        </Row>
        <Row justify="center" gutter={[20, 20]}>
          {data?.map((item) => {
            return (
              <Col sm={12} xs={24} md={8} lg={8} xl={6} xxl={6}>
                <Badge.Ribbon
                  text={StatusEnrollQueueRender(item.status)}
                  color={StatusEnrollQueueRenderColor(item.status)}
                >
                  <Card
                    className="br-8"
                    title={
                      <Typography.Title level={5} ellipsis>
                        Sự kiện: {item.queue.event.name}
                      </Typography.Title>
                    }
                  >
                    <Row justify="center">
                      <Typography.Title level={1} ellipsis>
                        Số {item.sequenceNumber}
                      </Typography.Title>
                    </Row>
                    <Divider />
                    <Row justify="center">
                      <Descriptions
                        title={
                          // <Typography.Title level={5} ellipsis>
                          `Tên hàng đợi: ${item.queue.name}`
                          // </Typography.Title>
                        }
                        column={1}
                      >
                        <Descriptions.Item label="Mô tả">
                          {item.queue.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái hàng đợi">
                          {StatusQueueRender(item.queue.status)}
                        </Descriptions.Item>
                      </Descriptions>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>
      </Card>
    </>
  );
};

export default PublicDashboard;
