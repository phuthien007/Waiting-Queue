import { Switch } from "antd";

const Form2Factor = ({ changeOT, setChangeOT }) => {
  return <Switch checked={changeOT} onChange={(e) => setChangeOT(e)} />;
};
export default Form2Factor;
