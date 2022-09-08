import AddIcon from '@mui/icons-material/Add';
import RefershIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {ACCOUNT_PATH} from '../../Constants';
import {DeleteConfirmationComponent} from '../../utils/DeleteConfirmationComponent';
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
  const navigate = useNavigate();

  const load = useCallback(() => {
    authenticatedFetch('/account-settings', navigate, {
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
  }, [t, navigate]);

  const deleteAccountSettingsItem = useCallback(
    (id) => {
      authenticatedFetch(`/account-settings/${id}`, navigate, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          console.log(response.statusText);
          if (response.status === 204) {
            load();
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    [t, navigate, load],
  );

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
                    to={`/${ACCOUNT_PATH}/step1/${accountSettingsItem.id}`}
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
                    to={`/${ACCOUNT_PATH}/synchronisation/${accountSettingsItem.id}`}
                  >
                    {t('synchronize')}
                  </Button>
                </Grid>
                <Grid item>
                  <DeleteConfirmationComponent
                    onDelete={() => {
                      deleteAccountSettingsItem(accountSettingsItem.id);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </div>
    </Container>
  );
}
