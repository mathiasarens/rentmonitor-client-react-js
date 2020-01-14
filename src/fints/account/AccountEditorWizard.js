import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";
import AccountEditorStepAccountSelection from "./AccountEditorStepAccountSelection";
import AccountEditorStepInitial from "./AccountEditorStepInitial";
import AccountEditorStepTan from "./AccountEditorStepTan";

const useStyles = makeStyles(theme => ({
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
}));

export default function AccountEditorWizard() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Switch>
          <Redirect from="/fints/account/edit" exact to="/fints/account/edit/step1" />
          <Route path="/fints/account/edit/step1" component={AccountEditorStepInitial} />
          <Route path="/fints/account/edit/step2" component={AccountEditorStepAccountSelection} />
          <Route path="/fints/account/edit/stepTan" component={AccountEditorStepTan} />
        </Switch>
      </div>
    </Container>
  );
}


