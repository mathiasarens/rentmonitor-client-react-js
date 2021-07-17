import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {ACCOUNT_PATH} from '../../Constants';
import {openSnackbar} from '../../utils/Notifier';

const useStyles = makeStyles((theme) => ({
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

export default function AccountEditorStepInitial() {
  const classes = useStyles();
  const {t} = useTranslation();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      fintsBlz: '',
      fintsUrl: '',
      fintsUser: '',
      fintsPassword: '',
    },
  });
  const {accountId} = useParams();

  const onSubmit = (formInputs) => {
    console.log('account - onSubmit - formInputs: ', formInputs);
    authenticatedFetch('/account-settings/fints-accounts', history, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formInputs),
    })
      .then((response) => {
        response
          .json()
          .then((json) => {
            console.log(
              'account - onSubmit - step1 - response status: ',
              response.status,
            );
            console.log('account - onSubmit - step1 - response json: ', json);
            const state = Object.assign(
              {},
              {form: formInputs},
              {accounts: json},
            );
            console.log('account - onSubmit - step1 - response state: ', state);
            switch (response.status) {
              case 209:
                history.push(`${ACCOUNT_PATH}/edit/step2/${accountId}`, state);
                break;
              case 210:
                history.push(
                  `${ACCOUNT_PATH}/edit/stepTan/${accountId}`,
                  state,
                );
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
            console.log(error);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
          });
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  const loadAccount = (id) => {
    console.log(`Load account: ${id}`);
    authenticatedFetch(`/account-settings/${id}`, history, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((accountsettings) => {
        console.log('Loaded account-settings: ', accountsettings);
        reset({
          name: accountsettings.name,
          fintsBlz: accountsettings.fintsBlz,
          fintsUrl: accountsettings.fintsUrl,
          fintsUser: accountsettings.fintsUser,
        });
      })
      .catch(function (error) {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    if (accountId) {
      loadAccount(accountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
      <Typography component="h1" variant="h5">
        {t('newAccountSettings')}
      </Typography>

      <Controller
        control={control}
        name="name"
        rules={{
          required: {
            value: true,
            message: t('accountErrorMessageNameRequired'),
          },
        }}
        render={({field: {onChange, value}}) => (
          <TextField
            id="name"
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('name')}
            className={classes.input}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoFocus
            required
          />
        )}
      />

      <Controller
        control={control}
        name="fintsBlz"
        rules={{
          required: {
            value: true,
            message: t('accountErrorMessageFintsBlzRequired'),
          },
          pattern: {
            value: /^\d{8}$/,
            message: t('accountErrorMessageFintsBlzPatternMismatch'),
          },
        }}
        render={({field: {onChange, value}}) => (
          <TextField
            id="fintsBlz"
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('fintsBlz')}
            className={classes.input}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            error={!!errors.fintsBlz}
            helperText={errors.fintsBlz?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="fintsUrl"
        rules={{
          required: {
            value: true,
            message: t('accountErrorMessageFintsUrlRequired'),
          },
        }}
        render={({field: {onChange, value}}) => (
          <TextField
            id="fintsUrl"
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('fintsUrl')}
            className={classes.input}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            error={!!errors.fintsUrl}
            helperText={errors.fintsUrl?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="fintsUser"
        rules={{
          required: {
            value: true,
            message: t('accountErrorMessageFintsUserRequired'),
          },
        }}
        render={({field: {onChange, value}}) => (
          <TextField
            id="fintsUser"
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('fintsUser')}
            className={classes.input}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            error={!!errors.fintsUser}
            helperText={errors.fintsUser?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="fintsPassword"
        rules={{
          required: {
            value: true,
            message: t('accountErrorMessageFintsPasswordRequired'),
          },
        }}
        render={({field: {onChange, value}}) => (
          <TextField
            id="fintsPassword"
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('fintsPassword')}
            className={classes.input}
            type="password"
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            error={!!errors.fintsPassword}
            helperText={errors.fintsPassword?.message}
            required
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
        {t('connectFints')}
      </Button>
    </form>
  );
}
