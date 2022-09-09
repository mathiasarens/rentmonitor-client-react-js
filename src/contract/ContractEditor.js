import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import {red} from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import {DatePicker} from '@mui/x-date-pickers';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {CONTRACTS_PATH} from '../Constants';
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
    marginBottom: theme.spacing(4),
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
  const navigate = useNavigate();
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
      deposit: '',
      start: '',
      end: '',
    },
  });

  const onSubmit = (formInputs) => {
    console.log('before send - formInputs: ', formInputs);
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
    contractToSubmit.amount = parseInt(
      (parseFloat(formInputs.amount) * 100).toFixed(0),
    );
    if (formInputs.deposit) {
      contractToSubmit.deposit = parseInt(
        (parseFloat(formInputs.deposit) * 100).toFixed(0),
      );
    }

    console.log('before send - contractToSubmit: ', contractToSubmit);
    authenticatedFetch(
      contract.id ? `/contracts/${contractToSubmit.id}` : '/contracts',
      navigate,
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
        navigate(`/${CONTRACTS_PATH}`);
      })
      .catch(function (error) {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  const loadContract = (id, tenants) => {
    authenticatedFetch(`/contracts/${id}`, navigate, {
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
          deposit: contract.deposit,
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
      navigate,
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
    loadTenants();
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
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
            name="deposit"
            rules={{
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: t('contractErrorMessageDeposit'),
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                id="contract-deposit"
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('contractDeposit')}
                className={classes.input}
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
                error={!!errors.deposit}
                helperText={errors.deposit?.message}
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
                mask="__.__.____"
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
                mask="__.__.____"
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
