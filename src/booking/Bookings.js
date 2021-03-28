import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Autocomplete from '@material-ui/core/Autocomplete';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RefershIcon from '@material-ui/icons/Refresh';
import format from 'date-fns/format';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {BOOKING_PATH} from '../Constants';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';
import {DeleteConfirmationComponent} from '../utils/DeleteConfirmationComponent';
import {openSnackbar} from '../utils/Notifier';
import {bookingsLoader} from './dataaccess/bookingLoader';

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

export default function Bookings() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [bookings, setBookings] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState();
  const [selectedTenantIdOverriden, setSelectedTenantIdOverriden] = useState(
    false,
  );
  const [tenantsMap, setTenantsMap] = useState(new Map());
  const [tenants, setTenants] = useState([]);
  const history = useHistory();
  const {tenantId: selectedTenantIdParam} = useParams();

  const loadBookings = useCallback(
    (tenantId) => {
      bookingsLoader(tenantId, history, setBookings, (error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
    },
    [t, history],
  );

  const deleteBooking = useCallback(
    (id) => {
      authenticatedFetch(`/bookings/${id}`, history, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 204) {
            setBookings(bookings.filter((booking) => booking.id !== id));
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    [t, history, bookings],
  );

  const loadTenants = useCallback(() => {
    tenantsLoader(
      history,
      (data) => {
        setTenantsMap(
          data.reduce((map, tenant) => {
            map[tenant.id] = tenant;
            return map;
          }, {}),
        );
        setTenants(data.sort((a, b) => a.name.localeCompare(b.name)));
      },
      (error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      },
    );
  }, [t, history]);

  useEffect(() => {
    if (selectedTenantIdParam && !selectedTenantIdOverriden) {
      setSelectedTenantId(selectedTenantIdParam);
    }
    loadBookings(selectedTenantId);
    loadTenants();
  }, [
    loadBookings,
    loadTenants,
    selectedTenantId,
    selectedTenantIdParam,
    selectedTenantIdOverriden,
  ]);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
          justify="space-between"
          alignItems="flex-end"
          spacing={3}
        >
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('bookings')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="add"
                  component={Link}
                  to={`${BOOKING_PATH}/edit`}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={() => {
                    loadBookings(selectedTenantId);
                    loadTenants();
                  }}
                >
                  <RefershIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Autocomplete
              id="teanant-id"
              options={tenants}
              getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
              getOptionSelected={(option, value) =>
                value === undefined || value === '' || option.id === value.id
              }
              value={
                tenantsMap[selectedTenantId] ? tenantsMap[selectedTenantId] : ''
              }
              onChange={(event, tenant, reason) => {
                if (tenant !== null) {
                  setSelectedTenantId(tenant.id);
                } else {
                  setSelectedTenantId(undefined);
                }
                setSelectedTenantIdOverriden(true);
              }}
              style={{width: 300}}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('filter')}
                  margin="none"
                  variant="standard"
                  name="tenantId"
                  //error={errors.tenantId ? true : false}
                  //helperText={errors.tenantId?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('bookingDate')}</TableCell>
              <TableCell>{t('tenant')}</TableCell>
              <TableCell>{t('bookingComment')}</TableCell>
              <TableCell>{t('bookingAmount')}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((bookingListItem) => (
              <TableRow key={bookingListItem.id}>
                <TableCell>
                  {format(new Date(bookingListItem.date), t('dateFormat'))}
                </TableCell>
                <TableCell>
                  {tenantsMap[bookingListItem.tenantId]?.name}
                </TableCell>
                <TableCell>
                  {(bookingListItem.type === 'RENT_DUE'
                    ? t('bookingCommentRentDue') + ' '
                    : '') + bookingListItem.comment}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(bookingListItem.amount / 100)}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="edit"
                    component={Link}
                    to={`${BOOKING_PATH}/edit/${bookingListItem.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <DeleteConfirmationComponent
                    onDelete={() => {
                      deleteBooking(bookingListItem.id);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
