/* eslint-disable no-shadow */
import { useGetStatisticAgents } from "@api/manage";
import { Button, Modal, Tree, Input } from "antd";
import { useMemo, useState, useEffect } from "react";

const { Search } = Input;
const SiteMap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const { refetch, data: dataStatisticAgent } = useGetStatisticAgents({
    query: {
      enabled: false,
    },
  });

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e) => {
    const { value } = e.target;
    const searchVal = value;
    const expandedKeys = dataStatisticAgent
      .map((node) => {
        if (node.name.indexOf(searchVal) > -1) {
          return `${node.id}`;
        }

        if (
          node.children &&
          node.children.some((item) => item.name.indexOf(searchVal) > -1)
        ) {
          return `${node.id}`;
        }

        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(searchVal);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data) =>
      data?.map((item) => {
        const strTitle = item.name;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );

        if (item.children) {
          return {
            title,
            key: `${item.parent || ""}_${item.id}`,
            children: loop(item.children),
          };
        }

        return {
          title,
          key: `${item.parent || ""}_${item.id}`,
        };
      });

    return loop(dataStatisticAgent || []);
  }, [searchValue, dataStatisticAgent]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (isModalOpen) refetch();
  }, [refetch, isModalOpen]);

  return (
    <>
      <Button icon={<i className="fa fa-sitemap mr-2" />} onClick={showModal}>
        Sơ đồ
      </Button>

      <Modal
        footer={null}
        title="Sơ đồ đơn vị hình cây"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Search
            style={{
              marginBottom: 8,
            }}
            placeholder="Tìm kiếm"
            onChange={onChange}
          />
          <Tree
            onExpand={onExpand}
            showLine
            defaultExpandAll
            key={(item) => item.id}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
          />
        </div>
      </Modal>
    </>
  );
};

export default SiteMap;
