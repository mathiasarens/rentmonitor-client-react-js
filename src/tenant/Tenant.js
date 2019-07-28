import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const classes = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

class Tenant extends React.Component {
  constructor() {
    super();
    this.state = { tenants: [] };
  }

  componentDidMount() {
    this.setState({ displayErrors: false });
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
      .catch(function(error) {
        console.error(error);
      });
  }

  render() {
    const tenantList = this.state.tenants;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
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
            {tenantList.map(tenantListItem => (
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

export default Tenant;
