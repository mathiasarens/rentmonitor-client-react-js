import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/styles';
import React from 'react';
import {Redirect} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import {ACCOUNT_PATH} from '../../Constants';
import AccountEditorStepAccountSelection from './AccountEditorStepAccountSelection';
import AccountEditorStepInitial from './AccountEditorStepInitial';
import AccountEditorStepTan from './AccountEditorStepTan';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function AccountEditorWizard() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Switch>
          <Redirect
            exact
            from={`${ACCOUNT_PATH}/edit`}
            to={`${ACCOUNT_PATH}/edit/step1`}
          />
          <Route
            path={`${ACCOUNT_PATH}/edit/step1/:accountId?`}
            component={AccountEditorStepInitial}
          />
          <Route
            path={`${ACCOUNT_PATH}/edit/step2/:accountId?`}
            component={AccountEditorStepAccountSelection}
          />
          <Route
            path={`${ACCOUNT_PATH}/edit/stepTan/:accountId?`}
            component={AccountEditorStepTan}
          />
        </Switch>
      </div>
    </Container>
  );
}
