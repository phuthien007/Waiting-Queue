// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from "react";
// import { Badge, Dropdown } from "antd";
// import Notification from "components/notification/Notification";
// import { useCountMyNotifications } from "@api/notification";
// import styles from "./style.module.scss";

// const Actions = () => {
//   const [refreshCount, setRefreshCount] = useState(Math.random());
//   const {
//     refetch: refetchCountMyNotifications,
//     data: numberOfUnreadNotifications,
//   } = useCountMyNotifications();
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     refetchCountMyNotifications();
//   }, [refetchCountMyNotifications, refreshCount]);

//   const menu = (
//     <div className="card cui__utils__shadow width-350 border-0">
//       <div className="card-body p-0">
//         <Notification
//           numberOfUnreadNotifications={numberOfUnreadNotifications}
//           setRefreshCount={setRefreshCount}
//           setOpen={setOpen}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <Dropdown
//       overlay={menu}
//       trigger={["click"]}
//       placement="bottomRight"
//       destroyPopupOnHide
//       overlayStyle={{ zIndex: 1009 }}
//       open={open}
//       onOpenChange={(e) => {
//         setOpen(e);
//         setRefreshCount(Math.random());
//       }}
//     >
//       <Badge count={numberOfUnreadNotifications}>
//         <i className={`${styles.icon} fe fe-bell`} />
//       </Badge>
//     </Dropdown>
//   );
// };

// export default Actions;
