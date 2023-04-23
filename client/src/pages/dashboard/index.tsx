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
SwiperCore.use([Autoplay]);

const DashboardAlpha: FC = () => {
  const onChange = () => {};

  return (
    <>
      <Helmet title="Trang chủ" />
      <StatisticCard />
      <Divider>
        <span style={{ fontSize: 22 }}> Danh sách sự kiện gần đây </span>
      </Divider>
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
        {Array.from({ length: 5 }).map((item, index) => {
          return (
            <SwiperSlide key={index}>
              {" "}
              <EventCard title={`Sự kiện ${index}`} />{" "}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default DashboardAlpha;
