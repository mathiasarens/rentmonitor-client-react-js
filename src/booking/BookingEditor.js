import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import React, {useCallback, useEffect, useState} from 'react';
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: 'error',
      });
      return;
    }
    console.log('before post', booking);
    authenticatedFetch(
      booking.id ? `/bookings/${booking.id}` : '/bookings',
      history,
      {
        method: booking.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
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
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format={t('dateFormat')}
              margin="normal"
              label={t('bookingDate')}
              value={booking.date ? booking.date : new Date()}
              onChange={(date) => setBooking({...booking, date: date})}
              fullWidth
              inputVariant="outlined"
              KeyboardButtonProps={{
                'aria-label': 'change booking date',
              }}
              required
            />
          </MuiPickersUtilsProvider>

          <Autocomplete
            id="teanant-id"
            options={tenants}
            getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
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
            getOptionSelected={(option, value) =>
              value === '' || option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label={t('tenant')} variant="outlined" />
            )}
            required
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('bookingComment')}
            className={classes.input}
            value={booking.comment ? booking.comment : ''}
            onChange={(event) => {
              setBooking({...booking, comment: event.target.value});
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('bookingAmount')}
            type="number"
            className={classes.input}
            value={booking.amount ? booking.amount : 0}
            onChange={(event) => {
              setBooking({...booking, amount: event.target.value});
            }}
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
