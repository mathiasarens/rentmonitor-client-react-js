import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React from "react";
import { Link as RLink } from "react-router-dom";

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built with love by the "}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {" team."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}));

const SignUpLink = React.forwardRef((props, ref) => (
  <RLink innerRef={ref} to="/signup" {...props} />
));

const LoginLink = React.forwardRef((props, ref) => (
  <RLink innerRef={ref} to="/signup" {...props} />
));

export default function Welcome() {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Rent Monitor
        </Typography>
      </div>
      <Grid container>
        <Grid item xs style={{textAlign: "center"}}>
          <Button component={SignUpLink}>SignIn</Button>
        </Grid>
        <Grid item xs style={{textAlign: "center"}}>
          <Button component={LoginLink}>SignUp</Button>
        </Grid>
      </Grid>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
    </Container>
  );
}
