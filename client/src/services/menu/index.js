export default [
  {
    title: "Trang chủ",
    key: "dashboardAdmin",
    url: "/home",
    icon: "fe fe-home",
    roles: ["ADMIN", "SUPER ADMIN", "OPERATOR"],
  },

  {
    title: "Danh sách sự kiện",
    key: "management-event",
    url: "/manage/event",
    icon: "fa fa-calendar",
    roles: ["ADMIN", "OPERATOR"],
  },
  {
    title: "Danh sách đối tác",
    key: "management-tenant",
    url: "/manage/tenant",

    icon: "fa fa-building-o",
    roles: ["SUPER ADMIN"],
  },
  {
    title: "Danh sách tài khoản",
    key: "management-account",
    url: "/manage/account",

    icon: "fe fe-users",
    roles: ["ADMIN", "SUPER ADMIN"],
  },
];
