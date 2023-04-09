/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dropdown, Menu, Popconfirm, Tabs } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { EllipsisOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import style from "./style.module.scss";

const { TabPane } = Tabs;

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <Link rel="noopener noreferrer" to="#">
            <i className="fe fe-align-justify mr-2" /> Tất cả thông báo
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link rel="noopener noreferrer" to="#">
            <i className="fe fe-check mr-2" /> Đánh dấu tất cả đã đọc
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link
            rel="noopener noreferrer"
            to="/personal-user/setting-notifications"
          >
            <i className="fe fe-settings mr-2" /> Cài đặt thông báo
          </Link>
        ),
      },
    ]}
  />
);

const List2 = () => {
  const OperationsSlot = {
    right: (
      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <EllipsisOutlined
          style={{
            cursor: "pointer",
            marginRight: 18,
            fontSize: 30,
          }}
        />
      </Dropdown>
    ),
  };
  return (
    <div>
      <Tabs
        tabBarExtraContent={OperationsSlot}
        title="Thông báo"
        className={`${style.tabs} kit-tabs-bordered`}
        defaultActiveKey="1"
      >
        <TabPane
          tab="Tất cả thông báo"
          key="1"
          style={{ height: 350, paddingRight: 0 }}
        >
          <PerfectScrollbar>
            <div className="text-gray-6">
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className={style.head}>
                    <p className={style.title}>
                      Văn bản được phát hành
                      <strong className="text-black"> Văn bản số 1</strong>
                    </p>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                      <EllipsisOutlined
                        className={style.time}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          marginRight: 18,
                        }}
                      />
                    </Dropdown>
                  </div>
                  <p>Văn bản đã được phát hành</p>
                  <time className={style.time}>5 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p style={{ color: "#c5bebe" }} className={style.title}>
                      Cập nhật trạng thái ticket:
                      <strong style={{ color: "#c5bebe" }}> Từ chối</strong>
                    </p>
                  </div>
                  <p style={{ color: "#c5bebe" }}>Ticket số 5 đã được xử lý</p>
                  <time className={style.time}>15 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p className={style.title}>
                      Văn bản được phát hành
                      <strong className="text-black"> Văn bản số 1</strong>
                    </p>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                      <EllipsisOutlined
                        className={style.time}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          marginRight: 18,
                        }}
                      />
                    </Dropdown>
                  </div>
                  <p>Văn bản đã được phát hành</p>
                  <time className={style.time}>5 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p style={{ color: "#c5bebe" }} className={style.title}>
                      Cập nhật trạng thái ticket:
                      <strong style={{ color: "#c5bebe" }}> Từ chối</strong>
                    </p>
                  </div>
                  <p style={{ color: "#c5bebe" }}>Ticket số 5 đã được xử lý</p>
                  <time className={style.time}>15 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p style={{ color: "#c5bebe" }} className={style.title}>
                      Cập nhật trạng thái ticket:
                      <strong style={{ color: "#c5bebe" }}> Từ chối</strong>
                    </p>
                  </div>
                  <p style={{ color: "#c5bebe" }}>Ticket số 5 đã được xử lý</p>
                  <time className={style.time}>15 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p style={{ color: "#c5bebe" }} className={style.title}>
                      Cập nhật trạng thái ticket:
                      <strong style={{ color: "#c5bebe" }}> Từ chối</strong>
                    </p>
                  </div>
                  <p style={{ color: "#c5bebe" }}>Ticket số 5 đã được xử lý</p>
                  <time className={style.time}>15 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p className={style.title}>
                      Văn bản được phát hành
                      <strong className="text-black"> Văn bản số 1</strong>
                    </p>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                      <EllipsisOutlined
                        className={style.time}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          marginRight: 18,
                        }}
                      />
                    </Dropdown>
                  </div>
                  <p>Văn bản đã được phát hành</p>
                  <time className={style.time}>5 phút trước</time>
                </li>
              </ul>
            </div>
          </PerfectScrollbar>
        </TabPane>
        <TabPane tab="Chưa đọc" key="2" style={{ height: 350 }}>
          <PerfectScrollbar>
            <div className="text-gray-6">
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className={style.head}>
                    <p className={style.title}>
                      Văn bản được phát hành
                      <strong className="text-black"> Văn bản số 1</strong>
                    </p>
                    <Popconfirm placement="bottomRight" title="Đánh dấu đã đọc">
                      <EllipsisOutlined
                        className={style.time}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          marginRight: 18,
                        }}
                      />
                    </Popconfirm>
                  </div>
                  <p>Văn bản đã được phát hành</p>
                  <time className={style.time}>5 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p className={style.title}>
                      Văn bản được phát hành
                      <strong className="text-black"> Văn bản số 1</strong>
                    </p>
                    <Popconfirm placement="bottomRight" title="Đánh dấu đã đọc">
                      <EllipsisOutlined
                        className={style.time}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          marginRight: 18,
                        }}
                      />
                    </Popconfirm>
                  </div>
                  <p>Văn bản đã được phát hành</p>
                  <time className={style.time}>5 phút trước</time>
                </li>
                <hr style={{ marginRight: 15 }} />
                <li className="mb-3">
                  <div className={style.head}>
                    <p className={style.title}>
                      Văn bản được phát hành
                      <strong className="text-black"> Văn bản số 1</strong>
                    </p>
                    <Popconfirm placement="bottomRight" title="Đánh dấu đã đọc">
                      <EllipsisOutlined
                        className={style.time}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          marginRight: 18,
                        }}
                      />
                    </Popconfirm>
                  </div>
                  <p>Văn bản đã được phát hành</p>
                  <time className={style.time}>5 phút trước</time>
                </li>
              </ul>
            </div>
          </PerfectScrollbar>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default List2;
