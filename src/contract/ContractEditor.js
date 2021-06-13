import Autocomplete from '@material-ui/core/Autocomplete';
import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import {makeStyles} from '@material-ui/styles';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {CONTRACT_PATH} from '../Constants';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';
import {openSnackbar} from '../utils/Notifier';

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

export default function ContractEditor() {
  const {t} = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [tenants, setTenants] = useState([]);
  const [contract, setContract] = useState({});
  const {contractId} = useParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      tenant: null,
      rentDueEveryMonth: '',
      rentDueDayOfMonth: '',
      amount: '',
      start: '',
      end: '',
    },
  });

  const onSubmit = (formInputs) => {
    console.log('before send', formInputs);
    const contractToSubmit = {};
    contractToSubmit.id = contract.id;
    contractToSubmit.clientId = contract.clientId;
    contractToSubmit.tenantId = formInputs.tenant.id;
    contractToSubmit.start = formInputs.start;
    if (formInputs.end) {
      contractToSubmit.end = formInputs.end;
    }
    contractToSubmit.rentDueEveryMonth = parseInt(formInputs.rentDueEveryMonth);
    contractToSubmit.rentDueDayOfMonth = parseInt(formInputs.rentDueDayOfMonth);
    contractToSubmit.amount = Math.trunc(parseFloat(formInputs.amount) * 100);

    console.log('before send', contractToSubmit);
    authenticatedFetch(
      contract.id ? `/contracts/${contractToSubmit.id}` : '/contracts',
      history,
      {
        method: contractToSubmit.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractToSubmit),
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

  const loadContract = (id, tenants) => {
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
        console.log('Loaded contract: ', contract);
        contract.amount = contract.amount / 100;
        setContract(contract);
        console.log(
          'Tenant - loadContract: ',
          tenants,
          contract.tenantId,
          tenants.find((tenant) => tenant.id === contract.tenantId),
        );
        reset({
          tenant: tenants.find((tenant) => tenant.id === contract.tenantId),
          rentDueEveryMonth: contract.rentDueEveryMonth,
          rentDueDayOfMonth: contract.rentDueDayOfMonth,
          amount: contract.amount,
          start: contract.start,
          end: contract.end,
        });
      })
      .catch(function (error) {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  const loadTenants = () => {
    tenantsLoader(
      history,
      (data) => {
        console.log('Set tenants', data);
        setTenants(data);
        console.log('Tenants - loadTenants', tenants);
        if (contractId) {
          loadContract(contractId, data);
        }
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
    console.log('useEffect()');
    loadTenants();
    console.log('Tenants - useEffect', tenants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t('contract')}
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Controller
            control={control}
            name="tenant"
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <Autocomplete
                id="teanant-id"
                options={tenants}
                getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
                getOptionSelected={(option, value) => {
                  console.log('getOptionSelected: ', option, value);
                  return (
                    value === null ||
                    value === undefined ||
                    value === '' ||
                    option.id === value.id
                  );
                }}
                value={value}
                onChange={(event, tenant) => {
                  console.log('onChange - Tenant: ', tenant);
                  onChange(tenant);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('tenant')}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.tenant}
                    helperText={
                      errors.tenant && t('contractErrorMessageTenantId')
                    }
                    required
                  />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="rentDueEveryMonth"
            rules={{
              pattern: {
                value: /^\d+$/,
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                id="contract-rent-due-every-month"
                variant="outlined"
                margin="normal"
                label={t('contractRentDueEveryMonth')}
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
                error={errors.rentDueEveryMonth ? true : false}
                helperText={
                  errors.rentDueEveryMonth &&
                  t('contractErrorMessageRentDueEveryMonth')
                }
                fullWidth
                required
              />
            )}
          />

          <Controller
            control={control}
            name="rentDueDayOfMonth"
            rules={{
              pattern: {
                value: /^\d+$/,
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                id="contract-rent-due-day-of-month"
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('contractRentDueDayOfMonth')}
                className={classes.input}
                value={value}
                onChange={(event) => {
                  console.log('contractRentDueDayOfMonth', event.target.value);
                  onChange(event.target.value);
                }}
                error={errors.rentDueDayOfMonth ? true : false}
                helperText={
                  errors.rentDueDayOfMonth &&
                  t('contractErrorMessageRentDueDayOfMonth')
                }
                required
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            rules={{
              required: {
                value: true,
                message: t('contractErrorMessageAmount'),
              },
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: t('contractErrorMessageAmount'),
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                id="contract-amount"
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('contractAmount')}
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="start"
            rules={{
              required: {
                value: true,
                message: t('contractErrorMessageStart'),
              },
            }}
            render={({field: {onChange, value}}) => (
              <DatePicker
                label={t('contractStart')}
                inputFormat={t('dateFormat')}
                value={value}
                onChange={(date) => onChange(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    margin="normal"
                    id="contract-start"
                    fullWidth
                    name="start"
                    error={!!errors.start}
                    helperText={errors.start?.message}
                    required
                  />
                )}
                OpenPickerButtonProps={{
                  'aria-label': 'change contract start date',
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="end"
            render={({field: {onChange, value}}) => (
              <DatePicker
                disableToolbar
                variant="inline"
                inpuFormat={t('dateFormat')}
                value={value}
                onChange={(date) => onChange(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    margin="normal"
                    id="contract-end"
                    label={t('contractEnd')}
                    fullWidth
                    name="end"
                    error={errors.end ? true : false}
                    helperText={errors.end?.message}
                  />
                )}
                OpenPickerButtonProps={{
                  'aria-label': 'change contract start date',
                }}
              />
            )}
          />

          <Button
            type="submit"
            margin="normal"
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
