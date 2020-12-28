import { Button } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import sub from 'date-fns/sub';
import React, { useEffect, useReducer } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError
} from '../../authentication/authenticatedFetch';
import { openSnackbar } from '../../notifier/Notifier';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
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

export default function FintsAccountSynchronisationSingle() {
  const SET_LABEL_WIDTH = 'SET_LABEL_WIDTH';
  const SET_ACCOUNT_SETTINGS_LIST = 'SET_ACCOUNT_SETTINGS_LIST';
  const SET_CHALLENGE_TEXT = 'SET_CHALLENGE_TEXT';
  const SET_ACCOUNT_ID = 'SET_ACCOUNT_ID';
  const SET_FROM_DATE = 'SET_FROM_DATE';
  const SET_TO_DATE = 'SET_TO_DATE';

  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { accountSettingsId } = useParams();
  const { register, handleSubmit, control, errors } = useForm();

  const inputLabel = React.useRef(null);
  const initialState = {
    accountSettingsList: [],
    fromDate: sub(new Date(), { months: 2 }),
    toDate: new Date(),
    challengeText: '',
    accountSettingsIdSelected: '',
    labelWidth: 0,
  };

  let tanRequiredJsx;

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case SET_LABEL_WIDTH:
        return {
          ...state,
          labelWidth: payload,
        };
      case SET_ACCOUNT_SETTINGS_LIST:
        console.log('Reducer set accountSettingsList: ', payload)
        return {
          ...state,
          accountSettingsList: payload,
        };
      case SET_CHALLENGE_TEXT:
        return {
          ...state,
          challengeText: payload,
        };
      case SET_ACCOUNT_ID:
        console.log('Reducer set accountSettingsIdSelected: ', payload)
        return {
          ...state,
          accountSettingsIdSelected: payload,
        };
      case SET_FROM_DATE:
        return {
          ...state,
          selectedFromDate: payload,
        };
      case SET_TO_DATE:
        return {
          ...state,
          selectedToDate: payload,
        };
      default:
        throw new Error(`Action type ${type} unknown`);
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: SET_LABEL_WIDTH, payload: inputLabel.current.offsetWidth });

    authenticatedFetch('/account-settings', history, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        response.json().then((responseAccountSettingsList) => {
          dispatch({ type: SET_ACCOUNT_SETTINGS_LIST, payload: responseAccountSettingsList });
          if (accountSettingsId) {
            if (responseAccountSettingsList.filter(accountSettings => accountSettings.id === parseInt(accountSettingsId)).length > 0) {
              console.log('Account Settings loaded. Set accountSettingsId ', parseInt(accountSettingsId));
              dispatch({ type: SET_ACCOUNT_ID, payload: parseInt(accountSettingsId) });
            }
          }
        });
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  }, [dispatch, history, t, accountSettingsId]);

  const synchroniseAccounts = (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: 'error',
      });
      return;
    }
    const formData = new FormData(event.target);
    const formDataJs = convertFromDataToJsObject(formData);
    const formDataToSubmit = Object.assign({}, formDataJs, {
      from: state.selectedFromDate,
      to: state.selectedToDate,
      accountSettingsId: state.accountSettingsIdSelected,
    });
    const bodyJson = JSON.stringify(formDataToSubmit, null, 2);
    console.log(bodyJson);
    authenticatedFetch('/account-synchronization/single', history, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: bodyJson,
    })
      .then((response) => {
        switch (response.status) {
          case 200:
            response.json().then((json) => {
              console.log(json);
              openSnackbar({
                message: t('fintsAccountSyncronisationSuccess', {
                  newBookingsCount: json.newBookings,
                  unmatchedTransactions: json.unmatchedTransactions,
                }),
                variant: 'info',
              });
            });
            clearTanForm();
            break;
          case 210:
            response
              .json()
              .then((json) => {
                console.log(json);
                dispatch({
                  type: SET_CHALLENGE_TEXT,
                  payload: json.challengeText,
                });
              })
              .catch((error) => {
                console.error(error);
                openSnackbar({
                  message: t('connectionError'),
                  variant: 'error',
                });
                clearTanForm();
              });
            break;
          default:
            console.error(response);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
            clearTanForm();
        }
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
        clearTanForm();
      });
  };

  function clearTanForm() {
    dispatch({ type: SET_CHALLENGE_TEXT, payload: '' });
  }

  if (state.challengeText.length > 0) {
    tanRequiredJsx = (
      <div>
        <Typography component="h6" variant="h6">
          {state.challengeText}
        </Typography>
        <TextField
          id="tanId"
          variant="outlined"
          margin="normal"
          fullWidth
          name="tan"
          label="tan"
          className={classes.input}
        />
      </div>
    );
  } else {
    tanRequiredJsx = <div></div>;
  }

  const accountDropdownMenuItems = state.accountSettingsList.map(
    (accountSettings) => (
      <MenuItem key={accountSettings.id} value={accountSettings.id}>
        {accountSettings.name}
      </MenuItem>
    ),
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t('fintsAccountSynchronisationTitle')}
        </Typography>
        <form
          onSubmit={synchroniseAccounts}
          className={classes.form}
          noValidate
        >
          <FormControl variant="outlined" className={classes.form} fullWidth margin="normal">
            <InputLabel ref={inputLabel} id="accountId">
              {t('account')}
            </InputLabel>
            <Controller
              as={
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  labelWidth={state.labelWidth}
                  value={state.accountSettingsIdSelected}
                  onChange={(event) => {
                    dispatch({ type: SET_ACCOUNT_ID, payload: event.target.value });
                  }}
                >
                  {accountDropdownMenuItems}
                </Select>
              }
              name='accountSettingsIdSelected'
              control={control}

            />
          </FormControl>

          <DatePicker
            label={t('fintsAccountSyncronisationFrom')}
            value={state.fromDate}
            onChange={(date) => {
              dispatch({ type: SET_FROM_DATE, payload: date });
            }}
            inputFormat={t('dateFormat')}
            renderInput={(params) => (
              <TextField {...params}
                variant="outlined"
                margin="normal"
                name="fromDate"
                inputRef={register({
                  required: {
                    value: true,
                    message: t('fintsAccountSynchronisationErrorFrom'),
                  },
                })}
                error={errors.fromDate ? true : false}
                helperText={errors.fromDate?.message}
                fullWidth
                required
              />
            )}
          />

          <DatePicker
            label={t('fintsAccountSyncronisationTo')}
            value={state.selectedToDate}
            onChange={(date) => {
              dispatch({ type: SET_TO_DATE, payload: date });
            }}
            inputFormat={t('dateFormat')}
            renderInput={(params) => (
              <TextField {...params}
                variant="outlined"
                margin="normal"
                name="toDate"
                inputRef={register({
                  required: {
                    value: true,
                    message: t('fintsAccountSynchronisationToFrom'),
                  },
                })}
                error={errors.toDate ? true : false}
                helperText={errors.toDate?.message}
                fullWidth />
            )}
          />

          {tanRequiredJsx}

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('fintsAccountSynchronisationButton')}
          </Button>
        </form>
      </div>
    </Container>
  );
}

function convertFromDataToJsObject(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}
