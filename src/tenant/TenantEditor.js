import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {TENANT_PATH} from '../Constants';
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
  const history = useHistory();
  const [tenant, setTenant] = useState({});
  const {tenantId} = useParams();

  const loadTenant = useCallback(
    (id) => {
      tenantLoader(
        id,
        history,
        (data) => {
          setTenant(data);
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

  useEffect(() => {
    if (tenantId) {
      loadTenant(tenantId);
    }
  }, [loadTenant, tenantId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: 'error',
      });
      return;
    }

    authenticatedFetch(
      tenant.id ? `/tenants/${tenant.id}` : '/tenants',
      history,
      {
        method: tenant.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenant),
      },
    )
      .then(function (response) {
        history.push(TENANT_PATH);
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
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="Name"
            className={classes.input}
            value={tenant.name ? tenant.name : ''}
            onChange={(event) => {
              setTenant({...tenant, name: event.target.value});
            }}
            autoFocus
            required
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="email"
            label={t('email')}
            type="email"
            id="email"
            autoComplete="your@email.com"
            className={classes.input}
            value={tenant.email ? tenant.email : ''}
            onChange={(event) => {
              setTenant({...tenant, email: event.target.value});
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="phone"
            label={t('phone')}
            type="phone"
            id="phone"
            autoComplete="+49 170 123456789"
            className={classes.input}
            value={tenant.phone ? tenant.phone : ''}
            onChange={(event) => {
              setTenant({...tenant, phone: event.target.value});
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('tenantAccountSynchronizationName')}
            id="tenant-account-sync-name"
            className={classes.input}
            value={
              tenant.accountSynchronisationName
                ? tenant.accountSynchronisationName
                : ''
            }
            onChange={(event) => {
              setTenant({
                ...tenant,
                accountSynchronisationName: event.target.value,
              });
            }}
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
