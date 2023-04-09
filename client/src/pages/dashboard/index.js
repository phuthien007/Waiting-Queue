import { useEffect } from "react";
import { Carousel } from "antd";
// import { useGetSlideConfig } from "@api/manage";
import { Helmet } from "react-helmet";
import { FILE_EXPORT } from "services/utils/File";

const DashboardAlpha = () => {
  const onChange = () => {};
  // const { refetch: getAllSlide, data: allSlides } = useGetSlideConfig({
  //   query: { enabled: false },
  // });

  // useEffect(() => {
  //   getAllSlide();
  // }, [getAllSlide]);

  return (
    <>
      <Helmet title="Trang chủ" />
      <Carousel autoplay afterChange={onChange}>
        {/* {allSlides?.map((slide) => (
          <div key={slide.id}>
            <img
              style={{ objectFit: "fill", width: "100%", height: "100%" }}
              src={`${FILE_EXPORT["slide-resource"]}${slide.downloadUrl}`}
              alt="alt"
              width="100%"
            />
          </div>
        ))} */}
      </Carousel>
    </>
  );
};

export default DashboardAlpha;
