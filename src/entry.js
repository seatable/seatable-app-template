import React from 'react';
import ReactDOM from 'react-dom';
import './mediator';

import App from './app'

class TaskList {

  static execute() {
    let wrapper = document.querySelector('#wrapper');
    ReactDOM.render(<App />, wrapper);
  }

}

TaskList.execute();