
import { Button } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { authenticatedFetch, handleAuthenticationError } from "../../authentication/authenticatedFetch";
import { openSnackbar } from "../../notifier/Notifier";



const useStyles = makeStyles(theme => ({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(4)
    }
}));

export default function FintsAccountSynchronisation() {
    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();

    const synchroniseAccounts = () => {
        authenticatedFetch('/account-synchronization', history, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        }).catch((error) => {
            openSnackbar({
                message: t(handleAuthenticationError(error)),
                variant: "error"
            });
        });
    }

    return (
        <Container component="main">
            <CssBaseline />
            <div className={classes.paper}>
                <Grid container justify="space-between" alignItems="flex-end">
                    <Grid item>
                        <Typography component="h1" variant="h5">
                            {t('fintsAccountSynchronisationTitle')}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between" alignItems="flex-end">
                    <Grid item spacing={1}>
                        <Button onClick={synchroniseAccounts}>{t('fintsAccountSynchronisationTitle')}</Button>
                    </Grid>
                </Grid>
            </div>
        </Container >
    );
}