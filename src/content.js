import React from 'react';
import { Table } from 'reactstrap';
import Loading from './widge/loading';
import { covertRow } from './widge/utils';

function Content (paras) {
  const { rows, columns, collaborators } = paras;
  if (!columns || !rows) return (
    <Loading/>
  );
  if (rows.length === 0) {
    return (
      <div>{'无结果'}</div>
    );
  }
  return (
    <Table striped>
      <thead>
        <tr>
          {columns.map((column) => {
            const { type, width, key } = column;
            const columnType = type || 'default';
            if (columnType === 'link') {
              return null;
            }
            const thStyle = {
              width,
              height: 32,
              verticalAlign: 'inherit'
            };
            return (
              <th key={key} style={thStyle}>
                <span className="header-name">{column.name}</span>
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
  );
}

function Item (props) {
  const { columns, index, row, collaborators } = props;
  return (
    <tr key={index}>
      {columns.map((column, index) => {
        if (column.type === 'link') {
          return null;
        }
        return (
          <td key={index} style={{verticalAlign: 'inherit'}}>
            {covertRow(row, column, collaborators)}
          </td>
        );
      })}
    </tr>
  );
}

export default Content;
