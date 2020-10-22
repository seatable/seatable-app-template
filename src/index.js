import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const server = "https://dev.seafile.com/dtable-web/".replace(/\/+$/, "");

window.dtablePluginConfig = {
  APIToken: "550431bb7e58590823d53bfa8bdb6f9aab2a7ac0",
  server,
  workspaceID: "3",
  dtableName: "new",
  lang: "en"
};

ReactDOM.render(<App />, document.getElementsByTagName('body')[0]);
