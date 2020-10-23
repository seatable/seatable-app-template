import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Button } from 'reactstrap';
import DTable from 'dtable-sdk';
import Loading from './widge/loading';
import Content from './widge/content';
import './css/seafile-ui.css';
import './css/app.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      searchValue: '',
      rows: []
    };
    this.dtable = new DTable();
    this.table = {};
  }

  componentDidMount() {
    this.initAppDTableData();
  }

  componentWillUnmount() {
    this.unsubscribeLocalDtableChanged();
    this.unsubscribeRemoteDtableChanged();
  }

  async initAppDTableData() {
    if (window.app === undefined) {
      // local develop
      window.app = {};
      await this.dtable.init(window.dtableAppConfig);
      await this.dtable.syncWithServer();
      this.dtable.subscribe('dtable-connect', () => { this.onDTableConnect(); });
    } else { 
      // integrated to dtable app
      this.dtable.initInBrowser(window.app.dtableStore);
    }
    this.unsubscribeLocalDtableChanged = this.dtable.subscribe('local-dtable-changed', () => { this.onDTableChanged(); });
    this.unsubscribeRemoteDtableChanged = this.dtable.subscribe('remote-dtable-changed', () => { this.onDTableChanged(); });
    this.resetData();
    this.table = this.dtable.getTableByName(window.dtableAppConfig.tableName);
    this.collaborators = this.dtable.getRelatedUsers();
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
    this.setState({ searchValue: e.target.value });
  }

  onKeyDown = (e) => {
    e.stopPropagation();
    if (e.keyCode === 13) {
      this.searchRow();
    }
  }

  searchRow = () => {
    let name = this.state.searchValue.trim();
    if (!name) return;
    let newRows = this.table.rows.filter((row) => {
      return row && row['0000'] === name;
    });
    this.setState({ rows: newRows });
  }

  clearSearch = () => {
    this.setState({
      rows: [],
      searchValue: ''
    });
  }

  render() {
    let { isLoading } = this.state;
    if (isLoading) {
      return <Loading/>;
    }
    const preCl = 'dtable-app';
    return (
      <div className={`${preCl} w-100`}>
        <h2 className={`${preCl}-header`}>{'信息查询APP'}</h2>
        <div className={`${preCl}-search mx-4`}>
          <Label className="mr-2">{'微信名称'}</Label>
          <Input
            type="text"
            className={`${preCl}-search-input`}
            value={this.state.searchValue}
            onChange={this.onInputChange}
            onKeyDown={this.onKeyDown}
          />
          <Button onClick={this.searchRow} className="ml-2 mb-1">{'查询'}</Button>
          <Button onClick={this.clearSearch} className="ml-2 mb-1">{'清空'}</Button>
        </div>
        <div className={`${preCl}-body`}>
          <Content
            rows={this.state.rows}
            columns={this.table.columns}
            collaborators={this.collaborators}
          />
        </div>
      </div>
    );
  }
}

App.propTypes = propTypes;

export default App;
