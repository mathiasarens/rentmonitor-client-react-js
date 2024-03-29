import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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

export default function AccountEditorStepInitial() {
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
        >
          {t('connectFints')}
        </Button>
      </form>
    </>
  );
}
