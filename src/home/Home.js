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
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {BOOKINGS_PATH} from '../Constants';
import {openSnackbar} from '../notifier/Notifier';

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
  }, [loadTenantBookingOverview]);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('tenantBookingOverview')}
            </Typography>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('tenant')}</TableCell>
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
