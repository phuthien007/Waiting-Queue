export default [
  {
    title: "Trang chủ",
    key: "dashboardAdmin",
    url: "/home",
    icon: "fe fe-home",
    roles: ["A1", "ADMIN", "USER"],
  },
  {
    title: "Văn bản phát hành",
    key: "documentExport",
    url: "/documents/publish",
    icon: "fa fa-bullhorn",
    roles: ["A1", "USER"],
  },
  {
    title: "Văn bản",
    key: "document",
    url: "/documents",
    icon: "fe fe-book",
    roles: ["A1", "USER"],
  },
  {
    category: true,
    title: "Quản trị",
    roles: ["ADMIN"], // set user roles with access to this route
  },
  {
    title: "Quản trị",
    key: "manage",
    icon: "fe fe-briefcase",
    roles: ["ADMIN"], // set user roles with access to this route
    children: [
      {
        title: "Loại văn bản",
        key: "docTypes",
        url: "/manage/doc-types",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "Nhóm văn bản",
        key: "documentGroups",
        url: "/manage/doc-groups",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "Đơn vị",
        key: "agents",
        url: "/manage/agents",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "Tài khoản",
        key: "accounts",
        url: "/manage/users",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "Files",
        key: "files",
        url: "/manage/files",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "E-ticket",
        key: "e-ticket",
        children: [
          {
            title: "Hệ thống",
            key: "systems",
            url: "/manage/e-ticket/systems",
            roles: ["ADMIN"], // set user roles with access to this route
          },
          {
            title: "Phân hệ con",
            key: "sub-system",
            url: "/manage/e-ticket/sub-systems",
            roles: ["ADMIN"], // set user roles with access to this route
          },
        ],
      },
      {
        title: "Cấu hình",
        key: "configurations",
        url: "/manage/configurations",
        roles: ["ADMIN"], // set user roles with access to this route
      },
    ],
  },
  {
    title: "E-ticket",
    key: "ticket",
    url: "/e-ticket",
    icon: "fa fa-tags",
    roles: ["ADMIN"],
  },
  {
    title: "Thống kê",
    key: "reports",
    icon: "fa fa-bar-chart",
    roles: ["ADMIN"], // set user roles with access to this route

    // roles: ['admin'], // set user roles with access to this route
    children: [
      {
        title: "Thống kê gửi",
        key: "reportsSend",
        url: "/reports/send",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "Thống kê nhận",
        key: "reportsReceive",
        url: "/reports/receive",
        roles: ["ADMIN"], // set user roles with access to this route
      },
      {
        title: "Thống kê phản hồi",
        key: "reportscomment",
        url: "/reports/comment",
        roles: ["ADMIN"], // set user roles with access to this route
      },
    ],
  },
];
