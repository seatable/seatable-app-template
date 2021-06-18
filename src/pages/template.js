import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  tables: PropTypes.array.isRequired,
  views: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};

class Template extends React.Component {

  render() {

    const { tables, views, columns, rows } = this.props;

    const tableID_tableNames = tables.map(table => table._id + '_' + table.name);
    const viewID_viewNames = views.map(view => view._id + '_' + view.name);
    return (
      <div style={{overflow: 'auto', padding: '10px'}}>
        <div>
          <h1>tables</h1>
          {JSON.stringify(tableID_tableNames)}
        </div>
        <div>
          <h1>views</h1>
          {JSON.stringify(viewID_viewNames)}
        </div>
        <div>
          <h1>columns</h1>
          {JSON.stringify(columns)}
        </div>
        <div>
          <h1>rows</h1>
          {JSON.stringify(rows)}
        </div>
      </div>
    );
  }
}

Template.propTypes = propTypes;

export default Template;
