import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { red } from "@material-ui/core/colors";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from "@material-ui/core/styles";
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

export default function AccountEditorStepAccountSelection(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const step1FormData = props.location.state.form;
  const fintsAccounts = props.location.state.accounts;
  const rawAccountIdentifier = 'rawAccount';

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(step1FormData);
    console.log(fintsAccounts);
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: "error"
      });
      return;
    }
    const formData = new FormData(event.target);
    const selectedFintsAccount = fintsAccounts.filter(account => account.rawstring === formData.get(rawAccountIdentifier))[0];
    const data = Object.assign({}, step1FormData, {
      rawAccount: selectedFintsAccount.rawstring,
      bic: selectedFintsAccount.bic,
      iban: selectedFintsAccount.iban
    });

    authenticatedFetch('/account-settings', history, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data, null, 2),
    }).then((json) => {
      console.log(json);
      history.push('/account');
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
        {t('fintsAccountSelectionHead')}
      </Typography>
      <RadioGroup aria-label="account">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t('iban')}</TableCell>
              <TableCell>{t('bic')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fintsAccounts.map(fintsAccount => (
              <TableRow key={fintsAccount.rawstring}>
                <TableCell><FormControlLabel name={rawAccountIdentifier} value={fintsAccount.rawstring} control={<Radio />} /></TableCell>
                <TableCell>{fintsAccount.iban}</TableCell>
                <TableCell>{fintsAccount.bic}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </RadioGroup>
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


