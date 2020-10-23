import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import App from './app';

const server = "https://dev.seafile.com/dtable-web/".replace(/\/+$/, "");

window.dtableAppConfig = {
  APIToken: "550431bb7e58590823d53bfa8bdb6f9aab2a7ac0",
  server,
  workspaceID: "3",
  dtableName: "new",
  lang: "en"
};

const tableName = '测试移动端全部的列';

ReactDOM.render(<App tableName={tableName} />, document.getElementsByTagName('body')[0]);
