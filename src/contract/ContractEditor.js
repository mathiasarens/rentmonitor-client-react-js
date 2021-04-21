import Autocomplete from '@material-ui/core/Autocomplete';
import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import parse from 'date-fns/parse';
import React, {useCallback, useEffect, useState} from 'react';
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
    register,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = (formInputs) => {
    const contractToSubmit = {};
    contractToSubmit.id = contract.id;
    contractToSubmit.clientId = contract.clientId;
    contractToSubmit.tenantId = contract.tenantId;
    contractToSubmit.start = parse(
      formInputs.start,
      t('dateFormat'),
      new Date(),
    );
    if (formInputs.end) {
      contractToSubmit.end = parse(formInputs.end, t('dateFormat'), new Date());
    }
    contractToSubmit.rentDueEveryMonth = parseInt(formInputs.rentDueEveryMonth);
    contractToSubmit.rentDueDayOfMonth = parseInt(formInputs.rentDueDayOfMonth);
    contractToSubmit.amount = Math.trunc(parseFloat(formInputs.amount) * 100);

    console.log('before send', contractToSubmit, formInputs);
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
          console.log('Loaded contract: ', contract);
          contract.amount = contract.amount / 100;
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

  const {
    ref: rentDueEveryMonthRef,
    ...rentDueEveryMonthFormHookRest
  } = register('rentDueEveryMonth', {
    pattern: {
      value: /^\d+$/,
    },
  });

  const {
    ref: rentDueDayOfMonthRef,
    ...rentDueDayOfMonthFormHookRest
  } = register('rentDueDayOfMonth', {
    pattern: {
      value: /^\d+$/,
    },
  });

  const {ref: amountRef, ...amountFormHookRest} = register('amount', {
    required: {
      value: true,
      message: t('contractErrorMessageAmount'),
    },
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: t('contractErrorMessageAmount'),
    },
  });

  const {ref: startRef, ...startFormHookRest} = register('start', {
    required: {
      value: true,
      message: t('contractErrorMessageStart'),
    },
  });

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
            name="tenantId"
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <Autocomplete
                id="teanant-id"
                options={tenants}
                getOptionLabel={(tenant) => (tenant.name ? tenant.name : '')}
                value={
                  contract.tenantId
                    ? tenants.find((tenant) => tenant.id === contract.tenantId)
                    : ''
                }
                onChange={(event, tenant) => {
                  if (tenant !== null) {
                    onChange({...contract, tenantId: tenant.id});
                  }
                }}
                getOptionSelected={(option, value) =>
                  value === '' || option.id === value.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('tenant')}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.tenantId}
                    helperText={
                      errors.tenantId && t('contractErrorMessageTenantId')
                    }
                    required
                  />
                )}
              />
            )}
          />

          <TextField
            {...rentDueEveryMonthFormHookRest}
            variant="outlined"
            margin="normal"
            id="contract-rent-due-every-month"
            label={t('contractRentDueEveryMonth')}
            className={classes.input}
            value={contract.rentDueEveryMonth ? contract.rentDueEveryMonth : ''}
            onChange={(event) => {
              setContract({...contract, rentDueEveryMonth: event.target.value});
            }}
            inputRef={rentDueEveryMonthRef}
            error={errors.rentDueEveryMonth ? true : false}
            helperText={
              errors.rentDueEveryMonth &&
              t('contractErrorMessageRentDueEveryMonth')
            }
            fullWidth
            required
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('contractRentDueDayOfMonth')}
            id="contract-rent-due-day-of-month"
            className={classes.input}
            name="rentDueDayOfMonth"
            value={contract.rentDueDayOfMonth ? contract.rentDueDayOfMonth : ''}
            onChange={(event) => {
              console.log('contractRentDueDayOfMonth', event.target.value);
              setContract({...contract, rentDueDayOfMonth: event.target.value});
            }}
            inputRef={rentDueDayOfMonthRef}
            error={errors.rentDueDayOfMonth ? true : false}
            helperText={
              errors.rentDueDayOfMonth &&
              t('contractErrorMessageRentDueDayOfMonth')
            }
            {...rentDueDayOfMonthFormHookRest}
            required
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('contractAmount')}
            id="contract-amount"
            className={classes.input}
            value={contract.amount ? contract.amount : ''}
            onChange={(event) => {
              setContract({...contract, amount: event.target.value});
            }}
            inputRef={amountRef}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            {...amountFormHookRest}
            required
          />

          <DatePicker
            label={t('contractStart')}
            inputFormat={t('dateFormat')}
            value={contract.start ? contract.start : ''}
            onChange={(date) => setContract({...contract, start: date})}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                id="contract-start"
                fullWidth
                name="start"
                inputRef={startRef}
                error={!!errors.start}
                helperText={errors.start?.message}
                {...startFormHookRest}
                required
              />
            )}
            OpenPickerButtonProps={{
              'aria-label': 'change contract start date',
            }}
          />

          <DatePicker
            disableToolbar
            variant="inline"
            inpuFormat={t('dateFormat')}
            value={contract.end ? contract.end : ''}
            onChange={(date) => setContract({...contract, end: date})}
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
