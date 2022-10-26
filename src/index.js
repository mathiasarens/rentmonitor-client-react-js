import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import deLocale from 'date-fns/locale/de';
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={deLocale}>
      <App />
    </LocalizationProvider>
  </ThemeProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
