const settingsConfig = {
  loginRedirectUrl: "/",
  logout: false,

  getLoginRedirectUrl() {
    const current = this.loginRedirectUrl;
    this.loginRedirectUrl = "/";
    this.logout = false;

    return current;
  },
};

export default settingsConfig;
