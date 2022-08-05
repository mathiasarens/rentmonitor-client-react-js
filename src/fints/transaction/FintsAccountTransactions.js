import RefershIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import React, {useCallback, useEffect, useState} from 'react';
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

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
  },
  right: {
    textAlign: 'right',
  },
}));

export default function FintsAccountTransactions() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [accountTransactionLists, setAccountTransactionLists] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [lastPageSize, setLastPageSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadIncrement = () => {
    setPage(page + 1);
    console.log('Page: ', page);
    load(page + 1, pageSize, accountTransactionLists);
  };

  const reload = () => {
    load(0, (page + 1) * pageSize, []);
  };

  const load = useCallback(
    (page, pageSize, currentListOfLists) => {
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
              console.log('Result list: ', json);
              console.log('Existing lists: ', currentListOfLists);
              setAccountTransactionLists([...currentListOfLists, json]);
              console.log('Number of transactions: ', json.length);
              setLastPageSize(json.length);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              openSnackbar({
                message: t('connectionError'),
                variant: 'error',
              });
              setLoading(false);
            });
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    load(page, pageSize, accountTransactionLists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    [t, navigate, load],
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
      <div className={classes.paper}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('fintsAccountTransactionTitle')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton size="small" aria-label="refresh" onClick={reload}>
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
        {accountTransactionLists.map((accountTransactionList) =>
          accountTransactionList.map((accountTransactionItem) => (
            <Grid
              container
              marginTop={2}
              spacing={1}
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
        <Box mt={3} mb={3}>
          <Button
            disabled={lastPageSize !== pageSize && loading}
            type="submit"
            margin="normal"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={loadIncrement}
          >
            {t('fintsAccountTransactionLoadNextBookingsButton')}
          </Button>
        </Box>
      </div>
    </Container>
  );
}
