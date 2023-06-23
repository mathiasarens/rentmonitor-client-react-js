import RefershIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {BOOKING_PATH} from '../../Constants';
import {DeleteConfirmationComponent} from '../../utils/DeleteConfirmationComponent';
import {openSnackbar} from '../../utils/Notifier';
import {FintsAccountTransaction} from './FintsAccountTransaction';

export default function FintsAccountTransactions() {
  const {t} = useTranslation();
  const [accountTransactionLists, setAccountTransactionLists] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [lastPageSize, setLastPageSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState('');

  const observer = useRef();
  const lastItemCallback = useCallback(
    (node) => {
      if (loading) return;
      if (!node) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && lastPageSize === pageSize) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, lastPageSize, pageSize],
  );

  const load = (page, pageSize) => {
    setLoading(true);
    authenticatedFetch(
      `/account-transactions?filter[limit]=${pageSize}&filter[skip]=${
        page * pageSize
      }&filter[order][0]=date%20DESC&filter[order][1]=name%20ASC`,
      navigate,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        response
          .json()
          .then((json) => {
            setAccountTransactionLists((prevListOfList) => [
              ...prevListOfList,
              json,
            ]);
            setLastPageSize(json.length);
            setLoading(false);
          })
          .catch((error) => {
            setLoadingError(t('connectionError'));
            setLoading(false);
          });
      })
      .catch((error) => {
        setLoadingError(t(handleAuthenticationError(error)));
        setLoading(false);
      });
  };

  useEffect(() => {
    load(page, pageSize, accountTransactionLists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const deleteAccountTransaction = useCallback(
    (id) => {
      authenticatedFetch(`/account-transactions/${id}`, navigate, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          console.log(response.statusText);
          if (response.status === 204) {
            load();
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    // eslint-disable-next-line
    [t, navigate],
  );

  const transactionsToBookings = () => {
    const request = {};
    const bodyJson = JSON.stringify(request, null, 2);
    console.log(bodyJson);
    authenticatedFetch('/transaction-to-booking', navigate, {
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
            break;
          default:
            console.error(response);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
        }
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  const createBooking = (accountTransactionItem) => {
    console.log('accountTransactionItem: ', accountTransactionItem);
    navigate(`/${BOOKING_PATH}`, {
      replace: false,
      state: {
        accountTransactionId: accountTransactionItem.id,
        date: accountTransactionItem.date,
        comment: accountTransactionItem.text,
        amount: accountTransactionItem.amount,
      },
    });
  };

  return (
    <Container component="main">
      <CssBaseline />
      <div>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('fintsAccountTransactionTitle')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={() => load(page, pageSize)}
                >
                  <RefershIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={transactionsToBookings}
                >
                  {t('fintsAccountTransactionCreateDueBookingsButton')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {accountTransactionLists.map((accountTransactionList, indexOuter) =>
          accountTransactionList.map((accountTransactionItem, indexInner) => (
            <Grid
              container
              marginTop={2}
              spacing={1}
              ref={
                indexOuter + 1 >= accountTransactionLists.length &&
                indexInner + 1 >= accountTransactionList.length
                  ? lastItemCallback
                  : undefined
              }
              key={accountTransactionItem.id}
            >
              <Grid item xs={12} sm={10}>
                <FintsAccountTransaction
                  accountTransactionItem={accountTransactionItem}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Grid container spacing={1} marginTop={1}>
                  <Grid item>
                    <Button size="small" variant="outlined" aria-label="edit">
                      {t('edit')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <DeleteConfirmationComponent
                      onDelete={() => {
                        deleteAccountTransaction(accountTransactionItem.id);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      aria-label="create booking"
                      onClick={() => {
                        createBooking(accountTransactionItem);
                      }}
                    >
                      {t('fintsAccountTransactionCreateBookingButton')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )),
        )}
        {loadingError && (
          <Box mt={3} mb={3}>
            <Typography component="h1" variant="h5">
              {loadingError}
            </Typography>
            <Box mt={3} mb={3}>
              <Button
                disabled={lastPageSize !== pageSize && loading}
                type="submit"
                margin="normal"
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={() => load(page, pageSize)}
              >
                {t('fintsAccountTransactionLoadNextBookingsButton')}
              </Button>
            </Box>
          </Box>
        )}
        {loading && (
          <Box mt={3} mb={3}>
            <Typography component="h1" variant="h5">
              {t('fintsAccountTransactionsLoading')}
            </Typography>
          </Box>
        )}
      </div>
    </Container>
  );
}
