import * as CellType from './cell-types';

const COLUMNS_ICON_CONFIG = {
  [CellType.DEFAULT]: 'dtable-font dtable-icon-single-line-text',
  [CellType.TEXT]: 'dtable-font dtable-icon-single-line-text',
  [CellType.NUMBER]: 'dtable-font dtable-icon-number',
  [CellType.CHECKBOX]: 'dtable-font dtable-icon-check-square-solid',
  [CellType.DATE]: 'dtable-font dtable-icon-calendar-alt-solid',
  [CellType.SINGLE_SELECT]: 'dtable-font dtable-icon-single-election',
  [CellType.LONG_TEXT]: 'dtable-font dtable-icon-long-text',
  [CellType.IMAGE]: 'dtable-font dtable-icon-picture',
  [CellType.FILE]: 'dtable-font dtable-icon-file-alt-solid',
  [CellType.MULTIPLE_SELECT]: 'dtable-font dtable-icon-multiple-selection',
  [CellType.COLLABORATOR]: 'dtable-font dtable-icon-collaborator',
  [CellType.LINK]: 'dtable-font dtable-icon-link-other-record',
  [CellType.FORMULA]: 'dtable-font dtable-icon-formula',
  [CellType.LINK_FORMULA]: 'dtable-font dtable-icon-link-formulas',
  [CellType.CREATOR]: 'dtable-font dtable-icon-creator',
  [CellType.CTIME]: 'dtable-font dtable-icon-creation-time',
  [CellType.LAST_MODIFIER]: 'dtable-font dtable-icon-creator',
  [CellType.MTIME]: 'dtable-font dtable-icon-creation-time',
  [CellType.GEOLOCATION]: 'dtable-font dtable-icon-location',
  [CellType.AUTO_NUMBER]: 'dtable-font dtable-icon-autonumber',
  [CellType.URL]: 'dtable-font dtable-icon-url',
  [CellType.EMAIL]: 'dtable-font dtable-icon-email',
  [CellType.DURATION]: 'dtable-font dtable-icon-duration',
  [CellType.BUTTON]: 'dtable-font dtable-icon-button',
  [CellType.RATE]: 'dtable-font dtable-icon-star',
};

export default COLUMNS_ICON_CONFIG;
