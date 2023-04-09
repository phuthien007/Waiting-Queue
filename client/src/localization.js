import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import { selectSettings } from "store/settingSlice";
import vietnamese from "./locales/vi-VN";

const locales = {
  "vi-VN": vietnamese,
};

const Localization = ({ children }) => {
  const { locale } = useSelector(selectSettings);
  const currentLocale = locales[locale];
  return (
    <ConfigProvider locale={currentLocale.localeAntd}>
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        {children}
      </IntlProvider>
    </ConfigProvider>
  );
};

export default Localization;
