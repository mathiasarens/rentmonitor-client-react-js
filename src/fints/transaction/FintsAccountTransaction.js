import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

export function FintsAccountTransaction(props) {
  const {t} = useTranslation();
  return (
    <Grid container>
      <Grid item xs={4}>
        {t('fintsAccountTransactionDate')}:
      </Grid>
      <Grid item xs={8}>
        {new Intl.DateTimeFormat('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date(props.accountTransactionItem.date))}
      </Grid>

      <Grid item xs={4}>
        {t('fintsAccountTransactionName')}:
      </Grid>
      <Grid item xs={8}>
        {props.accountTransactionItem.name}
      </Grid>

      <Grid item xs={4} zeroMinWidth>
        <Typography style={{overflowWrap: 'break-word'}}>
          {t('fintsAccountTransactionText')}:
        </Typography>
      </Grid>
      <Grid item xs={8} zeroMinWidth>
        <Typography style={{overflowWrap: 'break-word'}}>
          {props.accountTransactionItem.text}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        {t('fintsAccountTransactionAmount')}:
      </Grid>
      <Grid item xs={8}>
        {new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(props.accountTransactionItem.amount / 100)}
      </Grid>
    </Grid>
  );
}
