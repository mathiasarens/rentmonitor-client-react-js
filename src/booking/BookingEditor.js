import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';
import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {BOOKING_PATH} from '../Constants';
import {openSnackbar} from '../notifier/Notifier';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';
import {bookingLoader} from './dataaccess/bookingLoader';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  input: {
    '&:invalid': {
      borderColor: red,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function BookingEditor() {
  const {t} = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [tenants, setTenants] = useState([]);
  const [booking, setBooking] = useState({});
  const {bookingId} = useParams();
  const {register, handleSubmit, control, errors} = useForm();

  const loadBooking = useCallback(
    (id) => {
      bookingLoader(
        id,
        history,
        (data) => {
          setBooking(data);
        },
        (error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        },
      );
    },
    [t, history],
  );

  const loadTenants = useCallback(() => {
    tenantsLoader(
      history,
      (data) => {
        setTenants(data);
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
    loadTenants();
    if (bookingId) {
      loadBooking(bookingId);
    }
  }, [loadTenants, loadBooking, bookingId]);

  const onSubmit = (formInputs) => {
    console.log('onSubmit - start: ', formInputs, booking);
    if (booking.id) {
      formInputs.bookingId = booking.id;
    }
    formInputs.tenantId = booking.tenantId;
    formInputs.amount = parseFloat(formInputs.amount);
    console.log('onSubmit - before submit: ', formInputs);
    authenticatedFetch(
      booking.id ? `/bookings/${booking.id}` : '/bookings',
      history,
      {
        method: booking.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formInputs),
      },
    )
      .then(function (response) {
        history.push(BOOKING_PATH);
      })
      .catch(function (error) {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t('booking')}
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <DesktopDatePicker
            disableToolbar
            variant="inline"
            format={t('dateFormat')}
            margin="normal"
            label={t('bookingDate')}
            name="date"
            defaultValue={booking.date ? booking.date : new Date()}
            fullWidth
            inputVariant="outlined"
            KeyboardButtonProps={{
              'aria-label': 'change booking date',
            }}
            required
          />

          <Autocomplete
            id="teanant-id"
            options={tenants}
            getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
            getOptionSelected={(option, value) => {
              console.log('Autocompete (getOptionsSelected) - option', option);
              console.log('Autocompete (getOptionsSelected) - value', value);
              return (
                value === undefined || value === '' || option.id === value.id
              );
            }}
            value={
              booking.tenantId
                ? tenants.find((tenant) => tenant.id === booking.tenantId)
                : ''
            }
            onChange={(event, tenant) => {
              if (tenant !== null) {
                setBooking({...booking, tenantId: tenant.id});
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('tenant')}
                variant="outlined"
                name="tenantId"
                inputRef={register({
                  required: {
                    value: true,
                    message: t('bookingErrorMessageTenantId'),
                  },
                })}
                error={errors.tenantId ? true : false}
                helperText={errors.tenantId?.message}
                required
              />
            )}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('bookingComment')}
            className={classes.input}
            name="comment"
            defaultValue={booking.comment}
            inputRef={register({
              maxLength: {
                value: 5,
                message: t('bookingErrorMessageComment'),
              },
            })}
            error={errors.comment ? true : false}
            helperText={errors.comment?.message}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('bookingAmount')}
            className={classes.input}
            name="amount"
            defaultValue={booking.amount}
            inputRef={register({
              required: {
                value: true,
                message: t('bookingErrorMessageAmount'),
              },
              pattern: {
                value: '^d+(.d{1,2})?$',
                message: t('bookingErrorMessageAmount'),
              },
            })}
            error={errors.amount ? true : false}
            helperText={errors.amount?.message}
            required
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('bookingSave')}
          </Button>
        </form>
      </div>
    </Container>
  );
}
