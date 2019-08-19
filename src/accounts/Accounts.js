import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { openSnackbar } from "../notifier/Notifier";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import RefershIcon from "@material-ui/icons/Refresh";
import AddIcon from "@material-ui/icons/Add";

import { withTranslation } from 'react-i18next';

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(4)
  }
});

const AccountEditLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/account/edit" {...props} />
  ));

class Accounts extends React.Component {
  constructor() {
    super();
    this.state = { accountSettingsList: [] };
  }

  componentDidMount() {
    this.load();
  }

  load() {
    fetch("http://localhost:3001/account-settings", {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then((response) => {
        console.log(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ accocuntSettingsList: data });
      })
      .catch((error) => {
        console.error(error)
        openSnackbar({
          message: "Connection Error. Please try again later.",
          variant: "error"
        });
      });
  }


  render() {
    const { accountSettingsList } = this.state;
    const { t } = this.props;

    return (
      <Container component="main">
        <CssBaseline />
        <div className={this.props.classes.paper}>
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
                    onClick={() => {this.load()}}
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
                  <TableCell></TableCell>
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
}

export default withTranslation()(withStyles(styles)(Accounts));
