import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { red } from "@material-ui/core/colors";


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
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  input: {
    '&:invalid' : {
        borderColor:red
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));


class TenantEditor extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ displayErrors: false });
  }

  handleSubmit(event) {
    console.log("handleSubmit");
    event.preventDefault();
    if (!event.target.checkValidity()) {
      this.setState({ displayErrors: true });
      return;
    }
    const data = new FormData(event.target);
    
    
    this.setState({
      res: stringifyFormData(data),
    });

    fetch('localhost:3001/api/tenants', {
      method: 'POST',
      body: data,
    }).then(function(response) {
      let json = response.json();
      console.log(json);
    }).catch(function(error) {
      console.log(error);
    });
  }


  render() {
    const { displayErrors } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            New Tenant
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="Name"
              classes={classes.input}
              autoFocus
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              autoComplete="your@email.com"
              classes={classes.input}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="phone"
              label="Phone"
              type="phone"
              id="phone"
              autoComplete="+49 170 123456789"
              classes={classes.input}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create
            </Button>
    
          </form>
        </div>
      </Container>
    );
  }
}

export default TenantEditor;

function stringifyFormData(fd) {
  const data = {};
	for (let key of fd.keys()) {
  	data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
