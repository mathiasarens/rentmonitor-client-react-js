import AddIcon from '@mui/icons-material/Add';
import RefershIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {TENANTS_PATH} from '../Constants';
import {DeleteConfirmationComponent} from '../utils/DeleteConfirmationComponent';
import {openSnackbar} from '../utils/Notifier';
import {tenantsLoader} from './dataaccess/tenantLoader';

export default function Tenant() {
  const {t} = useTranslation();
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();

  const loadTenants = useCallback(() => {
    tenantsLoader(navigate, setTenants, (error) => {
      openSnackbar({
        message: t(handleAuthenticationError(error)),
        variant: 'error',
      });
    });
  }, [t, navigate]);

  const deleteTenant = useCallback(
    (id) => {
      authenticatedFetch(`/tenants/${id}`, navigate, {
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
    [t, navigate, tenants],
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
                  to={`/${TENANTS_PATH}/edit`}
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
          <div key={`tenant-${tenantListItem.id}`}>
            <Grid
              container
              marginTop={2}
              paddingTop={2}
              spacing={1}
              alignItems="flex-start"
            >
              <Grid item xs={12} sm={3}>
                <Typography variant="h6">{tenantListItem.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={7}>
                <Grid container spacing={0} marginTop={1} alignItems="flex-end">
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
                      to={`/${TENANTS_PATH}/${tenantListItem.id}`}
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
