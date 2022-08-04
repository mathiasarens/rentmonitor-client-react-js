import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import {Trans, useTranslation} from 'react-i18next';

export function Booking(props) {
  const {t} = useTranslation();
  return (
    <Grid container>
      <Grid item xs={4}>
        {t('bookingDate')}
      </Grid>
      <Grid item xs={8}>
        {format(new Date(props.bookingListItem.date), t('dateFormat'))}
      </Grid>
      <Grid item xs={4}>
        {t('tenant')}
      </Grid>
      <Grid item xs={8}>
        {props.tenantsMap[props.bookingListItem.tenantId]?.name}
      </Grid>
      <Grid item xs={4}>
        {t('bookingAmount')}
      </Grid>
      <Grid item xs={8}>
        {new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(props.bookingListItem.amount / 100)}
      </Grid>
      {/* ------ booking comment ---- */}
      <Grid item xs={4} zeroMinWidth>
        <Typography style={{overflowWrap: 'break-word'}}>
          <Trans t={t}>{t('bookingComment')}</Trans>
        </Typography>
      </Grid>
      <Grid item xs={8}>
        {(props.bookingListItem.type === 'RENT_DUE'
          ? t('bookingCommentRentDue') + ' '
          : '') + props.bookingListItem.comment}
      </Grid>
    </Grid>
  );
}
