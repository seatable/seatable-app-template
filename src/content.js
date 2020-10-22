import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import Loading from './widge/loading';
import { covertRow } from './widge/utils';

const propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  collaborators: PropTypes.array.isRequired,
};

function Content (paras) {
  const { rows, columns, collaborators } = paras;
  if (!columns || !rows) return <Loading/>;
  if (rows.length === 0) {
    return <div>{'无结果'}</div>;
  }
  return (
    <div className="dtable-app-content">
      <Table striped>
        <thead>
          <tr>
            {columns.map((column) => {
              const { type, width, key } = column;
              const columnType = type || 'default';
              if (columnType === 'link') {
                return null;
              }
              return (
                <th key={key} style={{width: width}}>
                  <span className="dtable-app-header-name">{column.name}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        {rows &&
          <tbody>
            {rows.map((row, index) => {
              return (
                <Item
                  key={index}
                  index={index}
                  row={row}
                  columns={columns}
                  collaborators={collaborators}
                />
              );
            })}
          </tbody>
        }
      </Table>
    </div>
  );
}

Content.propTypes = propTypes;

function Item (props) {
  const { columns, index, row, collaborators } = props;
  return (
    <tr key={index}>
      {columns.map((column, index) => {
        if (column.type === 'link') {
          return null;
        }
        return (
          <td key={index}>{covertRow(row, column, collaborators)}</td>
        );
      })}
    </tr>
  );
}

export default Content;
