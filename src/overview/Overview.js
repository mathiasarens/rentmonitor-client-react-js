import EditIcon from '@mui/icons-material/Edit';
import RefershIcon from '@mui/icons-material/Refresh';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {BOOKINGS_PATH} from '../Constants';
import {addDueBookingsFromContracts} from '../contract/dataaccess/ContractSynchronisation';
import {openSnackbar} from '../utils/Notifier';

export default function Home() {
  const [t] = useTranslation();
  const [bookingSumPerTenants, setBookingSumPerTenants] = useState([]);
  const [
    addDueBookingsFromContractsLoading,
    setAddDueBookingsFromContractsLoading,
  ] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadTenantBookingOverview = useCallback(() => {
    console.log('Overview - loadTenantBookingOverview');
    setLoading(true);
    authenticatedFetch('/tenant-booking-overview', navigate, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBookingSumPerTenants(data);
        setLoading(false);
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
        setLoading(false);
      });
  }, [t, navigate]);

  useEffect(() => {
    loadTenantBookingOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main">
      <CssBaseline />
      <div>
        <Grid container justifyContent="flex-start">
          <Grid item xs={2}>
            <Typography component="h1" variant="h5">
              {t('tenantBookingOverview')}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={loadTenantBookingOverview}
                >
                  <RefershIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={addDueBookingsFromContractsLoading}
                  onClick={() => {
                    setAddDueBookingsFromContractsLoading(true);
                    addDueBookingsFromContracts(
                      navigate,
                      (json) => {
                        openSnackbar({
                          message: t('fintsAccountSyncronisationSuccess', {
                            newBookingsCount: json.newBookings,
                            unmatchedTransactions: json.unmatchedTransactions,
                          }),
                          variant: 'info',
                        });
                        setAddDueBookingsFromContractsLoading(false);
                      },
                      (response) => {
                        openSnackbar({
                          message: t('connectionError'),
                          variant: 'error',
                        });
                        setAddDueBookingsFromContractsLoading(false);
                      },
                      (error) => {
                        openSnackbar({
                          message: t(handleAuthenticationError(error)),
                          variant: 'error',
                        });
                        setAddDueBookingsFromContractsLoading(false);
                      },
                    );
                  }}
                >
                  {t('contractToBookingTitle')}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  aria-label="synchronize"
                  component={Link}
                  to="/accountsynchronisation"
                >
                  {t('overviewFetchAccountTransactions')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('tenant')} ({bookingSumPerTenants.length})
              </TableCell>
              <TableCell>{t('tenantBookingOverviewSum')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {bookingSumPerTenants.map((bookingSumPerTenantItem) => (
                <TableRow key={bookingSumPerTenantItem.tenant.id}>
                  <TableCell>{bookingSumPerTenantItem.tenant.name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(bookingSumPerTenantItem.sum / 100)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      aria-label="edit"
                      component={Link}
                      to={`/${BOOKINGS_PATH}/${bookingSumPerTenantItem.tenant.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          {loading && (
            <TableBody>
              {[1, 2, 3, 4, 5].map((item) => (
                <TableRow key={`LoadingRow${item}`}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </Container>
  );
}
