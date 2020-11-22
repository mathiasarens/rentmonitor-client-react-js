import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RefershIcon from '@material-ui/icons/Refresh';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../authentication/authenticatedFetch';
import {TENANT_PATH} from '../Constants';
import {openSnackbar} from '../notifier/Notifier';
import {tenantLoader} from './dataaccess/tenantLoader';

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

export default function Tenant() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [tenants, setTenants] = useState([]);
  const history = useHistory();

  const loadTenants = useCallback(() => {
    tenantLoader(history, setTenants, (error) => {
      openSnackbar({
        message: t(handleAuthenticationError(error)),
        variant: 'error',
      });
    });
  }, [t, history]);

  const deleteTenant = useCallback(
    (id) => {
      authenticatedFetch(`/tenants/${id}`, history, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          console.log(response.statusText);
          if (response.status === 204) {
            setTenants(tenants.filter((tenant) => tenant.id !== id));
          }
        })
        .catch((error) => {
          openSnackbar({
            message: t(handleAuthenticationError(error)),
            variant: 'error',
          });
        });
    },
    [t, history, tenants],
  );

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography component="h1" variant="h5">
              {t('tenants')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="add"
                  component={Link}
                  to={`${TENANT_PATH}/edit`}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={loadTenants}
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
              <TableCell>Name</TableCell>
              <TableCell>{t('email')}</TableCell>
              <TableCell>{t('phone')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenantListItem) => (
              <TableRow key={tenantListItem.id}>
                <TableCell>{tenantListItem.name}</TableCell>
                <TableCell>{tenantListItem.email}</TableCell>
                <TableCell>{tenantListItem.phone}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => {
                      deleteTenant(tenantListItem.id);
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
