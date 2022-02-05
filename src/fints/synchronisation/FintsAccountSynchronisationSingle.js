import DatePicker from '@mui/lab/DatePicker';
import {Button} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import {red} from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import sub from 'date-fns/sub';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
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
  const {t} = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const {accountSettingsId} = useParams();
  const [accountSettingsItems, setAccountSettingsItems] = useState([]);
  const [challengeText, setChallengeText] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      accountSettingsItem: null,
      from: sub(new Date(), {months: 2}),
      to: new Date(),
    },
  });

  let tanRequiredJsx;

  useEffect(() => {
    authenticatedFetch('/account-settings', navigate, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        response.json().then((responseAccountSettingsList) => {
          setAccountSettingsItems(responseAccountSettingsList);
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
              reset({
                accountSettingsItem: responseAccountSettingsList.filter(
                  (accountSettings) =>
                    accountSettings.id === parseInt(accountSettingsId),
                )[0],
              });
            }
          } else {
            if (responseAccountSettingsList.length > 0) {
              reset({
                accountSettingsItem: responseAccountSettingsList[0],
                from: sub(new Date(), {months: 2}),
                to: new Date(),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (formInputs) => {
    console.log('formInputs', formInputs);
    setLoading(true);
    const request = {};
    request.from = formInputs.from;
    request.to = formInputs.to;
    request.accountSettingsId = formInputs.accountSettingsItem.id;
    const bodyJson = JSON.stringify(request, null, 2);
    console.log(bodyJson);
    authenticatedFetch('/account-synchronization/single', navigate, {
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
            setLoading(false);
            break;
          case 210:
            response
              .json()
              .then((json) => {
                console.log(json);
                setChallengeText(json.challengeText);
                setLoading(false);
              })
              .catch((error) => {
                console.error(error);
                openSnackbar({
                  message: t('connectionError'),
                  variant: 'error',
                });
                clearTanForm();
                setLoading(false);
              });
            break;
          default:
            console.error(response);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
            clearTanForm();
            setLoading(false);
        }
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
        clearTanForm();
        setLoading(false);
      });
  };

  function clearTanForm() {
    setChallengeText('');
  }

  if (challengeText.length > 0) {
    tanRequiredJsx = (
      <div>
        <Typography component="h6" variant="h6">
          {challengeText}
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
          <Controller
            control={control}
            name="accountSettingsItem"
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <Autocomplete
                id="account-settings-item-id"
                options={accountSettingsItems}
                getOptionLabel={(accountSettings) =>
                  accountSettings.name ? accountSettings.name : ''
                }
                value={value}
                onChange={(event, accountSettingsItem) => {
                  console.log(
                    'onChange - accountSettingsItem: ',
                    accountSettingsItem,
                  );
                  onChange(accountSettingsItem);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('account')}
                    margin="normal"
                    variant="outlined"
                    error={errors.accountSettingsId ? true : false}
                    helperText={
                      errors.accountSettingsId &&
                      t('fintsAccountSynchronisationErrorAccountSettingsId')
                    }
                    required
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="from"
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <DatePicker
                label={t('fintsAccountSyncronisationFrom')}
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
                    error={errors.from ? true : false}
                    helperText={
                      errors.from && t('fintsAccountSynchronisationErrorFrom')
                    }
                    fullWidth
                    required
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="to"
            rules={{required: false}}
            render={({field: {onChange, value}}) => (
              <DatePicker
                label={t('fintsAccountSyncronisationTo')}
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
                    error={errors.to ? true : false}
                    helperText={
                      errors.to && t('fintsAccountSynchronisationToFrom')
                    }
                    fullWidth
                  />
                )}
              />
            )}
          />

          {tanRequiredJsx}
          <Box marginTop={2} marginBottom={2}>
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {t('fintsAccountSynchronisationButton')}
            </Button>
          </Box>
        </form>
      </div>
    </Container>
  );
}
