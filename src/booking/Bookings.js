import AddIcon from '@mui/icons-material/Add';
import RefershIcon from '@mui/icons-material/Refresh';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {BOOKING_PATH, CONTRACT_PATH} from '../Constants';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';
import {DeleteConfirmationComponent} from '../utils/DeleteConfirmationComponent';
import {openSnackbar} from '../utils/Notifier';
import {Booking} from './Booking';
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
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedTenantIdOverriden, setSelectedTenantIdOverriden] =
    useState(false);
  const [tenantsMap, setTenantsMap] = useState(new Map());
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();
  const {tenantId: selectedTenantIdParam} = useParams();

  const loadBookings = useCallback(
    (tenantId) => {
      console.log('Load bookings for: ', tenantId);
      bookingsLoader(tenantId, navigate, setBookings, (error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
    },
    [t, navigate],
  );

  const deleteBooking = useCallback(
    (id) => {
      authenticatedFetch(`/bookings/${id}`, navigate, {
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
    [t, navigate, bookings],
  );

  const loadTenants = useCallback(() => {
    tenantsLoader(
      navigate,
      (data) => {
        setTenantsMap(
          data.reduce((map, tenant) => {
            map[tenant.id] = tenant;
            return map;
          }, {}),
        );
        setTenants(data.sort((a, b) => a.name.localeCompare(b.name)));

        if (selectedTenantIdParam && !selectedTenantIdOverriden) {
          const tenant = data.filter(
            (tenant) => tenant.id === parseInt(selectedTenantIdParam),
          )[0];
          console.log('bookings - tenants loaded - data: ', data);
          console.log('bookings - tenants loaded - selected tenant: ', tenant);
          setSelectedTenant(tenant);
        }
        loadBookings(selectedTenantIdParam);
      },
      (error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      },
    );
  }, [
    t,
    navigate,
    loadBookings,
    selectedTenantIdOverriden,
    selectedTenantIdParam,
  ]);

  useEffect(() => {
    loadTenants();
    // eslint-disable-next-line
  }, []);

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
                  to={`/${BOOKING_PATH}`}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={() => {
                    loadBookings(
                      selectedTenant ? selectedTenant.id : undefined,
                    );
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
              name="tenant"
              options={tenants}
              getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
              value={selectedTenant}
              onChange={(event, tenant, reason) => {
                console.log('On change: ', tenant);
                setSelectedTenant(tenant);
                setSelectedTenantIdOverriden(true);
                loadBookings(tenant ? tenant.id : undefined);
              }}
              style={{width: 300}}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('filter')}
                  margin="none"
                  variant="standard"
                  //error={errors.tenantId ? true : false}
                  //helperText={errors.tenantId?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        {bookings.map((bookingListItem) => (
          <Grid container marginTop={2} spacing={1} key={bookingListItem.id}>
            <Grid item xs={12} sm={10}>
              <Booking
                bookingListItem={bookingListItem}
                tenantsMap={tenantsMap}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Grid container spacing={1} marginTop={1}>
                <Grid item>
                  {/* ------ edit booking link ---- */}
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="edit"
                    component={Link}
                    to={`/${BOOKING_PATH}/${bookingListItem.id}`}
                  >
                    {t('edit')}
                  </Button>
                </Grid>
                <Grid item>
                  <DeleteConfirmationComponent
                    onDelete={() => {
                      deleteBooking(bookingListItem.id);
                    }}
                  />
                </Grid>
                {/* ------ contract link ---- */}
                <Grid item>
                  {bookingListItem.contractId && (
                    <Button
                      size="small"
                      variant="outlined"
                      aria-label="edit"
                      component={Link}
                      to={`${CONTRACT_PATH}/edit/${bookingListItem.contractId}`}
                    >
                      {t('bookingContractLink')}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </div>
    </Container>
  );
}
