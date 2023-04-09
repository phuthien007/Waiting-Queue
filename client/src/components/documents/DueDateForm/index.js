import { useDueDateDocument } from "@api/document";
import { Button, DatePicker, Modal } from "antd";
import moment from "moment";
import { useState } from "react";

const DueDateForm = ({ id, refetchDetailDocument, style }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState();
  const showModal = () => {
    setDate();
    setIsModalOpen(true);
  };

  const { isLoading, mutateAsync } = useDueDateDocument();
  const handleOk = () => {
    mutateAsync({ id, data: { dueDate: moment(date._d).toISOString() } })
      .then(() => {
        refetchDetailDocument();
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button style={style} onClick={showModal} type="primary">
        Hạn hoàn thành
      </Button>
      <Modal
        title="Ngày hoàn thành"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={isLoading}
        onCancel={handleCancel}
        okText={
          <>
            <i className="fe fe-check-circle" /> Gửi{" "}
          </>
        }
        cancelText={
          <>
            <i className="fe fe-trash" /> Hủy{" "}
          </>
        }
      >
        <DatePicker
          style={{ width: "100%" }}
          value={date}
          onChange={(e) => setDate(e)}
        />
      </Modal>
    </>
  );
};
export default DueDateForm;
