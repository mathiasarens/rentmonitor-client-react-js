import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import deLocale from 'date-fns/locale/de';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
      <App />
    </LocalizationProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
