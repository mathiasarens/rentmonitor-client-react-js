import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RefershIcon from '@material-ui/icons/Refresh';
import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
import {makeStyles} from '@material-ui/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {ACCOUNT_PATH} from '../../Constants';
import {openSnackbar} from '../../utils/Notifier';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
  },
}));

export default function Account() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [accountSettingsList, setAccountSettingsList] = useState([]);
  const history = useHistory();

  const load = useCallback(() => {
    authenticatedFetch('/account-settings', history, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
          setAccountSettingsList(data);
        });
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  }, [t, history]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('accounts')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="add"
                  component={Link}
                  to={`${ACCOUNT_PATH}/edit`}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton size="small" aria-label="refresh" onClick={load}>
                  <RefershIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{t('iban')}</TableCell>
              <TableCell>{t('bic')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountSettingsList.map((accountSettingsItem) => (
              <TableRow key={accountSettingsItem.id}>
                <TableCell>{accountSettingsItem.name}</TableCell>
                <TableCell>{accountSettingsItem.iban}</TableCell>
                <TableCell>{accountSettingsItem.bic}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="edit"
                    component={Link}
                    to={`${ACCOUNT_PATH}/synchronisation/${accountSettingsItem.id}`}
                  >
                    <SyncOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
