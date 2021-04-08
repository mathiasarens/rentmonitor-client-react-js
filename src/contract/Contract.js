import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
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
import {DeleteConfirmationComponent} from '../utils/DeleteConfirmationComponent';
import {openSnackbar} from '../utils/Notifier';

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

        {contracts.map((contractListItem) => (
          <Grid container marginTop={2} spacing={1} key={contractListItem.id}>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6">
                {tenantsMap[contractListItem.tenantId]?.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container marginTop={1}>
                <Grid item xs={4}>
                  {t('contractAmount')}:
                </Grid>
                <Grid item xs={8}>
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(contractListItem.amount / 100)}{' '}
                  {(() => {
                    switch (contractListItem.rentDueEveryMonth) {
                      case 1:
                        return t('contractRentDueEveryMonth1');
                      case 12:
                        return t('contractRentDueEveryMonth12');
                      default:
                        return t('contractRentDueEveryMonthX', {
                          month: contractListItem.rentDueEveryMonth,
                        });
                    }
                  })()}
                </Grid>

                <Grid item xs={4}>
                  {t('contractRentDueDayOfMonth')}:
                </Grid>
                <Grid item xs={8}>
                  {t('contractRentDueDayOfMonthX', {
                    day: contractListItem.rentDueDayOfMonth,
                  })}
                </Grid>

                <Grid item xs={4}>
                  {t('contractStart')}:
                </Grid>
                <Grid item xs={8}>
                  {format(new Date(contractListItem.start), t('dateFormat'))}
                </Grid>
                <Grid item xs={4}>
                  {t('contractEnd')}:
                </Grid>
                <Grid item xs={8}>
                  {contractListItem.end
                    ? format(new Date(contractListItem.end), t('dateFormat'))
                    : ''}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Grid container spacing={1} marginTop={1}>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="edit"
                    component={Link}
                    to={`${CONTRACT_PATH}/edit/${contractListItem.id}`}
                  >
                    {t('edit')}
                  </Button>
                </Grid>
                <Grid item>
                  <DeleteConfirmationComponent
                    onDelete={() => {
                      deleteContract(contractListItem.id);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </div>
    </Container>
  );
}
