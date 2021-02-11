import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import {
  inspect
} from '@xstate/inspect';

// ...
// Uncomment an example to run it.
//
import { App } from './task';
// import { App } from './agora';

// ...
// Enable state machine inspection (in separate popup window).
inspect({
  iframe: false
});

// ...

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

