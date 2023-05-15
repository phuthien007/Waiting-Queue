import React, { FC, useEffect } from "react";
import { Carousel, Divider } from "antd";
// import { useGetSlideConfig } from "@api/manage";
import { Helmet } from "react-helmet";
import { FILE_EXPORT } from "services/utils/File";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import SwiperCore, { Autoplay } from "swiper";
import StatisticCard from "components/dashboard/StatisticCard";
import EventCard from "components/dashboard/EventCard";
import Title from "antd/lib/typography/Title";
import {
  useEventsControllerFindAllEvent,
  useEventsControllerFindAllEventUserCanSee,
  useQueuesControllerCountFindAllQueue,
  useQueuesControllerCountFindAllQueueUserCanSee,
} from "@api/waitingQueue";
import { useSelector } from "react-redux";
import { selectUser } from "store/userSlice";
SwiperCore.use([Autoplay]);

const DashboardAlpha: FC = () => {
  const [data, setData] = React.useState([]);
  const { role } = useSelector(selectUser);
  const onChange = () => {};
  const {
    refetch: getAllMyEvent,
    isFetching: loadingMyData,
    data: myEvent,
  } = useEventsControllerFindAllEventUserCanSee({
    page: 1,
    size: 5,
  });
  const {
    refetch: getAllEvent,
    isFetching: loadingData,
    data: dataEvent,
  } = useEventsControllerFindAllEvent({
    page: 1,
    size: 5,
    sort: "id:DESC",
  });

  const { refetch: getAllQueue, data: dataQueue } =
    useQueuesControllerCountFindAllQueue();

  useEffect(() => {
    if (role === "ADMIN") setData(dataEvent?.data);
    else if (role === "OPERATOR") setData(myEvent?.data);
    else setData([]);
  }, [dataEvent, myEvent]);

  useEffect(() => {
    if (role === "ADMIN") {
      getAllEvent();
      getAllQueue();
    } else if (role === "OPERATOR") {
      getAllMyEvent();
    }
  }, []);

  return (
    <>
      <Helmet title="Trang chủ" />

      <StatisticCard
        role={role}
        totalEvent={
          role === "ADMIN"
            ? dataEvent?.pagination?.total
            : myEvent?.pagination?.total
        }
        totalQueue={dataQueue}
      />
      <Divider>
        <span style={{ fontSize: 22 }}> Danh sách sự kiện gần đây </span>
      </Divider>
      {data?.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <Title level={4}>Không có sự kiện nào</Title>
        </div>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={
            {
              // when window width is >= 640px
              0: {
                slidesPerView: 1,
              },
              580: {
                slidesPerView: 2,
              },
              // when window width is >= 768px
              890: {
                slidesPerView: 3,
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            } as any
          }
          modules={[Navigation, Scrollbar, A11y]}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          autoplay
          scrollbar={{ draggable: true }}
        >
          {data?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                {" "}
                <EventCard data={item} />{" "}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </>
  );
};

export default DashboardAlpha;
