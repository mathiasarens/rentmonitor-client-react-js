import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {Auth} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {OVERVIEW_PATH} from '../../Constants';

export function SignIn(props) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState(undefined);
  const [signInButtonActive, setSignInButtonActive] = useState(true);

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
    clearErrors,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (formInputs) => {
    console.log('SignIn - onSubmit: ' + JSON.stringify(formInputs));
    setFormInputs(formInputs);
  };

  const onError = (error) => {
    console.log('SignIn - onError: ' + JSON.stringify(error));
  };

  useEffect(() => {
    console.log('SignIn - useEffect: ' + JSON.stringify(formInputs));
    if (formInputs) {
      console.log(
        'SignIn - useEffect - formInputs: ' + JSON.stringify(formInputs),
      );
      setSignInButtonActive(false);
      Auth.signIn(formInputs.email, formInputs.password)
        .then((data) => {
          console.log('SignIn - LoggedIn: ' + JSON.stringify(data));
          props.loadCurrentAuthenticatedUser();
          navigate(`/${OVERVIEW_PATH}`);
        })
        .catch((error) => {
          console.error(`SignIn - Error: ${JSON.stringify(error)}`);
          setError('loginState', {type: 'custom', message: t('signInError')});
          setSignInButtonActive(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInputs]);

  return (
    <>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t('signinHeadline')}
      </Typography>
      <form
        noValidate
        onSubmit={(e) => {
          clearErrors();
          handleSubmit(onSubmit, onError)(e);
        }}
      >
        {errors.loginState && (
          <Alert severity="error">{errors.loginState.message}</Alert>
        )}
        <Controller
          control={control}
          name="email"
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
              required
              fullWidth
              label={t('emailAddress')}
              autoFocus
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              error={errors.email ? true : false}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
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
              required
              fullWidth
              label={t('password')}
              type="password"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
            />
          )}
        />

        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label={t('signinRemmeberMe')}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={!signInButtonActive}
        >
          {t('signinButton')}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              {t('forgotPassword')}
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              {t('signinSignup')}
            </Link>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
