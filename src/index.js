import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import App from './app';

window.dtableAppConfig = {
  APIToken: "550431bb7e58590823d53bfa8bdb6f9aab2a7ac0",
  server: "https://dev.seafile.com/dtable-web/".replace(/\/+$/, ""),
  workspaceID: "3",
  dtableName: "new",
  tableName: '测试移动端全部的列',
  lang: "en"
};

ReactDOM.render(<App />, document.getElementsByTagName('body')[0]);
