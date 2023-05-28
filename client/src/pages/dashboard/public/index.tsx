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
import {
  EnrollQueueDto,
  EnrollQueuesControllerUpdateStatusEnrollQueueStatus,
} from "@api/waitingQueue.schemas";
import EnrollQueuePublicCard from "components/dashboard/EnrollQueuePublicCard";

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
      500, 500,
    ]);
  } catch (error) {
    console.log("er", error);
  }
  // }
};

function compareByStatus(a, b) {
  const statusOrder = {
    serving: 0,
    pending: 1,
    done: 2,
  };

  const statusA = a.status.toLowerCase();
  const statusB = b.status.toLowerCase();

  const orderA = statusOrder[statusA];
  const orderB = statusOrder[statusB];

  if (orderA < orderB) {
    return -1;
  }
  if (orderA > orderB) {
    return 1;
  }
  return 0;
}

const PublicDashboard = () => {
  const [data, setData] = React.useState<EnrollQueueDto[]>([]);
  const { isFetching, refetch } =
    useEnrollQueuesControllerFindAllMyEnrollQueue();

  useEffect(() => {
    refetch().then((res) => {
      setData((prev) => {
        // check prev data and new data is same status
        // lọc các phần tử trước đó có status là pending và sau đó có status là serving
        const filterData = res.data.filter((item) => {
          const prevItem = prev?.find((prevItem) => prevItem.id === item.id);
          if (
            prevItem?.status ===
              EnrollQueuesControllerUpdateStatusEnrollQueueStatus.pending &&
            item.status ===
              EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving
          ) {
            //
            return true;
          } else {
            return false;
          }
        });
        if (filterData.length > 0) {
          // có phần tử thỏa mãn điều kiện
          // show notification rung điện thoại
          vibrateMobile();
        }

        // get new data to check have serving data
        const newData = res.data.filter(
          (item) => !prev?.map((imap) => imap.id).includes(item.id)
        );
        if (newData.length > 0) {
          vibrateMobile();
          // có phần tử thỏa mãn điều kiện
          // show notification rung điện thoại
        }

        return res.data;
      });
    });
    const intervalEnrollQueue = setInterval(() => {
      refetch().then((res) => {
        setData((prev) => {
          // check prev data and new data is same status
          // lọc các phần tử trước đó có status là pending và sau đó có status là serving
          const filterData = res.data.filter((item) => {
            const prevItem = prev?.find((prevItem) => prevItem.id === item.id);
            if (
              prevItem?.status ===
                EnrollQueuesControllerUpdateStatusEnrollQueueStatus.pending &&
              item.status ===
                EnrollQueuesControllerUpdateStatusEnrollQueueStatus.serving
            ) {
              //
              return true;
            } else {
              return false;
            }
          });
          if (filterData.length > 0) {
            // có phần tử thỏa mãn điều kiện
            // show notification rung điện thoại
            vibrateMobile();
          }

          // get new data to check have serving data
          const newData = res.data.filter(
            (item) => !prev?.map((imap) => imap.id).includes(item.id)
          );
          if (newData.length > 0) {
            vibrateMobile();
            // có phần tử thỏa mãn điều kiện
            // show notification rung điện thoại
          }

          // check rung trước đó 5 phút
          const filterDataBefore5Min = res.data.filter((item) => {
            if (
              item.status ===
              EnrollQueuesControllerUpdateStatusEnrollQueueStatus.pending
            ) {
              const now = new Date();
              const enrollTime = new Date(item.enrollTime);
              const diff = enrollTime.getTime() - now.getTime();
              if (diff <= 5 * 60 * 1000) {
                return true;
              }
            }
            return false;
          });

          if (filterDataBefore5Min.length > 0) {
            vibrateMobile();
            // có phần tử thỏa mãn điều kiện
            // show notification rung điện thoại
          }

          return res.data;
        });
      });
    }, 3000);
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
          {data?.sort(compareByStatus)?.map((item, index) => {
            return (
              // <div key={index}>
              <EnrollQueuePublicCard key={index} item={item} />
              // </div>
            );
          })}
        </Row>
      </Card>
    </>
  );
};

export default PublicDashboard;
