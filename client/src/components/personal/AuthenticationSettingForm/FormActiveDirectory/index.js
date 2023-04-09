import { Switch } from "antd";

const FormAD = ({ changeAD, setChangeAD }) => {
  return <Switch checked={changeAD} onChange={(e) => setChangeAD(e)} />;
};
export default FormAD;
