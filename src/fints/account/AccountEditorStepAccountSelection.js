import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
  authenticatedFetch,
  handleAuthenticationError,
} from '../../authentication/authenticatedFetch';
import {ACCOUNTS_PATH} from '../../Constants';
import {openSnackbar} from '../../utils/Notifier';

export default function AccountEditorStepAccountSelection() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const step1FormData = location.state.form;
  const fintsAccounts = location.state.accounts;
  const {accountId} = useParams();
  const {control, handleSubmit} = useForm({
    defaultValues: {
      account: '',
    },
  });
  console.log('account - step2 - start - fintsAccounts: ', fintsAccounts);
  console.log('account - step2 - start - step1FormData: ', step1FormData);

  const onSubmit = (formInputs) => {
    console.log('AccountEditorStepAccountSelection - onSubmit');
    console.log(formInputs);
    console.log(step1FormData);
    console.log(fintsAccounts);
    const selectedFintsAccount = fintsAccounts.filter(
      (account) => account.iban === formInputs.account,
    )[0];
    const data = Object.assign({}, step1FormData, {
      rawAccount: selectedFintsAccount.rawstring,
      bic: selectedFintsAccount.bic,
      iban: selectedFintsAccount.iban,
    });

    authenticatedFetch(
      accountId ? `/account-settings/${accountId}` : '/account-settings',
      navigate,
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
        navigate(`/${ACCOUNTS_PATH}`);
      })
      .catch((error) => {
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography component="h1" variant="h5">
            {t('fintsAccountSelectionHead')}
          </Typography>

          <FormControl component="fieldset">
            <Controller
              control={control}
              name="account"
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <RadioGroup
                  aria-label="account"
                  value={value}
                  onChange={(event) => {
                    onChange(event.target.value);
                  }}
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
              )}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
          >
            {t('fintsAccountSynchronisationStep2Button')}
          </Button>
        </form>
      </div>
    </Container>
  );
}
