import Autocomplete from '@material-ui/core/Autocomplete';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import parse from 'date-fns/parse';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError
} from '../authentication/authenticatedFetch';
import { CONTRACT_PATH } from '../Constants';
import { openSnackbar } from '../notifier/Notifier';
import { tenantsLoader } from '../tenant/dataaccess/tenantLoader';

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
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [tenants, setTenants] = useState([]);
  const [contract, setContract] = useState({});
  const { contractId } = useParams();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (formInputs) => {
    const contractToSubmit = {};
    contractToSubmit.id = contract.id;
    contractToSubmit.clientId = contract.clientId;
    contractToSubmit.tenantId = contract.tenantId;
    contractToSubmit.start = parse(formInputs.start, t('dateFormat'), new Date());
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
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
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
                setContract({ ...contract, tenantId: tenant.id });
              }
            }}
            getOptionSelected={(option, value) =>
              value === '' || option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label={t('tenant')}
                margin="normal"
                variant="outlined"
                name="tenantId"
                inputRef={register({
                  required: {
                    value: true,
                    message: t('contractErrorMessageTenantId'),
                  },
                })}
                error={errors.tenantId ? true : false}
                helperText={errors.tenantId?.message}
                required />
            )}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="contract-rent-due-every-month"
            label={t('contractRentDueEveryMonth')}
            className={classes.input}
            type="number"
            name="rentDueEveryMonth"
            value={contract.rentDueEveryMonth ? contract.rentDueEveryMonth : 0}
            onChange={(event) => {
              setContract({ ...contract, rentDueEveryMonth: event.target.value });
            }}
            inputRef={register({
              required: {
                value: true,
                message: t('contractErrorMessageRentDueEveryMonth'),
              },
            })}
            error={errors.rentDueEveryMonth ? true : false}
            helperText={errors.rentDueEveryMonth?.message}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('contractRentDueDayOfMonth')}
            id="contract-rent-due-day-of-month"
            type="number"
            className={classes.input}
            name="rentDueDayOfMonth"
            value={contract.rentDueDayOfMonth ? contract.rentDueDayOfMonth : 0}
            onChange={(event) => {
              console.log('contractRentDueDayOfMonth', event.target.value);
              setContract({ ...contract, rentDueDayOfMonth: event.target.value });
            }}
            inputRef={register({
              required: {
                value: true,
                message: t('contractErrorMessageRentDueDayOfMonth'),
              },
            })}
            error={errors.rentDueDayOfMonth ? true : false}
            helperText={errors.rentDueDayOfMonth?.message}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('contractAmount')}
            id="contract-amount"
            type="number"
            className={classes.input}
            name="amount"
            value={contract.amount ? contract.amount : 0}
            onChange={(event) => {
              setContract({ ...contract, amount: event.target.value });
            }}
            inputRef={register({
              required: {
                value: 255,
                message: t('contractErrorMessageAmount'),
              },
              pattern: {
                value: '^-?d+(.d{1,2})?$',
                message: t('contractErrorMessageAmount'),
              },
            })}
            error={errors.amount ? true : false}
            helperText={errors.amount?.message}
            required
          />
          <DatePicker
            label={t('contractStart')}
            inputFormat={t('dateFormat')}
            value={contract.start ? contract.start : ''}
            onChange={(date) => setContract({ ...contract, start: date })}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                id="contract-start"
                fullWidth
                name="start"
                inputRef={register({
                  required: {
                    value: 255,
                    message: t('contractErrorMessageStart'),
                  },
                })}
                error={errors.start ? true : false}
                helperText={errors.start?.message}
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
            onChange={(date) => setContract({ ...contract, end: date })}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                id="contract-end"
                label={t('contractEnd')}
                fullWidth
                name="end"
                inputRef={register()}
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
