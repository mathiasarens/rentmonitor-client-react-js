import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import RefershIcon from "@material-ui/icons/Refresh";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { authenticatedFetch, handleAuthenticationError } from "../../authentication/authenticatedFetch";
import { openSnackbar } from "../../notifier/Notifier";



const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(4)
  },
  right: {
    textAlign: 'right'
  }
}));

export default function FintsAccountTransaction() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [accountTransactionList, setAccountTransactionList] = useState([])
  const history = useHistory();

  const load = useCallback(() => {
    authenticatedFetch('/account-transactions?filter[order]=date%20DESC', history, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }).then(response => {
      response.json().then(json => {
        console.log(json);
        setAccountTransactionList(json);
      }).catch(error => {
        console.log(error);
        openSnackbar({
          message: t('connectionError'),
          variant: "error"
        })
      });
    }).catch((error) => {
      openSnackbar({
        message: t(handleAuthenticationError(error)),
        variant: "error"
      });
    });
  }, [t, history]);

  useEffect(() => {
    load();
  }, [load])

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
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={load}
                >
                  <RefershIcon />
                </IconButton>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {accountTransactionList.map(accountTransactionItem => (
              <TableRow key={accountTransactionItem.id}>
                <TableCell>{new Intl.DateTimeFormat("de-DE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                }).format(new Date(accountTransactionItem.date))}</TableCell>
                <TableCell>{accountTransactionItem.name}</TableCell>
                <TableCell>{accountTransactionItem.text}</TableCell>
                <TableCell className={classes.right}>{new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(accountTransactionItem.amount / 100)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
