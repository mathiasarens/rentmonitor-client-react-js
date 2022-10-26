import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {openSnackbar} from '../../utils/Notifier';

export default function AccountEditorStepTan() {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: 'error',
      });
      return;
    }
    const data = new FormData(event.target);

    authenticatedFetch('/account-settings', navigate, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: stringifyFormData(data),
    })
      .then((response) => {
        response
          .json()
          .then((json) => {
            console.log(json);
            navigate('/fints/accounts');
          })
          .catch((error) => {
            openSnackbar({
              message: t(handleAuthenticationError(error)),
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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography component="h1" variant="h5">
        {t('newAccountSettings')}
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="Name"
        autoFocus
        required
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="fintsBlz"
        label={t('fintsBlz')}
        id="fintsBlz"
        required
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="fintsUrl"
        label={t('fintsUrl')}
        id="fintsUrl"
        required
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="fintsUser"
        label={t('fintsUser')}
        id="fintsUser"
        required
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="fintsPassword"
        label={t('fintsPassword')}
        id="fintsPassword"
        type="password"
        required
      />

      <Button
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        color="primary"
      >
        {t('createTenant')}
      </Button>
    </form>
  );
}

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
