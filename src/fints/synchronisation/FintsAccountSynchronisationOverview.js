import {Button, Skeleton, Stack} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import sub from 'date-fns/sub';
import React, {useCallback, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {Booking} from '../../booking/Booking';
import {tenantsLoader} from '../../tenant/dataaccess/tenantLoader';
import {openSnackbar} from '../../utils/Notifier';
import {FintsAccountTransaction} from '../transaction/FintsAccountTransaction';

export default function FintsAccountSynchronisationOverview() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [accountSettingsItems, setAccountSettingsItems] = useState([]);
  const [synchronizationButtonActive, setSynchronizationButtonActive] =
    useState(false);
  const [expectedSyncResults, setExpectedSyncResults] = useState([]);
  const [syncResults, setSyncResults] = useState([]);
  const [tenantsMap, setTenantsMap] = useState(new Map());
  const {control, reset, handleSubmit} = useForm({
    defaultValues: {
      accountSettingsItem: null,
      from: sub(new Date(), {months: 2}),
      to: new Date(),
    },
  });

  const loadAccountSettings = () => {
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

  const loadTenants = () => {
    tenantsLoader(
      navigate,
      (data) => {
        setTenantsMap(
          data.reduce((map, tenant) => {
            map[tenant.id] = tenant;
            return map;
          }, {}),
        );
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
    loadAccountSettings();
    loadTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = useCallback(
    (formInputs) => {
      const synchronizeAccount = (request) => {
        const bodyJson = JSON.stringify(request, null, 2);
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
                  console.log(
                    'Sync result received for: ' +
                      json.accountName +
                      ' (' +
                      json.accountSettingsId +
                      ')',
                  );
                  setSyncResults((prevSyncResults) => [
                    ...prevSyncResults,
                    json,
                  ]);
                });
                setExpectedSyncResults((arr) => {
                  arr.pop();
                  return arr;
                });
                break;
              case 210:
                response
                  .json()
                  .then((json) => {
                    console.log('Status code 210 - Input for TAN');
                    console.log(json);
                    setExpectedSyncResults((arr) => {
                      arr.pop();
                      return arr;
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    openSnackbar({
                      message: t('connectionError'),
                      variant: 'error',
                    });
                    setExpectedSyncResults((arr) => {
                      arr.pop();
                      return arr;
                    });
                  });
                break;
              default:
                console.error(response);
                openSnackbar({
                  message: t('connectionError'),
                  variant: 'error',
                });
                setExpectedSyncResults((arr) => {
                  arr.pop();
                  return arr;
                });
            }
          })
          .catch((error) => {
            openSnackbar({
              message: t(handleAuthenticationError(error)),
              variant: 'error',
            });
            setExpectedSyncResults((arr) => {
              arr.pop();
              return arr;
            });
          });
      };

      setExpectedSyncResults(new Array(accountSettingsItems.length).fill(0));
      setSyncResults([]);
      accountSettingsItems.forEach((accountSettingsItem) => {
        const request = {};
        request.from = formInputs.from;
        request.to = formInputs.to;
        request.accountSettingsId = accountSettingsItem.id;
        synchronizeAccount(request);
      });
    },
    [accountSettingsItems, navigate, t],
  );

  const onSubmit = (formInputs) => {
    sync(formInputs);
  };

  return (
    <>
      <Grid
        container
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={12} sm={4}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography component="h2" variant="h5">
              {t('fintsAccountSynchronisationTitle')}
            </Typography>
            <Box>
              {synchronizationButtonActive &&
                accountSettingsItems.map((accountSettingsItem) => (
                  <Box key={accountSettingsItem.id} sx={{display: 'flex'}}>
                    <Typography
                      color={syncResults
                        .filter(
                          (syncResult) =>
                            syncResult.accountSettingsId ===
                            accountSettingsItem.id,
                        )
                        .map((syncResult) =>
                          syncResult.error === undefined ? 'black' : 'red',
                        )}
                    >
                      {accountSettingsItem.name}
                    </Typography>
                  </Box>
                ))}
              {!synchronizationButtonActive && (
                <Stack>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Stack>
              )}
            </Box>
            <Box marginTop={2} marginBottom={2}>
              <Typography component="h2" variant="h5">
                {t('fintsAccountSynchronisationPeriod')}
              </Typography>
              <Box marginTop={2} marginBottom={2}>
                <Controller
                  control={control}
                  name="from"
                  render={({field: {onChange, value}}) => (
                    <DatePicker
                      label={t('fintsAccountSynchronisationPeriodFrom')}
                      value={value}
                      onChange={(date) => onChange(date)}
                    />
                  )}
                />
              </Box>
              <Box marginTop={2} marginBottom={2}>
                <Controller
                  control={control}
                  name="to"
                  render={({field: {onChange, value}}) => (
                    <DatePicker
                      label={t('fintsAccountSynchronisationPeriodTo')}
                      value={value}
                      onChange={(date) => onChange(date)}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box marginTop={2} marginBottom={2}>
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                disabled={
                  !(
                    synchronizationButtonActive &&
                    expectedSyncResults.length === 0
                  )
                }
              >
                {t('fintsAccountSynchronisationButton')}
              </Button>
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          {syncResults.map((syncResult) => (
            <Box key={syncResult.accountSettingsId} marginBottom={2}>
              <Typography component="h2" variant="h5">
                {syncResult.accountName}
              </Typography>
              {syncResult.error && (
                <Alert severity="error">{syncResult.error}</Alert>
              )}
              <Box>
                {syncResult.newBookings?.length > 0 && (
                  <Typography component="h3" variant="h7">
                    {t('fintsAccountSynchronisationResultNewBookings')}
                  </Typography>
                )}
                {syncResult.newBookings?.map((newBooking) => (
                  <Grid
                    container
                    marginTop={2}
                    spacing={1}
                    key={`newBookings${syncResult.accountSettingsId}${newBooking.id}`}
                  >
                    <Grid item xs={12}>
                      <Booking
                        bookingListItem={newBooking}
                        tenantsMap={tenantsMap}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Box>
              <Box marginTop={2}>
                {syncResult.unmatchedTransactions?.length > 0 && (
                  <Typography component="h3" variant="h7">
                    {t('fintsAccountSynchronisationResultNewTransactions')}
                  </Typography>
                )}
                {syncResult.unmatchedTransactions?.map(
                  (unmatchedTransaction) => (
                    <Grid
                      container
                      marginTop={2}
                      spacing={1}
                      key={`unmatchedTransaction${syncResult.accountSettingsId}${unmatchedTransaction.id}`}
                    >
                      <Grid item xs={12}>
                        <FintsAccountTransaction
                          accountTransactionItem={unmatchedTransaction}
                        />
                      </Grid>
                    </Grid>
                  ),
                )}
              </Box>
              {syncResult.newBookings?.length === 0 &&
                syncResult.unmatchedTransactions?.length === 0 &&
                syncResult.error === undefined && (
                  <Typography component="h5" variant="h7">
                    {t('fintsAccountSynchronisationResultNoTransactions')}
                  </Typography>
                )}
            </Box>
          ))}
          <Stack>
            {expectedSyncResults.map((item, index) => (
              <Skeleton key={`expectedSyncResults-${index}`} variant="text" />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
