import {Button} from '@material-ui/core';
import Autocomplete from '@material-ui/core/Autocomplete';
import {red} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import parse from 'date-fns/parse';
import sub from 'date-fns/sub';
import React, {useEffect, useReducer} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {openSnackbar} from '../../utils/Notifier';

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
  const SET_ACCOUNT_SETTINGS_LIST = 'SET_ACCOUNT_SETTINGS_LIST';
  const SET_CHALLENGE_TEXT = 'SET_CHALLENGE_TEXT';
  const SET_ACCOUNT_ID = 'SET_ACCOUNT_ID';
  const SET_FROM_DATE = 'SET_FROM_DATE';
  const SET_TO_DATE = 'SET_TO_DATE';

  const {t} = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const {accountSettingsId} = useParams();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const initialState = {
    accountSettingsList: [],
    fromDate: sub(new Date(), {months: 2}),
    toDate: new Date(),
    challengeText: '',
    accountSettingsIdSelected: '',
    labelWidth: 0,
  };

  let tanRequiredJsx;

  const reducer = (state, {type, payload}) => {
    switch (type) {
      case SET_ACCOUNT_SETTINGS_LIST:
        console.log('Reducer set accountSettingsList: ', payload);
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
        console.log(
          'Reducer set accountSettingsIdSelected: ',
          payload,
          typeof payload,
        );
        return {
          ...state,
          accountSettingsIdSelected: payload,
        };
      case SET_FROM_DATE:
        return {
          ...state,
          fromDate: payload,
        };
      case SET_TO_DATE:
        return {
          ...state,
          toDate: payload,
        };
      default:
        throw new Error(`Action type ${type} unknown`);
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    authenticatedFetch('/account-settings', history, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        response.json().then((responseAccountSettingsList) => {
          dispatch({
            type: SET_ACCOUNT_SETTINGS_LIST,
            payload: responseAccountSettingsList,
          });
          if (accountSettingsId) {
            if (
              responseAccountSettingsList.filter(
                (accountSettings) =>
                  accountSettings.id === parseInt(accountSettingsId),
              ).length > 0
            ) {
              console.log(
                'Account Settings loaded. Set accountSettingsId ',
                accountSettingsId,
              );
              dispatch({
                type: SET_ACCOUNT_ID,
                payload: parseInt(accountSettingsId),
              });
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

  const onSubmit = (formInputs) => {
    console.log('formInputs', formInputs);
    const request = {};
    request.from = parse(formInputs.from, t('dateFormat'), state.fromDate);
    request.to = parse(formInputs.to, t('dateFormat'), state.toDate);
    request.accountSettingsId = state.accountSettingsIdSelected;
    const bodyJson = JSON.stringify(request, null, 2);
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
    dispatch({type: SET_CHALLENGE_TEXT, payload: ''});
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

  const {
    ref: accountSettingsIdFormHookRef,
    ...accountSettingsIdFormHookRest
  } = register('accountSettingsId', {
    required: true,
  });

  const {ref: fromFormHookRef, ...fromFormHookRest} = register('from', {
    required: true,
  });

  const {ref: toFormHookRef, ...toFormHookRest} = register('to', {
    required: true,
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t('fintsAccountSynchronisationTitle')}
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Autocomplete
            id="account-settings-id"
            options={state.accountSettingsList}
            getOptionLabel={(accountSettings) =>
              accountSettings.name ? accountSettings.name : ''
            }
            getOptionSelected={(option, value) =>
              value === undefined || value === '' || option.id === value.id
            }
            value={
              state.accountSettingsIdSelected
                ? state.accountSettingsList.find(
                    (accountSettings) =>
                      accountSettings.id === state.accountSettingsIdSelected,
                  )
                : ''
            }
            onChange={(event, accountSettings) => {
              console.log('SET_ACCOUNT_ID onChange called');
              if (accountSettings !== null) {
                dispatch({type: SET_ACCOUNT_ID, payload: accountSettings.id});
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...accountSettingsIdFormHookRest}
                label={t('account')}
                margin="normal"
                variant="outlined"
                inputRef={accountSettingsIdFormHookRef}
                error={errors.accountSettingsId ? true : false}
                helperText={
                  errors.accountSettingsId &&
                  t('fintsAccountSynchronisationErrorAccountSettingsId')
                }
                required
              />
            )}
          />

          <DatePicker
            label={t('fintsAccountSyncronisationFrom')}
            value={state.fromDate}
            onChange={(date) => {
              dispatch({type: SET_FROM_DATE, payload: date});
            }}
            inputFormat={t('dateFormat')}
            renderInput={(params) => (
              <TextField
                {...params}
                {...fromFormHookRest}
                variant="outlined"
                margin="normal"
                inputRef={fromFormHookRef}
                error={errors.from ? true : false}
                helperText={
                  errors.from && t('fintsAccountSynchronisationErrorFrom')
                }
                fullWidth
                required
              />
            )}
          />

          <DatePicker
            label={t('fintsAccountSyncronisationTo')}
            value={state.toDate}
            onChange={(date) => {
              dispatch({type: SET_TO_DATE, payload: date});
            }}
            inputFormat={t('dateFormat')}
            renderInput={(params) => (
              <TextField
                {...params}
                {...toFormHookRest}
                variant="outlined"
                margin="normal"
                inputRef={toFormHookRef}
                error={errors.to ? true : false}
                helperText={errors.to && t('fintsAccountSynchronisationToFrom')}
                fullWidth
              />
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
