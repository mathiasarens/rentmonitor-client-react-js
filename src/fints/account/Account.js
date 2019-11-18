import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState, useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import RefershIcon from "@material-ui/icons/Refresh";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from 'react-i18next';
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
  }
}));

const AccountEditLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/account/edit" {...props} />
));

export default function Account() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [accountSettingsList, setAccountSettingsList] = useState([])
  const history = useHistory();
  
  const load = useCallback(() => {
      authenticatedFetch('/account-settings', history, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }).then((data) => {
        console.log(data);
        setAccountSettingsList(data);
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
              {t('accounts')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="add"
                  component={AccountEditLink}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
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
              <TableCell>Name</TableCell>
              <TableCell>{t('fintsBlz')}</TableCell>
              <TableCell>{t('fintsUrl')}</TableCell>
              <TableCell>{t('fintsUser')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountSettingsList.map(accountSettingsItem => (
              <TableRow key={accountSettingsItem.id}>
                <TableCell>{accountSettingsItem.name}</TableCell>
                <TableCell>{accountSettingsItem.fintsBlz}</TableCell>
                <TableCell>{accountSettingsItem.fintsUrl}</TableCell>
                <TableCell>{accountSettingsItem.fintsUser}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
