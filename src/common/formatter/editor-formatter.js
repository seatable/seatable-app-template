import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { 
  TextFormatter,
  NumberFormatter,
  CheckboxFormatter,
  DateFormatter,
  SingleSelectFormatter,
  MultipleSelectFormatter,
  CollaboratorFormatter,
  ImageFormatter,
  FileFormatter,
  LongTextFormatter,
  GeolocationFormatter,
  // LinkFormatter,
  FormulaFormatter,
  CTimeFormatter,
  CreatorFormatter,
  LastModifierFormatter,
  MTimeFormatter,
  AutoNumberFormatter,
  UrlFormatter,
  EmailFormatter,
  DurationFormatter
} from 'dtable-ui-component';
import intl from 'react-intl-universal';
import { isValidEmail } from '../../utils/utils';

const propTypes = {
  type: PropTypes.string,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  CellType: PropTypes.object,
  collaborators: PropTypes.array,
  getUserCommonInfo: PropTypes.func,
  getMediaUrl: PropTypes.func,
};

class EditorFormatter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      collaborator: null
    }
  }

  componentDidMount() {
    this.calculateCollaboratorData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateCollaboratorData(nextProps);
  }

  calculateCollaboratorData = (props) => {
    const { row, column, CellType } = props;
    if (column.type === CellType.LAST_MODIFIER) {
      this.getCollaborator(row._last_modifier);
    } else if (column.type === CellType.CREATOR) {
      this.getCollaborator(row._creator);
    }
  }

  getCollaborator = (value) => {
    if (!value) {
      this.setState({isDataLoaded: true, collaborator: null});
      return;
    }
    this.setState({isDataLoaded: false, collaborator: null});
    let { collaborators } = this.props;
    let collaborator = collaborators && collaborators.find(c => c.email === value);
    if (collaborator) {
      this.setState({isDataLoaded: true, collaborator: collaborator});
      return;
    }

    if (!isValidEmail(value)) {
      let mediaUrl = this.props.getMediaUrl();
      let defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
      collaborator = {
        name: value,
        avatar_url: defaultAvatarUrl,
      };
      this.setState({isDataLoaded: true, collaborator: collaborator});
      return;
    }
    
    this.props.getUserCommonInfo(value).then(res => {
      collaborator = res.data;
      this.setState({isDataLoaded: true, collaborator: collaborator});
    }).catch(() => {
      let mediaUrl = this.props.getMediaUrl();
      let defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
      collaborator = {
        name: value,
        avatar_url: defaultAvatarUrl,
      };
      this.setState({isDataLoaded: true, collaborator: collaborator});
    });
  }

  renderEmptyFormatter = () => {
    if (this.props.type === 'row_title') {
      return <span>{intl.get('Unnamed_record')}</span>;
    }
    return <span className="row-cell-empty d-inline-block"></span>;
  }

  renderFormatter = () => {
    const { column, row, collaborators, CellType } = this.props;
    let {type: columnType, name: columnName} = column;
    const { isDataLoaded, collaborator } = this.state;
    
    switch(columnType) {
      case CellType.TEXT: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <TextFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
      }
      case CellType.COLLABORATOR: {
        if (!row[columnName] || row[columnName].length === 0) return this.renderEmptyFormatter();
        return <CollaboratorFormatter value={row[columnName]} collaborators={collaborators} />;
      }
      case CellType.LONG_TEXT: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <LongTextFormatter value={row[columnName]} />;
      }
      case CellType.IMAGE: {
        if (!row[columnName] || row[columnName].length === 0) return this.renderEmptyFormatter();
        return <ImageFormatter value={row[columnName]} isSample />;
      }
      case CellType.GEOLOCATION : {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <GeolocationFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
      }
      case CellType.NUMBER: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <NumberFormatter value={row[columnName]} data={column.data} />;
      }
      case CellType.DATE: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <DateFormatter value={row[columnName]} format={column.data.format} />;
      }
      case CellType.MULTIPLE_SELECT: {
        if (!row[columnName] || row[columnName].length === 0) return this.renderEmptyFormatter();
        return <MultipleSelectFormatter value={row[columnName]} options={column.data.options} />;
      }
      case CellType.SINGLE_SELECT: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <SingleSelectFormatter value={row[columnName]} options={column.data.options} />;
      }
      case CellType.FILE: {
        if (!row[columnName] || row[columnName].length === 0) return this.renderEmptyFormatter();
        return <FileFormatter value={row[columnName]} isSample />;
      }
      case CellType.CHECKBOX: {
        return <CheckboxFormatter value={row[columnName]} />;
      }
      case CellType.CTIME: {
        if (!row._ctime) return this.renderEmptyFormatter();
        return <CTimeFormatter value={row._ctime} />;
      }
      case CellType.MTIME: {
        if (!row._mtime) return this.renderEmptyFormatter();
        return <MTimeFormatter value={row._mtime} />;
      }
      case CellType.CREATOR: {
        if (!row._creator || !collaborator) return this.renderEmptyFormatter();
        if (isDataLoaded) {
          return <CreatorFormatter collaborators={[collaborator]} value={row._creator} />;
        }
        return null
      }
      case CellType.LAST_MODIFIER: {
        if (!row._last_modifier || !collaborator) return this.renderEmptyFormatter();
        if (isDataLoaded) {
          return <LastModifierFormatter collaborators={[collaborator]} value={row._last_modifier} />;
        }
        return null
      }
      case CellType.FORMULA: {
        let formulaValue = row[columnName];
        if (!formulaValue) return this.renderEmptyFormatter();
        return <FormulaFormatter value={formulaValue} column={column} collaborators={collaborators} tables={[]} containerClassName="gallery-formula-container" />;
      }
      case CellType.LINK: {
        // todo ?? return null
        return this.renderEmptyFormatter();
      }
      case CellType.AUTO_NUMBER: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <AutoNumberFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
      }
      case CellType.URL: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <UrlFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
      }
      case CellType.EMAIL: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <EmailFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
      }
      case CellType.DURATION: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        return <DurationFormatter value={row[columnName]} format={column.data.duration_format} containerClassName="gallery-text-editor" />;
      }
      default:
        return null
    }
  }

  render() {
    return(
      <Fragment>
        {this.renderFormatter()}
      </Fragment>
    );
  }
}

EditorFormatter.propTypes = propTypes;

export default EditorFormatter;
