// service-worker.js
self.addEventListener("push", (event) => {
  console.log("Push Notification received", event);
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.message, // Thông điệp bạn muốn hiển thị trong thông báo
    //   icon: '/path/to/icon.png', // Đường dẫn đến biểu tượng của thông báo
    data: {
      url: data?.url, // Đường dẫn tới trang bạn muốn mở khi người dùng nhấp vào thông báo
    },
  };

  event.waitUntil(self.registration.showNotification("Thông báo mới", options));
});

// Xử lý sự kiện nhấp vào thông báo
self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === "close") {
    notification.close();
  } else {
    // Mở trang được định nghĩa trong dữ liệu của thông báo
    clients.openWindow(notification?.data?.url);
    notification.close();
  }
});
