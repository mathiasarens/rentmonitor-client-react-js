import {Button} from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import parse from 'date-fns/parse';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {openSnackbar} from '../../notifier/Notifier';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
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

export default function FintsTransactionSynchronisation() {
  const {t} = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const {register, handleSubmit, errors} = useForm();

  const onSubmit = (formInputs) => {
    console.log('formInputs', formInputs);
    const request = {};
    if (formInputs.from !== '') {
      request.from = parse(formInputs.from, t('dateFormat'), new Date());
    }
    if (formInputs.to !== '') {
      request.to = parse(formInputs.to, t('dateFormat'), new Date());
    }
    const bodyJson = JSON.stringify(request, null, 2);
    console.log(bodyJson);
    authenticatedFetch('/transaction-to-booking', history, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: bodyJson,
    })
      .then((response) => {
        switch (response.status) {
          case 200:
            response.json().then((json) => {
              console.log(json);
              openSnackbar({
                message: t('fintsAccountSyncronisationSuccess', {
                  newBookingsCount: json.newBookings,
                  unmatchedTransactions: json.unmatchedTransactions,
                }),
                variant: 'info',
              });
            });
            break;
          default:
            console.error(response);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
        }
      })
      .catch((error) => {
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
          {t('fintsAccountSynchronisationTitle')}
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <DatePicker
            label={t('fintsAccountSyncronisationFrom')}
            inputFormat={t('dateFormat')}
            value={fromDate ? fromDate : ''}
            onChange={(date) => {
              setFromDate(date);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                name="from"
                inputRef={register()}
                error={errors.from ? true : false}
                helperText={errors.from?.message}
                fullWidth
              />
            )}
          />

          <DatePicker
            label={t('fintsAccountSyncronisationTo')}
            inputFormat={t('dateFormat')}
            value={toDate ? toDate : ''}
            onChange={(date) => {
              setToDate(date);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                name="to"
                inputRef={register()}
                error={errors.to ? true : false}
                helperText={errors.to?.message}
                fullWidth
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('fintsAccountSynchronisationButton')}
          </Button>
        </form>
      </div>
    </Container>
  );
}
