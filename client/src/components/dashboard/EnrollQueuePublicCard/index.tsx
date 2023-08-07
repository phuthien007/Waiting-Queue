import {
  EnrollQueueDto,
  EnrollQueuesControllerFindAllEnrollQueueStatus,
  EnrollQueuesControllerUpdateStatusEnrollQueueStatus,
} from "@api/waitingQueue.schemas";
import {
  Alert,
  Badge,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Typography,
} from "antd";
import _ from "lodash";
import moment from "moment";
import React from "react";
import addNotification from "react-push-notification";
import {
  FORMAT_DATE_MINUTE,
  STATUS_ENROLL_QUEUE_ENUM,
  STATUS_QUEUE_ENUM,
} from "services/utils/constants";
import {
  StatusEnrollQueueRender,
  StatusEnrollQueueRenderColor,
  StatusQueueRender,
} from "services/utils/format";
import Marquee from "react-fast-marquee";

interface IEnrollQueuePublicCardProps {
  item: EnrollQueueDto;
  dataList: EnrollQueueDto[];
}

const vibrateMobile = () => {
  // if (navigator.vibrate) {
  navigator.vibrate =
    navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    navigator.msVibrate;
  try {
    navigator.vibrate([
      500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500,
      500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500,
      500, 500, 500, 500,
    ]);
  } catch (error) {
    console.log("er", error);
  }
  // }
};

const sendPushNotification = async (message, url) => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.ready;

    const options = {
      body: message,
      // icon: '/path/to/icon.png',
      data: {
        url: url, // Đường dẫn tới trang bạn muốn mở khi người dùng nhấp vào thông báo
      },
      actions: [
        { action: "open", title: "Mở ứng dụng" },
        { action: "close", title: "Đóng" },
      ],
    };

    registration.showNotification("Thông báo mới", options);
  }
};

const EnrollQueuePublicCard: React.FC<IEnrollQueuePublicCardProps> = ({
  item,
  dataList,
}) => {
  React.useCallback(() => {
    if (
      // queue ở trạng thái chờ hoặc đang phục vụ và số được gọi là số tiếp theo của queue
      (item?.queue?.status === STATUS_QUEUE_ENUM.WAITING ||
        item?.queue?.status === STATUS_QUEUE_ENUM.PENDING) &&
      item.currentQueue + 1 === item.sequenceNumber
    ) {
      console.log("vibrate");
      vibrateMobile();
      // pushMessage(`
      // Số ${item.sequenceNumber} tại hàng đợi ${item.queue.name} đã sắp đến lượt, vui lòng trở lại phòng chờ để tiếp tục chờ đợi
      // `);
      sendPushNotification(
        `
Số ${item.sequenceNumber} tại hàng đợi ${item.queue.name} đã sắp đến lượt, vui lòng trở lại phòng chờ để tiếp tục chờ đợi
`,
        process.env.REACT_APP_PUBLIC_URL + "/public/home"
      );
    }
  }, [dataList]);

  const pushMessage = (message) => {
    addNotification({
      title: "Thông báo",
      message,
      theme: "darkblue",
      native: true, // when using native, your OS will handle theming.
    });
  };

  return (
    <>
      <Col sm={12} xs={24} md={8} lg={8} xl={8} xxl={8}>
        {(item?.queue?.status === STATUS_QUEUE_ENUM.WAITING ||
          item?.queue?.status === STATUS_QUEUE_ENUM.PENDING) &&
        item.currentQueue + 1 === item.sequenceNumber ? (
          <Alert
            message={
              <Marquee pauseOnHover gradient={false}>
                {`  Số thứ tự của bạn tại "${item.queue.name}" đã sắp đến, vui lòng trở lại phòng chờ để tiếp tục chờ đợi !   `}
              </Marquee>
            }
            banner
          />
        ) : null}
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
                    <>
                      <p>Tên hàng đợi: {item?.queue?.name}</p>

                      {(item?.queue?.status === STATUS_QUEUE_ENUM.WAITING ||
                        item?.queue?.status === STATUS_QUEUE_ENUM.PENDING) &&
                        item.status === STATUS_ENROLL_QUEUE_ENUM.PENDING && (
                          <p>Hiện tại đến số : {item?.currentQueue}</p>
                        )}
                    </>
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
                            Math.floor(
                              _.toSafeInteger(item?.serveTimeAvg) / 60
                            )) + " phút" ?? "Chưa có dữ liệu"}
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
