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
const TenantEditLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/tenant/edit" {...props} />
));
class Tenant extends React.Component {
  constructor() {
    super();
    this.state = { tenants: [] };
  }

  componentDidMount() {
    this.load();
  }

  load() {
    fetch("http://localhost:3001/tenants", {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => {
        console.log(response.statusText);
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({ tenants: data });
      })
      .catch(() => {
        openSnackbar({
          message: "Connection Error. Please try again later.",
          variant: "error"
        });
      });
  }


  render() {
    const { tenants } = this.state;
    return (
      <Container component="main">
        <CssBaseline />
        <div className={this.props.classes.paper}>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography component="h1" variant="h5">
                Tenants
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <IconButton
                    size="small"
                    aria-label="add"
                    component={TenantEditLink}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    size="small"
                    aria-label="refresh"
                    onClick={this.load}
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
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map(tenantListItem => (
                <TableRow key={tenantListItem.id}>
                  <TableCell>{tenantListItem.name}</TableCell>
                  <TableCell>{tenantListItem.email}</TableCell>
                  <TableCell>{tenantListItem.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(Tenant);
