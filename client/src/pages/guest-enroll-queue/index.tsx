import { useEnrollQueuesControllerCreateEnrollQueue } from "@api/waitingQueue";
import { notification } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const GuestEnrollQueue = () => {
  // get query search from url
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("q");
  const t = new URLSearchParams(search).get("t");
  const h = new URLSearchParams(search).get("h");

  const navigate = useNavigate();

  const { isLoading, mutateAsync, isSuccess } =
    useEnrollQueuesControllerCreateEnrollQueue();

  useEffect(() => {
    // console.log("q", q);

    if (
      !q ||
      q === "" ||
      q.length === 0 ||
      !h ||
      h === "" ||
      h.length === 0 ||
      !t ||
      t === "" ||
      t.length === 0
    ) {
      navigate("/");
    } else {
      mutateAsync({
        data: {
          queueCode: q,
          note: "Có người mới tham gia hàng đợi",
        },
        params: {
          h: h,
          uxTime: t,
          q: q,
        },
      });
    }
  }, [q]);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: "Thành công",
        description: "Bạn đã quét mã thành công",
      });
      navigate(`/`);
    }
  }, [isSuccess]);

  return <>{isLoading && <div>Loading...</div>}</>;
};

export default GuestEnrollQueue;
