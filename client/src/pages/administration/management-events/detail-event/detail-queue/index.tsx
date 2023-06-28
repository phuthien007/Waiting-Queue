import { RightCircleOutlined } from "@ant-design/icons";
import {
  useEnrollQueuesControllerFindAllEnrollQueue,
  useEnrollQueuesControllerUpdateStatusEnrollQueue,
  useEventsControllerFindOneEvent,
  useQueuesControllerFindOneQueue,
  useQueuesControllerGetNextEnrollQueue,
  useQueuesControllerGetStatisticQueue,
  useQueuesControllerUpdateQueue,
  useUsersControllerUpdateMe,
} from "@api/waitingQueue";
import {
  EnrollQueueDto,
  EnrollQueuesControllerFindAllEnrollQueueStatus,
  UpdateQueueDto,
  UpdateQueueDtoStatus,
  UpdateUserDtoStatus,
} from "@api/waitingQueue.schemas";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Menu,
  Row,
  Tabs,
  Typography,
} from "antd";
import InformationEventCard from "components/administration/EventForm/InformationEventCard";
import ManagementQueues from "components/administration/EventForm/QueueDataTable";
import ManagementEnrollQueues from "components/administration/QueueForm/EnrollQueueDataTable";
import InformationQueueCard from "components/administration/QueueForm/InformationQueueCard";
import StatisticData from "components/administration/QueueForm/StatisticData";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_PAGE_SIZE,
  STATUS_ENROLL_QUEUE_ENUM,
  STATUS_QUEUE_ENUM,
} from "services/utils/constants";
import { loadCurrentAccount, selectUser } from "store/userSlice";

