import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import General14 from "components/kit/widgets/General/14";
import { changeSettings, selectSettings } from "store/settingSlice";
import style from "./style.module.scss";

const SupportChat = () => {
  const { isSupportChatOpen } = useSelector(selectSettings);
  const dispatch = useDispatch();
  const toggleSupportChat = () => {
    dispatch(
      changeSettings({
        setting: "isSupportChatOpen",
        value: !isSupportChatOpen,
      })
    );
  };

  return (
    <div className={style.chat}>
      <button
        onClick={toggleSupportChat}
        type="button"
        className={style.toggleButton}
      >
        <i className={`${style.icon} fe fe-message-square mr-md-2`} />
        <span className="d-none d-md-inline">Support Chat</span>
      </button>
      <div
        className={classNames(style.container, {
          [style.containerToggled]: isSupportChatOpen,
        })}
      >
        <div className="d-flex flex-wrap mb-2">
          <div className="text-dark font-size-18 font-weight-bold mr-auto">
            Support Chat
          </div>
          <button
            onClick={toggleSupportChat}
            type="button"
            className="btn btn-link p-0 border-0"
          >
            <i className="fe fe-x-square font-size-21 align-middle text-gray-6" />
          </button>
        </div>
        <General14 />
      </div>
    </div>
  );
};

export default SupportChat;
