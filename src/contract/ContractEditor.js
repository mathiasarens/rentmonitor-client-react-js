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
import {CONTRACT_PATH} from '../Constants';
import {openSnackbar} from '../notifier/Notifier';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';

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
  const [tenants, setTenants] = useState([]);
  const [contract, setContract] = useState({});
  const {contractId} = useParams();

  const handleSubmit = (event) => {
    console.log('before send', contract);
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: 'error',
      });
      return;
    }

    authenticatedFetch(
      contract.id ? `/contracts/${contract.id}` : '/contracts',
      history,
      {
        method: contract.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contract),
      },
    )
      .then(function (response) {
        history.push(CONTRACT_PATH);
      })
      .catch(function (error) {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  const loadContract = useCallback(
    (id) => {
      authenticatedFetch(`/contracts/${id}`, history, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((contract) => {
          setContract(contract);
        })
        .catch(function (error) {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
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
    if (contractId) {
      loadContract(contractId);
    }
  }, [loadTenants, loadContract, contractId]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t('contract')}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Autocomplete
            id="teanant-id"
            options={tenants}
            getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
            onChange={(event, tenant) => {
              if (tenant !== null) {
                console.log('tenantId autocomplete onChange ', tenant);
                setContract({...contract, tenantId: tenant.id});
              }
            }}
            value={contract.tenantId ? contract.tenantId : ''}
            getOptionSelected={(option, value) => {
              console.log(
                'tenantId autocomplete getSelectedOption',
                option,
                value,
              );
              return (
                value === '' ||
                (typeof value === 'number'
                  ? option.id === value
                  : option.id === value.id)
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('tenant')} variant="outlined" />
            )}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="contract-rent-due-every-month"
            label={t('contractRentDueEveryMonth')}
            name="rentDueEveryMonth"
            autoComplete="1"
            className={classes.input}
            type="number"
            required
            value={contract.rentDueEveryMonth ? contract.rentDueEveryMonth : ''}
            onChange={(event, value) => {
              setContract({...contract, rentDueEveryMonth: value});
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="rentDueDayOfMonth"
            label={t('contractRentDueDayOfMonth')}
            id="contract-rent-due-day-of-month"
            type="number"
            autoComplete="10"
            className={classes.input}
            required
            value={contract.rentDueDayOfMonth ? contract.rentDueDayOfMonth : ''}
            onChange={(event, value) => {
              setContract({...contract, rentDueDayOfMonth: value});
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="amount"
            label={t('contractAmount')}
            id="contract-amount"
            type="number"
            className={classes.input}
            required
            value={contract.amount ? contract.amount : ''}
            onChange={(event, value) => {
              setContract({...contract, amount: value});
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format={t('dateFormat')}
              margin="normal"
              id="contract-start"
              label={t('contractStart')}
              value={contract.start ? contract.start : ''}
              onChange={(event, value) => {
                console.log('contractStart DatePicker start', contract.start);
                setContract({...contract, start: value});
              }}
              fullWidth
              inputVariant="outlined"
              KeyboardButtonProps={{
                'aria-label': 'change contract commencement day',
              }}
            />
          </MuiPickersUtilsProvider>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('contractSave')}
          </Button>
        </form>
      </div>
    </Container>
  );
}
