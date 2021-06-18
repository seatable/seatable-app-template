import React from 'react';
import intl from 'react-intl-universal';
import context from './context.js';
import Loading from './common/loading';
import toaster from './common/toaster';
import { isEditAppPage } from './utils/utils.js';
import DTableUtils from './utils/dtable-utils.js';
import Template from './pages/template.js';

import './locale/index.js'

import './assets/css/common.css'

class App extends React.Component {

  constructor(props) {
    super(props);
    const appConfig = context.getSetting('appConfig');
    this.state = {
      isLoading: true,
      appConfig: JSON.parse(appConfig),
      isSaving: false,
      isShowSaveMessage: false,
    };
    this.dtableUtils = new DTableUtils(context.getConfig());
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  async initPluginDTableData() {
    try {
      const { appConfig } = this.state;
      await this.dtableUtils.init(appConfig);
      if (isEditAppPage()) {
        const newConfig = await this.dtableUtils.getConfig(appConfig);

        const tables = this.dtableUtils.getTables();
        const views = this.dtableUtils.getViews();
        const columns = this.dtableUtils.getColumns();
        const rows = this.dtableUtils.getRows();
        this.setState({
          tables,
          views,
          columns,
          rows,
          isLoading: false,
          appConfig: newConfig
        })
      } else {
        const columns = this.dtableUtils.getColumns();
        const rows = this.dtableUtils.getRows();
        this.setState({
          columns,
          rows,
          isLoading: false
        });
      }
    } catch(err) {
      let errorMessage = intl.get('Network_error');
      if (err.response) {
        const { status } = err.response;
        if (status === 403) {
          errorMessage = intl.get('The_token_has_expired_please_refresh_the_page');
        }
        if (status === 500) {
          errorMessage = intl.get('Internal_server_error');
        }
        if (!isEditAppPage() && status === 404) {
          errorMessage = intl.get('The_sharing_link_has_expired');
        }
      }
      this.setState({
        isLoading: false,
        errorMessage: errorMessage
      });
    }
  }

  onDTableConnect = () => {
    this.resetData();
  }

  onDTableChanged = () => {
    this.resetData();
  }

  updateAppConfig = async (config, type = null) => {
    this.setState({
      isSaving: true,
      isShowSaveMessage: true,
    });
    let newAppConfig = config;
    if (type && type === 'table') {
      newAppConfig = await this.dtableUtils.getConfigByChangeSelectedTable(config);
    }
    if (type && type === 'view') {
      newAppConfig = await this.dtableUtils.getConfigByChangeSelectedView(config);
    }
    context.updateExternalAppInstance(newAppConfig).then(res => {
      const views = this.dtableUtils.getViews();
      const columns = this.dtableUtils.getColumns();
      const rows = this.dtableUtils.getRows();
      this.setState({
        appConfig: newAppConfig,
        isSaving: false,
        views,
        columns,
        rows
      }, () => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.setState({isShowSaveMessage: false});
        }, 1000);
      });
    }).catch(err => {
      toaster.danger(intl.get('Failed_to_update_app_config'));
      this.setState({
        isSaving: false,
        isShowSaveMessage: false
      });
    });
  }

  render() {
    let { isLoading, errorMessage } = this.state;
    if (isLoading) {
      return <div className="d-flex flex-fill align-items-center"><Loading /></div>;
    }
    
    if (!isLoading && errorMessage) {
      return (
        <div className="d-flex flex-fill align-items-center error-message">
          {errorMessage}
        </div>
      );
    }
    
    return (
      <Template 
        tables={this.state.tables}
        views={this.state.views}
        columns={this.state.views}
        rows={this.state.rows}
      />
    );
  }
}

export default App;
