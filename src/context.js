import cookie from 'react-cookies';
import DTableWebAPI  from 'dtable-web-api';

class Context {

  constructor() {
    this.settings = window.dtable ? window.dtable : window.dtablePluginConfig;
    this.api = null;
    this.initApi();
  }

  initApi() {
    let dtableWebAPI = new DTableWebAPI();
    if (this.getSetting('isDevelopment')) {
      const server = this.getSetting('server');
      const username = this.getSetting('username');
      const password = this.getSetting('password');
      dtableWebAPI.init({ server, username, password });
      dtableWebAPI.login();
    } else {
      const siteRoot = this.getSetting('siteRoot');
      const xcsrfHeaders = cookie.load('dtable_csrftoken');
      dtableWebAPI.initForDTableUsage({ siteRoot, xcsrfHeaders });
    }
    this.api = dtableWebAPI;
  }

  getConfig() {
    return this.settings;
  }

  getSetting(key) {
    if (this.settings[key] === false) return this.settings[key];
    return this.settings[key] || '';
  }

  getInitData() {
    return window.app && window.app.dtableStore;
  }

  expandRow(row, table) {
    window.app && window.app.expandRow(row, table);
  }

  closePlugin() {
    window.app && window.app.onClosePlugin();
  }

  getUserCommonInfo(email, avatar_size) {
    if (!this.api) return Promise.reject();
    return this.api.getUserCommonInfo(email, avatar_size);
  }

  updateExternalAppInstance(newAppConfig) {
    if (!this.api) return Promise.reject();
    const appId = this.getSetting('appId');
    const dtableName = this.getSetting('dtableName');
    const workspaceID = this.getSetting('workspaceID');
    return this.api.updateExternalAppInstance(workspaceID, dtableName, appId, JSON.stringify(newAppConfig));
  }

}

const context =  new Context();

export default context;