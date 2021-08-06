import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import {makeStyles} from '@material-ui/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {ACCOUNT_PATH, BOOKINGS_PATH} from '../Constants';
import {addDueBookingsFromContracts} from '../contract/dataaccess/ContractSynchronisation';
import {openSnackbar} from '../utils/Notifier';

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

export default function Home() {
  const classes = useStyles();
  const [t] = useTranslation();
  const [bookingSumPerTenants, setBookingSumPerTenants] = useState([]);
  const [
    addDueBookingsFromContractsLoading,
    setAddDueBookingsFromContractsLoading,
  ] = useState(false);
  const history = useHistory();

  const loadTenantBookingOverview = useCallback(() => {
    authenticatedFetch('/tenant-booking-overview', history, {
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
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  }, [t, history]);

  useEffect(() => {
    loadTenantBookingOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justifyContent="flex-start">
          <Grid item xs={2}>
            <Typography component="h1" variant="h5">
              {t('tenantBookingOverview')}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={addDueBookingsFromContractsLoading}
                  onClick={() => {
                    setAddDueBookingsFromContractsLoading(true);
                    addDueBookingsFromContracts(
                      history,
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
                  to={`${ACCOUNT_PATH}/synchronisation`}
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
                    to={`${BOOKINGS_PATH}/${bookingSumPerTenantItem.tenant.id}`}
                  >
                    <EditIcon />
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
