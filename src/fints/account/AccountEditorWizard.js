import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/styles';
import React from 'react';
import {Redirect} from 'react-router';
import {Route, Switch} from 'react-router-dom';
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
          <Redirect from="/account/edit" exact to="/account/edit/step1" />
          <Route
            path="/account/edit/step1"
            component={AccountEditorStepInitial}
          />
          <Route
            path="/account/edit/step2"
            component={AccountEditorStepAccountSelection}
          />
          <Route
            path="/account/edit/stepTan"
            component={AccountEditorStepTan}
          />
        </Switch>
      </div>
    </Container>
  );
}
