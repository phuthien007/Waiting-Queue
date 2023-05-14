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
import { EnrollQueuesControllerUpdateStatusEnrollQueueStatus } from "@api/waitingQueue.schemas";
import EnrollQueuePublicCard from "components/dashboard/EnrollQueuePublicCard";

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
      <Row justify="center">
        {data && data?.length <= 0 && (
          <Typography.Title level={4}>
            Bạn chưa tham gia hàng đợi nào
          </Typography.Title>
        )}
      </Row>
      <Card style={{ borderRadius: 5 }}>
        <Row justify="center">
          {data && data?.length > 0 && (
            <Typography.Title level={2}>
              Danh sách số thứ tự chờ của bạn
            </Typography.Title>
          )}
        </Row>
        <Row justify="center" gutter={[20, 20]}>
          {/* sort data follow status serving is top  */}
          {data
            ?.sort((a, b) => {
              if (
                a.status ===
                  EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving &&
                b.status !==
                  EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving
              ) {
                return -1;
              } else if (
                a.status !==
                  EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving &&
                b.status ===
                  EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving
              ) {
                return 1;
              } else if (a.status === b.status) {
                if (a.enrollTime < b.enrollTime) {
                  return -1;
                } else if (a.enrollTime > b.enrollTime) {
                  return 1;
                }
              }
              return 0;
            })
            ?.map((item, index) => {
              return (
                <div key={index}>
                  <EnrollQueuePublicCard item={item} />
                </div>
              );
            })}
        </Row>
      </Card>
    </>
  );
};

export default PublicDashboard;
