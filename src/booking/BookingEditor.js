import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {DatePicker} from '@mui/x-date-pickers';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {BOOKINGS_PATH} from '../Constants';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';
import {openSnackbar} from '../utils/Notifier';

export default function BookingEditor() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [booking, setBooking] = useState({});
  const location = useLocation();
  const {bookingId} = useParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      date: new Date(),
      tenant: null,
      comment: '',
      amount: '',
    },
  });
  console.log('Given props: ', location.state);

  const loadBooking = (id, tenants) => {
    authenticatedFetch(`/bookings/${id}`, navigate, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.amount = data.amount / 100;
        setBooking(data);
        console.log('Booking loaded: ', data);
        reset({
          date: data.date,
          tenant: tenants.find((tenant) => tenant.id === data.tenantId),
          comment: data.comment,
          amount: data.amount,
        });
      })
      .catch((error) => {
        console.log(error);
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
        setTenants(data);
        if (bookingId) {
          loadBooking(bookingId, data);
        } else if (location.state) {
          reset({
            date: location.state.date,
            comment: location.state.comment,
            amount: location.state.amount / 100,
          });
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (formInputs) => {
    const bookingToSubmit = {};
    bookingToSubmit.id = booking.id;
    bookingToSubmit.clientId = booking.clientId;
    if (booking.contractId) {
      bookingToSubmit.contractId = booking.contractId;
    }
    if (location.state?.accountTransactionId) {
      bookingToSubmit.accountTransactionId =
        location.state.accountTransactionId;
    } else if (booking.accountTransactionId) {
      bookingToSubmit.accountTransactionId = booking.accountTransactionId;
    }
    // TODO: this must be a bug in material ui date picker.
    // the code should be as simple as this: bookingToSubmit.date = formInputs.date
    bookingToSubmit.date = formInputs.date.getTimezoneOffset
      ? new Date(
          formInputs.date.valueOf() -
            formInputs.date.getTimezoneOffset() * 60 * 1000,
        )
      : formInputs.date;
    bookingToSubmit.tenantId = formInputs.tenant.id;
    bookingToSubmit.comment = formInputs.comment;
    bookingToSubmit.amount = parseInt(
      (parseFloat(formInputs.amount) * 100).toFixed(0),
    );
    bookingToSubmit.type = booking.type;
    console.log(
      'onSubmit - before submit: ',
      formInputs,
      booking,
      JSON.stringify(bookingToSubmit),
    );
    authenticatedFetch(
      booking.id ? `/bookings/${booking.id}` : '/bookings',
      navigate,
      {
        method: booking.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingToSubmit),
      },
    )
      .then(function (response) {
        navigate(`/${BOOKINGS_PATH}`, {replace: false});
      })
      .catch(function (error) {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        {t('booking')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="date"
          rules={{required: true, message: t('bookingErrorMessageDate')}}
          render={({field: {onChange, value}}) => (
            <DatePicker
              disableToolbar
              label={t('bookingDate')}
              OpenPickerButtonProps={{
                'aria-label': 'change booking date',
              }}
              inputFormat={t('dateFormat')}
              mask="__.__.____"
              value={value}
              onChange={(date) => onChange(date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  variant="outlined"
                  error={errors.date ? true : false}
                  helperText={errors.date?.message}
                  required
                  fullWidth
                />
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="tenant"
          rules={{required: true, message: t('bookingErrorMessageTenantId')}}
          render={({field: {onChange, value}}) => (
            <Autocomplete
              id="teanant-id"
              options={tenants}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
              value={value}
              onChange={(event, tenant) => {
                console.log('onChange - Tenant: ', tenant);
                onChange(tenant);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('tenant')}
                  margin="normal"
                  variant="outlined"
                  error={errors.tenant ? true : false}
                  helperText={errors.tenant?.message}
                  required
                />
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="comment"
          rules={{
            maxLength: {
              value: 255,
              message: t('bookingErrorMessageComment'),
            },
          }}
          render={({field: {onChange, value}}) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={t('bookingComment')}
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              error={errors.comment ? true : false}
              helperText={errors.comment?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          rules={{
            required: {
              value: true,
              message: t('bookingErrorMessageAmount'),
            },
            pattern: {
              value: '^-?d+(.d{1,2})?$',
              message: t('bookingErrorMessageAmount'),
            },
          }}
          render={({field: {onChange, value}}) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={t('bookingAmount')}
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              error={errors.amount ? true : false}
              helperText={errors.amount?.message}
              required
            />
          )}
        />
        <Grid container marginTop={3} marginBottom={3}>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
          >
            {t('bookingSave')}
          </Button>
        </Grid>
      </form>
    </>
  );
}
