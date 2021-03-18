import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import RefershIcon from '@material-ui/icons/Refresh';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {openSnackbar} from '../../notifier/Notifier';

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

export default function FintsAccountTransaction() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [accountTransactionList, setAccountTransactionList] = useState([]);
  const history = useHistory();

  const load = useCallback(() => {
    authenticatedFetch(
      '/account-transactions?filter[order]=date%20DESC',
      history,
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
            console.log(json);
            setAccountTransactionList(json);
          })
          .catch((error) => {
            console.log(error);
            openSnackbar({
              message: t('connectionError'),
              variant: 'error',
            });
          });
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  }, [t, history]);

  useEffect(() => {
    load();
  }, [load]);

  const deleteAccountTransaction = useCallback(
    (id) => {
      authenticatedFetch(`/account-transactions/${id}`, history, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          console.log(response.statusText);
          if (response.status === 204) {
            setAccountTransactionList(
              accountTransactionList.filter(
                (accountTransactionItem) => accountTransactionItem.id !== id,
              ),
            );
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    [t, history, accountTransactionList],
  );

  const transactionsToBookings = () => {
    const request = {};
    const bodyJson = JSON.stringify(request, null, 2);
    console.log(bodyJson);
    authenticatedFetch('/transaction-to-booking', history, {
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
                <IconButton size="small" aria-label="refresh" onClick={load}>
                  <RefershIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={transactionsToBookings}
                >
                  {t('fintsAccountTransactionToBookingButton')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('fintsAccountTransactionDate')}</TableCell>
              <TableCell>{t('fintsAccountTransactionName')}</TableCell>
              <TableCell>{t('fintsAccountTransactionText')}</TableCell>
              <TableCell>{t('fintsAccountTransactionAmount')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountTransactionList.map((accountTransactionItem) => (
              <TableRow key={accountTransactionItem.id}>
                <TableCell>
                  {new Intl.DateTimeFormat('de-DE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).format(new Date(accountTransactionItem.date))}
                </TableCell>
                <TableCell>{accountTransactionItem.name}</TableCell>
                <TableCell>{accountTransactionItem.text}</TableCell>
                <TableCell className={classes.right}>
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(accountTransactionItem.amount / 100)}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => {
                      deleteAccountTransaction(accountTransactionItem.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
