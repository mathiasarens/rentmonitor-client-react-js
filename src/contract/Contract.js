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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RefershIcon from '@material-ui/icons/Refresh';
import format from 'date-fns/format';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {CONTRACT_PATH} from '../Constants';
import {tenantsLoader} from '../tenant/dataaccess/tenantLoader';
import {openSnackbar} from '../utils/Notifier';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
  },
}));

export default function Contract() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [contracts, setContracts] = useState([]);
  const [tenantsMap, setTenantsMap] = useState(new Map());
  const history = useHistory();

  const loadContracts = useCallback(() => {
    authenticatedFetch('/contracts', history, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        console.log(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setContracts(data);
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  }, [t, history]);

  const loadTenants = useCallback(() => {
    tenantsLoader(
      history,
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
  }, [t, history]);

  const deleteContract = useCallback(
    (id) => {
      authenticatedFetch(`/contracts/${id}`, history, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          console.log(response.statusText);
          if (response.status === 204) {
            setContracts(contracts.filter((tenant) => tenant.id !== id));
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    [t, history, contracts],
  );

  const addDueBookingsFromContracts = () => {
    const bodyJson = JSON.stringify({}, null, 2);
    authenticatedFetch('/contract-to-booking', history, {
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

  useEffect(() => {
    loadContracts();
    loadTenants();
  }, [loadContracts, loadTenants]);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
          justify="space-between"
          alignItems="flex-end"
          spacing={1}
        >
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('contracts')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="add"
                  component={Link}
                  to={`${CONTRACT_PATH}/edit`}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={() => {
                    loadContracts();
                    loadTenants();
                  }}
                >
                  <RefershIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="outlined"
              onClick={addDueBookingsFromContracts}
            >
              {t('contractToBookingTitle')}
            </Button>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('tenant')}</TableCell>
              <TableCell>{t('contractRentDueEveryMonth')}</TableCell>
              <TableCell>{t('contractRentDueDayOfMonth')}</TableCell>
              <TableCell>{t('contractAmount')}</TableCell>
              <TableCell>{t('contractStart')}</TableCell>
              <TableCell>{t('contractEnd')}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contractListItem) => (
              <TableRow key={contractListItem.id}>
                <TableCell>
                  {tenantsMap[contractListItem.tenantId]?.name}
                </TableCell>
                <TableCell>{contractListItem.rentDueEveryMonth}</TableCell>
                <TableCell>{contractListItem.rentDueDayOfMonth}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(contractListItem.amount / 100)}
                </TableCell>
                <TableCell>
                  {format(new Date(contractListItem.start), t('dateFormat'))}
                </TableCell>
                <TableCell>
                  {contractListItem.end
                    ? format(new Date(contractListItem.end), t('dateFormat'))
                    : ''}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="edit"
                    component={Link}
                    to={`${CONTRACT_PATH}/edit/${contractListItem.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => {
                      deleteContract(contractListItem.id);
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