const DetailEvent = () => {
  const params = useParams();
  const user = useSelector(selectUser);
  const [time, setTime] = useState(0);
  const [currentSerial, setCurrentSerial] = React.useState<EnrollQueueDto>();
  const dispatch = useDispatch();
  const { isLoading: loadingHandleWorking, mutateAsync: updateWorking } =
    useUsersControllerUpdateMe();
  const {
    isLoading: loadingUpdateStatusEnrollQueue,
    mutateAsync: updateStatusEnrollQueue,
  } = useEnrollQueuesControllerUpdateStatusEnrollQueue();
  const { eventId, queueCode } = params;

  const { mutateAsync: updateStatusQueue } = useQueuesControllerUpdateQueue();

  const { refetch: getStatisticQueue, data: dataStatistic } =
    useQueuesControllerGetStatisticQueue(queueCode, {
      query: {
        enabled: false,
      },
    });

  const {
    refetch: getDataEvent,
    isFetching: loadingDataEvent,
    data: dataEvent,
  } = useEventsControllerFindOneEvent(eventId, {
    query: {
      enabled: false,
    },
  });
  const {
    refetch: getDataQueue,
    isFetching: loadingDataQueue,
    data: dataQueue,
  } = useQueuesControllerFindOneQueue(queueCode, {
    query: {
      enabled: false,
    },
  });

  const { isFetching: loadingGetNextUser, refetch: getNextUser } =
    useQueuesControllerGetNextEnrollQueue(queueCode, {
      query: {
        enabled: false,
      },
    });

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600000)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600000) / 60000)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  /**
   * Handle update working
   */
  const handleUpdateWorking = async () => {
    // update status working
    updateWorking({
      data: {
        isWorking: !user?.isWorking,
      },
    }).then(async (res) => {
      if (res) {
        // check
        if (res.isWorking === false) {
          // if have current serial
          if (currentSerial) {
            getStatisticQueue();

            // update status current serial to done
            await updateStatusEnrollQueue({
              id: currentSerial.id,
              params: {
                status: EnrollQueuesControllerFindAllEnrollQueueStatus.done,
              },
            });

            // set current serial to undefined
            setCurrentSerial(undefined);
          }

          // update queue to pending
          await updateStatusQueue({
            queueCode: queueCode,
            data: {
              ...dataQueue,
              status: UpdateQueueDtoStatus.pending,
            } as UpdateQueueDto,
          });
          // update queue to pending
        }

        // reload current account
        dispatch(loadCurrentAccount());
      }
    });
  };

  const handleNextSerial = async () => {
    getStatisticQueue();

    // if have current serial
    if (currentSerial) {
      // update status current serial to done
      await updateStatusEnrollQueue({
        id: currentSerial.id,
        params: {
          status: EnrollQueuesControllerFindAllEnrollQueueStatus.done,
        },
      });
    }

    // get next user
    getNextUser().then((res) => {
      // if have next user
      if (res.data && res.data.id) {
        // set count time
        setTime(0);
        // update status current serial to serving
        setCurrentSerial(res.data);
        // check status queue not serving then update to serving
        if (dataQueue.status !== STATUS_QUEUE_ENUM.SERVING) {
          getDataQueue();
        }
      } else {
        setCurrentSerial(undefined);
        // get new data queue
        getDataQueue();
      }
    });
  };

  const { refetch: getCurrentServing } =
    useEnrollQueuesControllerFindAllEnrollQueue({
      page: 1,
      size: 1,
      queueCode: queueCode,
      status: EnrollQueuesControllerFindAllEnrollQueueStatus.serving,
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    getCurrentServing().then((res) => {
      if (res.data && res.data.data.length > 0) {
        setCurrentSerial(res.data.data[0]);
        setTime(
          res.data.data[0].startServe
            ? moment() - moment(res.data.data[0].startServe)
            : 0
        );
      } else {
        setCurrentSerial(undefined);
      }
    });

    getStatisticQueue();
    const statisticInterval = setInterval(() => {
      getStatisticQueue();
    }, 5000);
    return () => clearInterval(statisticInterval);
  }, []);

  React.useEffect(() => {
    getDataEvent();
    getDataQueue();
  }, [eventId, queueCode]);
  return (
    <>
      <Helmet title="Chi tiết sự kiện" />
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/home">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/event/${eventId}`}>Chi tiết sự kiện</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết hàng đợi</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col
          style={{ display: "flex", alignItems: "stretch" }}
          className="p-2"
          sm={24}
          md={12}
          xl={12}
        >
          <Card loading={loadingDataEvent} title="" className="mt-2 br-8">
            <InformationEventCard data={dataEvent} />
          </Card>
        </Col>
        <Col
          style={{ display: "flex", alignItems: "stretch" }}
          className="p-2"
          sm={24}
          md={12}
          xl={12}
        >
          <Card loading={loadingDataQueue} title="" className="mt-2 br-8">
            <InformationQueueCard data={dataQueue} />
          </Card>
        </Col>
      </Row>

      <Divider />
      <Row>
        {/* <Col span={24}> */}
        <StatisticData dataStatistic={dataStatistic} />
        {/* </Col> */}
      </Row>
      {user?.isWorking && (
        <Row justify="center" gutter={[20, 20]}>
          {/* // render card to display a number current serving */}
          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              justifySelf: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            sm={24}
            xs={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
          >
            {/* <Card className="br-8" title="Thời gian phục vụ"> */}
            <Typography.Title level={4}>Thời gian phục vụ:</Typography.Title>
            {currentSerial?.sequenceNumber && formatTime(time)}
            {/* </Card> */}
          </Col>
          <Col>
            <Card
              className={`br-8  ${
                currentSerial?.sequenceNumber ? "box-shadow-ant" : ""
              }`}
            >
              <Typography.Title
                level={1}
                style={{ fontSize: "5.5em", marginBottom: 0 }}
              >
                {currentSerial?.sequenceNumber || 0}
              </Typography.Title>
            </Card>
          </Col>
          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              justifySelf: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            sm={24}
            xs={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
          >
            <Button
              loading={loadingGetNextUser || loadingUpdateStatusEnrollQueue}
              style={{ width: "50%" }}
              type="primary"
              onClick={handleNextSerial}
              icon={<RightCircleOutlined style={{ fontSize: 15 }} />}
            >
              Tiếp theo
            </Button>
          </Col>
        </Row>
      )}
      <Divider />
      {user?.isWorking ? (
        <Button onClick={handleUpdateWorking} loading={loadingHandleWorking}>
          Dừng làm việc
        </Button>
      ) : (
        <Button
          onClick={handleUpdateWorking}
          loading={loadingHandleWorking}
          type="primary"
        >
          Bắt đầu làm việc
        </Button>
      )}
      <Card title="Danh sách người đợi" className="mt-2 br-8">
        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab="Tất cả" key="1">
            <ManagementEnrollQueues status="" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đang chờ" key="2">
            <ManagementEnrollQueues status={STATUS_ENROLL_QUEUE_ENUM.PENDING} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đã xong" key="3">
            <ManagementEnrollQueues status={STATUS_ENROLL_QUEUE_ENUM.DONE} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="Đã hủy" key="4">
            <ManagementEnrollQueues
              status={STATUS_ENROLL_QUEUE_ENUM.IS_BLOCKED}
            />
          </Tabs.TabPane> */}
        </Tabs>
      </Card>
    </>
  );
};

export default DetailEvent;
