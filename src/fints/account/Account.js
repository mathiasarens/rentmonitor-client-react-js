import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RefershIcon from '@material-ui/icons/Refresh';
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

        {accountSettingsList.map((accountSettingsItem) => (
          <Grid
            container
            marginTop={2}
            spacing={1}
            key={accountSettingsItem.id}
          >
            <Grid item xs={12} sm={3}>
              <Grid container marginTop={1}>
                <Typography variant="h7">{accountSettingsItem.name}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container marginTop={1}>
                <Grid item xs={4}>
                  {t('iban')}:
                </Grid>
                <Grid item xs={8}>
                  {accountSettingsItem.iban}
                </Grid>

                <Grid item xs={4}>
                  {t('bic')}:
                </Grid>
                <Grid item xs={8}>
                  {accountSettingsItem.bic}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Grid container spacing={1} marginTop={1}>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="edit"
                    component={Link}
                    to={`${ACCOUNT_PATH}/edit/step1/${accountSettingsItem.id}`}
                  >
                    {t('edit')}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="synchronize"
                    component={Link}
                    to={`${ACCOUNT_PATH}/synchronisation/${accountSettingsItem.id}`}
                  >
                    {t('synchronize')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </div>
    </Container>
  );
}
