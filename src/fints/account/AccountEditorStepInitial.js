import Button from '@mui/material/Button';
import {red} from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {ACCOUNT_PATH} from '../../Constants';
import {openSnackbar} from '../../utils/Notifier';

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
    marginBottom: theme.spacing(4),
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

export default function AccountEditorStepInitial() {
  const classes = useStyles();
  const {t} = useTranslation();
  const navigate = useNavigate();
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
    authenticatedFetch('/account-settings/fints-accounts', navigate, {
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
            const state = {state: {form: formInputs, accounts: json}};
            console.log('account - onSubmit - step1 - response state: ', state);
            switch (response.status) {
              case 209:
                const urlStep2 = accountId
                  ? `/${ACCOUNT_PATH}/step2/${accountId}`
                  : `/${ACCOUNT_PATH}/step2`;
                navigate(urlStep2, state);
                break;
              case 210:
                const urlStepTan = accountId
                  ? `/${ACCOUNT_PATH}/stepTan/${accountId}`
                  : `/${ACCOUNT_PATH}/stepTan`;
                navigate(urlStepTan, state);
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
    authenticatedFetch(`/account-settings/${id}`, navigate, {
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
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
      </div>
    </Container>
  );
}
