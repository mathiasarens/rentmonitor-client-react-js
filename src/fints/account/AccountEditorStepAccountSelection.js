import Button from '@material-ui/core/Button';
import {red} from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {ACCOUNT_PATH} from '../../Constants';
import {openSnackbar} from '../../utils/Notifier';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  input: {
    '&:invalid': {
      borderColor: red,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AccountEditorStepAccountSelection(props) {
  const classes = useStyles();
  const {t} = useTranslation();
  const history = useHistory();
  const [selectedAccountIban, setSelectedAccountIban] = useState('');
  const step1FormData = props.location.state.form;
  const fintsAccounts = props.location.state.accounts;
  const {accountId} = useParams();

  console.log('account - step2 - start - fintsAccounts: ', fintsAccounts);
  console.log('account - step2 - start - step1FormData: ', step1FormData);

  const handleRadioButtonChange = (event) => {
    setSelectedAccountIban(event.target.value);
    console.log('selectedAccountChanged: ', event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(step1FormData);
    console.log(fintsAccounts);
    if (!event.target.checkValidity()) {
      openSnackbar({
        message: t('formValidationFailed'),
        variant: 'error',
      });
      return;
    }
    const selectedFintsAccount = fintsAccounts.filter(
      (account) => account.iban === selectedAccountIban,
    )[0];
    const data = Object.assign({}, step1FormData, {
      rawAccount: selectedFintsAccount.rawstring,
      bic: selectedFintsAccount.bic,
      iban: selectedFintsAccount.iban,
    });

    authenticatedFetch(
      accountId ? `/account-settings/${accountId}` : '/account-settings',
      history,
      {
        method: accountId ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data, null, 2),
      },
    )
      .then((json) => {
        console.log(json);
        history.push(ACCOUNT_PATH);
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form} noValidate>
      <Typography component="h1" variant="h5">
        {t('fintsAccountSelectionHead')}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="account"
          value={selectedAccountIban}
          onChange={handleRadioButtonChange}
        >
          <Grid container marginTop={2} spacing={1} marginBottom={2}>
            {fintsAccounts.map((fintsAccount) => (
              <Grid item xs={12} key={fintsAccount.rawstring}>
                <Grid container marginTop={1}>
                  <FormControlLabel
                    label={fintsAccount.iban}
                    value={fintsAccount.iban}
                    control={<Radio />}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
      <Button
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        {t('fintsAccountSynchronisationStep2Button')}
      </Button>
    </form>
  );
}
