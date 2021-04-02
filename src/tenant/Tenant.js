import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RefershIcon from '@material-ui/icons/Refresh';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {TENANT_PATH} from '../Constants';
import {DeleteConfirmationComponent} from '../utils/DeleteConfirmationComponent';
import {openSnackbar} from '../utils/Notifier';
import {tenantsLoader} from './dataaccess/tenantLoader';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
}));

export default function Tenant() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [tenants, setTenants] = useState([]);
  const history = useHistory();

  const loadTenants = useCallback(() => {
    tenantsLoader(history, setTenants, (error) => {
      openSnackbar({
        message: t(handleAuthenticationError(error)),
        variant: 'error',
      });
    });
  }, [t, history]);

  const deleteTenant = useCallback(
    (id) => {
      authenticatedFetch(`/tenants/${id}`, history, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 204) {
            setTenants(tenants.filter((tenant) => tenant.id !== id));
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    [t, history, tenants],
  );

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return (
    <Container component="main">
      <CssBaseline />
      <Box marginTop={4} marginBottom={4}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('tenants')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="add"
                  component={Link}
                  to={`${TENANT_PATH}/edit`}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={loadTenants}
                >
                  <RefershIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {tenants.map((tenantListItem) => (
          <div>
            <Grid container marginTop={2} paddingTop={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{tenantListItem.name}</Typography>
              </Grid>
            </Grid>
            <Grid container marginTop={1} spacing={1} alignItems="flex-end">
              <Grid item xs={3}>
                <Typography variant="caption">{t('email')}:</Typography>
              </Grid>
              <Grid item xs={9}>
                {tenantListItem.email}
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">{t('phone')}:</Typography>
              </Grid>
              <Grid item xs={9}>
                {tenantListItem.phone}
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption">
                  {t('tenantAccountSynchronizationName')}:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                {tenantListItem.accountSynchronisationName}
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      aria-label="edit"
                      component={Link}
                      to={`${TENANT_PATH}/edit/${tenantListItem.id}`}
                    >
                      {t('edit')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <DeleteConfirmationComponent
                      onDelete={() => {
                        deleteTenant(tenantListItem.id);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}
      </Box>
    </Container>
  );
}
