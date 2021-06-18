import axios from 'axios';

class DTableServerAPI {

  constructor(config) {
    const { dtableServer, dtableUuid, accessToken, lang } = config;
    this.dtableUuid = dtableUuid;
    this.lang = lang;
    this.req = axios.create({
      baseURL: dtableServer,
      headers: {Authorization: 'Token ' + accessToken}
    });
  }

  getDTable() {
    const url = `dtables/${this.dtableUuid}/?lang=${this.lang}`;
    return this.req.get(url);
  }
  
  getRelatedUsers() {
    const url = `api/v1/dtables/${this.dtableUuid}/related-users/`;
    return this.req.get(url);
  }

  listViews(tableName) {
    const url = `api/v1/dtables/${this.dtableUuid}/views/`;
    const params = {
      table_name: encodeURIComponent(tableName),
    }
    return this.req.get(url, params);
  }

  listColumns(tableName, viewName) {
    const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
    const params = {
      table_name: tableName,
      view_name: viewName
    }
    return this.req.get(url, {params});
  }
  
  listRows(tableName, viewName) {
    const url = `api/v1/dtables/${this.dtableUuid}/rows/`;
    const params = {
      table_name: tableName,
      view_name: viewName
    }
    return this.req.get(url, {params});
  }

}

export default DTableServerAPI;