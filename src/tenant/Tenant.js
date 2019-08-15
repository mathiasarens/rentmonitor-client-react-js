import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(4),
  }
});

class Tenant extends React.Component {
  constructor(props) {
    super();
    this.state = { tenants: [], connectionError: false };
  }

  componentDidMount() {
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
      .catch(error => {
        this.setState({ connectionError: true });
        console.error(error);
      });
  }

  render() {
    const { tenants, connectionError } = this.state;
    return (
      <Container component="main">
        <CssBaseline />
        <div className={this.props.classes.paper}>
          <Typography component="h1" variant="h5">
            Tenants
          </Typography>
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
