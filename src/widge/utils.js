import React from 'react';
import NP from 'number-precision';

export const formatDateValue = (value, format) => {
  if (value === '' || !value) {
    return value;
  }
  // Compatible with older versions: if format is null, use defaultFormat
  let newValue = value.split(' ');
  let cellDate = newValue[0].split('-');
  switch(format) {
    case 'M/D/YYYY HH:mm':
      return newValue[1] ? `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]} ${newValue[1]}` : `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]}`;
    case 'DD/MM/YYYY HH:mm':
      return newValue[1] ? `${cellDate[2]}/${cellDate[1]}/${cellDate[0]} ${newValue[1]}` : `${cellDate[2]}/${cellDate[1]}/${cellDate[0]}`;
    case 'YYYY-MM-DD HH:mm':
      return value;
    case 'M/D/YYYY':
      return `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]}`;
    case 'DD/MM/YYYY':
      return `${cellDate[2]}/${cellDate[1]}/${cellDate[0]}`;
    case 'YYYY-MM-DD':
      return `${cellDate[0]}-${cellDate[1]}-${cellDate[2]}`;
    default:
      return value;
  }
};

export const formatNumberValue = (value, format) => {
  if (typeof value !== 'number') {
    return value;
  }
  const commaValue = _toThousands(value);
  const moneyCommaValue = _toThousands(value.toFixed(2), true);
  switch(format) {
    case 'number':
      return value;
    case 'number-with-commas':
      return commaValue;
    case 'percent':
      return `${value * 100}%`;
    case 'yuan':
      return `￥${moneyCommaValue}`;
    case 'dollar':
      return `$${moneyCommaValue}`;
    case 'euro':
      return `€${moneyCommaValue}`;
    default:
      return value;
  }
};

function _toThousands(num, isCurrency) {
  let integer = Math.trunc(num);
  let decimal = String(Math.abs(NP.minus(num, integer))).slice(1);
  if (isCurrency) {
    if (decimal.length === 2) {
      decimal = decimal.padEnd(3, '0');
    } else {
      decimal = decimal.substring(0, 3).padEnd(3, '.00');
    }
  }
  let result = [], counter = 0;
  integer = Object.is(integer, -0) ? ['-', '0'] : integer.toString().split('');
  for (var i = integer.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(integer[i]);
    if (!(counter % 3) && i !== 0) {
      result.unshift(',');
    }
  }
  return result.join('') + decimal;
}

function getOptionNameByID(column, optionID) {
  if (!column.data) return null;
  const options = column.data.options;
  let option = options.find(item => { return item.id === optionID;});
  return option || null;
}

function getOptionsNamesById(column, optionIDs) {
  let options = [];
  for (let i = 0; i < optionIDs.length; i++) {
    const option = getOptionNameByID(column, optionIDs[i]);
    if (option) options.push(option);
  }
  return options;
}

function renderLongTextImages(images) {
  let imagesDom = images.map((image, index) => {
    return <img src={image} alt="" key={index}/>;
  });
  return (
    <span className="longtext-icon-container longtext-formatter-image-container">
      {imagesDom}<i className="image-number">{'+'}{images.length}</i>
    </span>
  );
}

function renderLongText(markdown) {
  const { preview, images, links } = markdown;
  const linksLen = links ? links.length : 0;
  const imagesLen = images ? images.length : 0;
  return (
    <div className="longtext-formatter">
      {linksLen > 0 &&
        <span className="longtext-icon-container longtext-formatter-links-container">
          <i className="dtable-font dtable-icon-url"></i>{links.length}
        </span>
      }
      {imagesLen > 0 && renderLongTextImages(images)}
      <span className="longtext-formatter-preview-container">{preview}</span>
    </div>
  );
}

function renderCollaborators(cellValue, related_user_list) {
  if (!Array.isArray(cellValue)) {
    cellValue = [cellValue];
  }
  let collaborators = [];
  cellValue.forEach((email, index) => {
    const user = related_user_list.find(user => user.email === email);
    if (user) {
      collaborators.push(
        <div className="collaborator" key={index}>
          <span className="collaborator-avatar-container">
            <img className="collaborator-avatar" alt={user.name} src={user.avatar_url}/>
          </span>
          <span className="collaborator-name">{user.name}</span>
        </div>
      );
    }
  });
  return (
    <div className="collaborators-formmatter">
      <div className="formmatter-show">{collaborators}</div>
    </div>
  );
}

function renderDate(cellValue, data) {
  let format = (data && data.format) ? data.format : 'YYYY-MM-DD';
  let formatedDate = formatDateValue(cellValue, format);
  return <div className="text-right">{formatedDate}</div>;
}

function renderNumber(cellValue, data) {
  let formatType = (data && data.format) ? data.format : 'number';
  let formatedNumber = cellValue !== '' ? formatNumberValue(cellValue, formatType) : cellValue;
  return <div className="text-right">{formatedNumber}</div>;
}

function renderImage(cellValue) {
  let imagesArr = [];
  cellValue.forEach((item, index) => {
    imagesArr.push(<img src={item} alt='' width='28px' key={index}></img>);
  });
  return <div className="image-formatter">{imagesArr}</div>;
}

function renderFile(cellValue) {
  let filesArr = [];
  if (Array.isArray(cellValue)) {
    filesArr = cellValue.map((item, index) => {
      return <img key={index} title={item.name} alt=''/>;
    });
  }
  return <div className="file-formatter">{filesArr}</div>;
}

function renderSingleSelect(column, cellValue) {
  const option = getOptionNameByID(column, cellValue);
  if (!option) {
    return (<div></div>);
  }
  const { name, color } = option;
  return <div><div className="single-select" style={{backgroundColor: color}}>{name}</div></div>;
}

function renderMultiSelect(column, cellValue) {
  let optionIDs = getOptionsNamesById(column, cellValue);
  let options = optionIDs.map((option, index) => {
    return (
      <div key={index} className="multiple-select" style={{backgroundColor: option.color}}>{option.name}</div>
    );
  });
  return <div className="multiple-selects-formatter"><div className="formatter-show">{options}</div></div>;
}

export const covertRow = (row, column, related_user_list) => {
  if (!row || !column) {
    return null;
  }
  const {type, data } = column;
  const cellValue = row[column.key];
  if (!cellValue) {
    return null;
  }
  let result;
  switch (type) {
    case 'text':
      result = <div className="text-formatter">{cellValue}</div>;
      break;
    case 'long-text':
      result = renderLongText(cellValue);
      break;
    case 'image':
      result = renderImage(cellValue);
      break;
    case 'file':
      result = renderFile(cellValue);
      break;
    case 'creator':
    case 'last-modifier':
    case 'collaborator':
      result = renderCollaborators(cellValue, related_user_list);
      break;
    case 'single-select':
      result = renderSingleSelect(column, cellValue);
      break;
    case 'multiple-select':
      result = renderMultiSelect(column, cellValue);
      break;
    case 'link':
      break;
    case 'ctime':
    case 'mtime':
    case 'date':        
      result = renderDate(cellValue, data);
      break;
    case 'number':
      result = renderNumber(cellValue, data);
      break;
    case 'checkbox':
      if (cellValue) {
        result = <input className="checkbox" type="checkbox" readOnly defaultChecked></input>;
      } else {
        result = <input className="checkbox" type="checkbox" readOnly></input>;
      }        
      break;
    default:
      result = cellValue.toString();
  }
  return result;
}