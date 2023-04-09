import { Modal } from "antd";
import { useIdleTimer } from "react-idle-timer";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "store/userSlice";
import moment from "moment";
import _ from "lodash";

const IdleTimer = () => {
  const [isPrompted, setIsPrompted] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const dispatch = useDispatch();

  const timeout = 1000 * 60 * 30; // 30 minutes
  const promptTimeout = 1000 * 60 * 60; // 1 hour

  const onIdle = () => {
    console.log("User is idle");
    dispatch(logoutUser());
  };

  const onActive = () => {
    console.log("User is active");
  };

  const onPrompt = () => {
    console.log("Idle is promted");
    setIsPrompted(true);
  };

  const { reset, pause, resume, getRemainingTime, getTotalIdleTime } =
    useIdleTimer({
      timeout,
      promptTimeout,
      debounce: 500,
      startOnMount: true,
      crossTab: true,
      onIdle,
      onActive,
      onPrompt,
    });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  const displayTime = () => {
    const time = moment.duration(remaining, "milliseconds");
    const hours = time.hours();
    const minutes = time.minutes();
    const seconds = time.seconds();

    return `${_.padStart(hours, 2, "0")}:${_.padStart(
      minutes,
      2,
      "0"
    )}:${_.padStart(seconds, 2, "0")}`;
  };

  return (
    <Modal
      title="Bạn đang không hoạt động"
      centered
      open={isPrompted}
      okText={remaining <= 0 ? "Đăng xuất" : "Hoạt động trở lại"}
      onOk={() => {
        if (remaining <= 0) {
          dispatch(logoutUser());
        } else {
          reset();
          setIsPrompted(false);
        }
      }}
      cancelButtonProps={{ style: { display: "none" } }}
      closable={false}
    >
      <p>
        Hệ thống nhận thấy bạn không có hoạt động nào gần đây. Để bảo mật, hệ
        thống sẽ tự động đăng xuất sau:
      </p>
      <p style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
        {displayTime()}
      </p>
    </Modal>
  );
};

export default IdleTimer;
