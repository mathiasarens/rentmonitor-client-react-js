import Button from "@material-ui/core/Button";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { authenticatedFetch, handleAuthenticationError } from "../../authentication/authenticatedFetch";
import { openSnackbar } from "../../notifier/Notifier";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  input: {
    '&:invalid': {
      borderColor: red
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function AccountEditorStepTan() {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: "error"
      });
      return;
    }
    const data = new FormData(event.target);

    authenticatedFetch('/account-settings', history, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: stringifyFormData(data),
    }).then(response => {
      response.json().then(json => {
        console.log(json);
        history.push('/fints/accounts');
      }).catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: "error"
        });
      });
    }).catch((error) => {
      openSnackbar({
        message: t(handleAuthenticationError(error)),
        variant: "error"
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form} noValidate>
      <Typography component="h1" variant="h5">
        {t('newAccountSettings')}
      </Typography>
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
  );
}

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
