const { mediaUrl, serviceURL: server, siteRoot, lang } = window.app.config;
const { workspaceID, dtableUuid, dtableName, appId, appType, token, appConfig, accessToken, dtableServer, isEditAppPage } = window.shared.pageOptions;

window.dtable = {
  lang,
  mediaUrl,
  workspaceID,
  dtableUuid,
  dtableName,
  accessToken,
  siteRoot,
  server,
  dtableServer,
  dtableSocket: dtableServer,
  appId,
  appType,
  appToken: token,
  appConfig,
  isEditAppPage
};
