import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { red } from "@material-ui/core/colors";
import { withTranslation } from 'react-i18next';
import { openSnackbar } from "../notifier/Notifier";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(4),
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
});


class AccountEditor extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ displayErrors: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: this.props.t('formValidationFailed'),
        variant: "error"
      });
      return;
    }
    const data = new FormData(event.target);
    
    
    this.setState({
      res: stringifyFormData(data),
    });

    fetch('http://localhost:3001/account-settings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: stringifyFormData(data),
    }).then(function(response) {
      let json = response.json();
      console.log(json);
    }).catch((error) => {
      openSnackbar({
        message: this.props.t('connectionError'),
        variant: "error"
      });
    });
  }

  render() {
    const {t, classes} = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {t('newAccountSettings')}
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
              className={classes.input}
              autoFocus
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="fintsBlz"
              label={t('fintsBlz')}
              id="fintsBlz"
              className={classes.input}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="fintsUrl"
              label={t('fintsUrl')}
              id="fintsUrl"
              className={classes.input}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="fintsUser"
              label={t('fintsUser')}
              id="fintsUser"
              className={classes.input}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="fintsPassword"
              label={t('fintsPassword')}
              id="fintsPassword"
              type="password"
              className={classes.input}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {t('createTenant')}
            </Button>
    
          </form>
        </div>
      </Container>
    );
  }
}

export default withTranslation()(withStyles(styles)(AccountEditor));

function stringifyFormData(fd) {
  const data = {};
	for (let key of fd.keys()) {
  	data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
