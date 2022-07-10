import Button from '@mui/material/Button';
import {red} from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {TENANTS_PATH} from '../Constants';
import {openSnackbar} from '../utils/Notifier';
import {tenantLoader} from './dataaccess/tenantLoader';

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

export default function TenantEditor() {
  const {t} = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState({});
  const {tenantId} = useParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      accountSynchronisationName: '',
    },
  });

  const loadTenant = (id) => {
    tenantLoader(
      id,
      navigate,
      (data) => {
        setTenant(data);
        //console.log(`Loaded tenant: ${JSON.stringify(data)}`);
        reset({
          name: data.name !== null ? data.name : '',
          email: data.email !== null ? data.email : '',
          phone: data.phone !== null ? data.phone : '',
          accountSynchronisationName:
            data.accountSynchronisationName !== null
              ? data.accountSynchronisationName
              : '',
        });
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
    if (tenantId) {
      loadTenant(tenantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (formInputs) => {
    const updatedTenant = tenant;
    updatedTenant.name = formInputs.name;
    updatedTenant.email = formInputs.email;
    updatedTenant.phone = formInputs.phone;
    updatedTenant.accountSynchronisationName =
      formInputs.accountSynchronisationName;
    setTenant(updatedTenant);
    authenticatedFetch(
      updatedTenant.id ? `/tenants/${updatedTenant.id}` : '/tenants',
      navigate,
      {
        method: updatedTenant.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTenant),
      },
    )
      .then(function (response) {
        navigate(`/${TENANTS_PATH}`);
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
          {t('tenant')}
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                autoComplete="Name"
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
                autoFocus
                required
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('email')}
                type="email"
                id="email"
                autoComplete="your@email.com"
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({field: {onChange, value}}) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('phone')}
                type="phone"
                id="phone"
                autoComplete="+49 170 123456789"
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="accountSynchronisationName"
            rules={{
              maxLength: {
                value: 255,
                message: t('tenantErrorMessageAccountSynchronisationName'),
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('tenantAccountSynchronizationName')}
                id="tenant-account-sync-name"
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
                error={errors.accountSynchronisationName ? true : false}
                helperText={errors.accountSynchronisationName?.message}
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
            {t('tenantSave')}
          </Button>
        </form>
      </div>
    </Container>
  );
}
