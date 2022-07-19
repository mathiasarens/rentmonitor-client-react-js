import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import {red} from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import sub from 'date-fns/sub';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
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
    marginBottom: theme.spacing(4),
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

export default function FintsAccountSynchronisationOverview() {
  const {t} = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const [accountSettingsItems, setAccountSettingsItems] = useState([]);
  const [synchronizationButtonActive, setSynchronizationButtonActive] =
    useState(false);
  const [numOfExpectedResponses, setNumOfExpectedResponses] = useState(0);
  const {reset, handleSubmit} = useForm({
    defaultValues: {
      accountSettingsItem: null,
      from: sub(new Date(), {months: 2}),
      to: new Date(),
    },
  });

  const loadTenants = () => {
    authenticatedFetch('/account-settings', navigate, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        response.json().then((responseAccountSettingsList) => {
          setAccountSettingsItems(responseAccountSettingsList);
          if (responseAccountSettingsList.length > 0) {
            reset({
              accountSettingsItem: responseAccountSettingsList[0],
              from: sub(new Date(), {months: 2}),
              to: new Date(),
            });
          }
          setSynchronizationButtonActive(true);
        });
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    loadTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const synchronizeAccount = (request) => {
    const bodyJson = JSON.stringify(request, null, 2);
    authenticatedFetch('/account-synchronization/test', navigate, {
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
            setNumOfExpectedResponses(numOfExpectedResponses - 1);
            break;
          case 210:
            response
              .json()
              .then((json) => {
                console.log(json);
                setNumOfExpectedResponses(numOfExpectedResponses - 1);
              })
              .catch((error) => {
                console.error(error);
                openSnackbar({
                  message: t('connectionError'),
                  variant: 'error',
                });
                setNumOfExpectedResponses(numOfExpectedResponses - 1);
              });
            break;
          default:
            console.error(response);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
            setNumOfExpectedResponses(numOfExpectedResponses - 1);
        }
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
        setNumOfExpectedResponses(numOfExpectedResponses - 1);
      });
  };

  const onSubmit = (formInputs) => {
    console.log('formInputs', formInputs);
    setNumOfExpectedResponses(accountSettingsItems.length);
    accountSettingsItems.forEach((accountSettingsItem) => {
      const request = {};
      request.from = sub(new Date(), {months: 2});
      request.to = new Date();
      request.accountSettingsId = accountSettingsItem.id;
      synchronizeAccount(request);
    });
  };

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
          <Box>
            {accountSettingsItems.map((accountSettingsItem) => (
              <Box key={accountSettingsItem.id}>{accountSettingsItem.name}</Box>
            ))}
          </Box>
          <Box marginTop={2} marginBottom={2}>
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={
                !synchronizationButtonActive || numOfExpectedResponses > 0
              }
            >
              {t('fintsAccountSynchronisationButton')}
            </Button>
          </Box>
        </form>
        <Typography component="h1" variant="h5">
          {t('fintsAccountSynchronisationTitle')}
        </Typography>
        <Box>
          {accountSettingsItems.map((accountSettingsItem) => (
            <Box key={accountSettingsItem.id}>{accountSettingsItem.name}</Box>
          ))}
        </Box>
      </div>
    </Container>
  );
}
