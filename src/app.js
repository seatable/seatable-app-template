import React from 'react';
import { Label, Input, Button } from 'reactstrap';
import DTable from 'dtable-sdk';
import Loading from './widge/loading';
import Content from './content';
import './css/seafile-ui.css';
import './css/app.css';

const tableName = '测试移动端全部的列';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      wechatName: '',
      rows: []
    };
    this.dtable = new DTable();
    this.table = {};
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  componentWillUnmount() {
    this.unsubscribeLocalDtableChanged();
    this.unsubscribeRemoteDtableChanged();
  }

  async initPluginDTableData() {
    if (window.app === undefined) {
      // local develop
      window.app = {};
      await this.dtable.init(window.dtablePluginConfig);
      await this.dtable.syncWithServer();
      this.dtable.subscribe('dtable-connect', () => { this.onDTableConnect(); });
    } else { 
      // integrated to dtable app
      this.dtable.initInBrowser(window.app.dtableStore);
    }
    this.unsubscribeLocalDtableChanged = this.dtable.subscribe('local-dtable-changed', () => { this.onDTableChanged(); });
    this.unsubscribeRemoteDtableChanged = this.dtable.subscribe('remote-dtable-changed', () => { this.onDTableChanged(); });
    this.resetData();
    this.table = this.dtable.getTableByName(tableName);
  }

  onDTableConnect = () => {
    this.resetData();
  }

  onDTableChanged = () => {
    this.resetData();
  }

  resetData = () => {
    this.setState({
      isLoading: false
    });
  }

  onInputChange = (e) => {
    this.setState({
      wechatName: e.target.value
    });
  }

  onKeyDown = (e) => {
    e.stopPropagation();
    if (e.keyCode === 13) {
      this.searchRow();
    }
  }

  searchRow = () => {
    let name = this.state.wechatName.trim();
    if (!name) return;
    let newRows = this.table.rows.filter((row) => {
      return row && row['0000'] === name;
    });
    this.setState({ rows: newRows });
  }

  clearSearch = () => {
    this.setState({
      rows: [],
      wechatName: ''
    });
  }

  renderSearch = () => {
    return (
      <div className="mx-4">
        <Label className="mr-2">{'微信名称'}</Label>
        <Input
          type="text"
          className="wechat-name"
          value={this.state.wechatName}
          onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}
        />
        <Button onClick={this.searchRow} className="ml-2 mb-1">{'查询'}</Button>
        <Button onClick={this.clearSearch} className="ml-2 mb-1">{'清空'}</Button>
      </div>
    );
  }

  render() {
    let { isLoading } = this.state;
    if (isLoading) {
      return <Loading/>;
    }
    let search = this.renderSearch();
    let collaborators = this.dtable.getRelatedUsers();

    const style = {
      width: '100%',
      overflow: 'auto'
    };
    return (
      <div className="dtable-plugin plugin-container dataset-dialog w-100">
        <h2 className="dtable-plugin-header">{'信息查询APP'}</h2>
        {search}
        <div style={style}>
          <div className="test-plugin-content">            
            <Content
              rows={this.state.rows}
              columns={this.table.columns}
              collaborators={collaborators}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
