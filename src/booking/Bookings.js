import AddIcon from '@mui/icons-material/Add';
import RefershIcon from '@mui/icons-material/Refresh';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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

export default function Bookings() {
  const {t} = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantsMap, setTenantsMap] = useState(new Map());
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();
  const {tenantId: selectedTenantIdParam} = useParams();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [lastPageSize, setLastPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState('');

  const observer = useRef();
  const lastItemCallback = useCallback(
    (node) => {
      if (loading) return;
      if (!node) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && lastPageSize === pageSize) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading],
  );

  const loadBookings = (tenantId, page, pageSize) => {
    const baseUrl = `/bookings?filter[limit]=${pageSize}&filter[skip]=${
      page * pageSize
    }`;
    const url = tenantId
      ? baseUrl + '&filter[where][tenantId]=' + tenantId
      : baseUrl;
    const orderByUrl =
      url + '&filter[order][0]=date%20DESC&filter[order][1]=id%20ASC';
    setLoading(true);
    authenticatedFetch(orderByUrl, navigate, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (page === 0) {
          setBookings(data);
        } else {
          setBookings((prevBookings) => [...prevBookings, ...data]);
        }
        setLoading(false);
        setLastPageSize(data.length);
      })
      .catch((error) => {
        setLoadingError(t(handleAuthenticationError(error)));
        setLoading(false);
      });
  };

  const deleteBooking = (id) => {
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
  };

  const loadTenants = () => {
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
      },
      (error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      },
    );
  };

  useEffect(() => {
    loadTenants();
    if (selectedTenantIdParam) {
      const tenant = tenants.filter(
        (tenant) => tenant.id === parseInt(selectedTenantIdParam),
      )[0];
      console.log('bookings - tenants loaded - selected tenant: ', tenant);
      setSelectedTenant(tenant);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(
    () => loadBookings(selectedTenant?.id, page, pageSize),
    [page, pageSize, selectedTenant],
  );

  return (
    <>
      <Grid container justify="space-between" alignItems="flex-end" spacing={3}>
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
                    0,
                    pageSize,
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
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={tenants}
            getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
            value={selectedTenant}
            onChange={(event, tenant, reason) => {
              setSelectedTenant(tenant);
              loadBookings(tenant ? tenant.id : undefined, 0, pageSize);
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
      {bookings.map((bookingListItem, index) => (
        <Grid
          container
          ref={index + 1 >= bookings.length ? lastItemCallback : undefined}
          marginTop={2}
          spacing={1}
          key={bookingListItem.id}
        >
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
      {loadingError && (
        <Box mt={3} mb={3}>
          <Typography component="h1" variant="h5">
            {loadingError}
          </Typography>
          <Button
            disabled={lastPageSize !== pageSize || loading}
            type="submit"
            margin="normal"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={() => loadBookings(selectedTenant?.id, page, pageSize)}
          >
            {t('fintsAccountTransactionLoadNextBookingsButton')}
          </Button>
        </Box>
      )}
      {loading && (
        <Box mt={3} mb={3}>
          <Typography component="h1" variant="h5">
            {t('bookingsLoading')}
          </Typography>
        </Box>
      )}
    </>
  );
}
