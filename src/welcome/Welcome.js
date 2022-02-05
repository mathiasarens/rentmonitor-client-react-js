import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link as RLink} from 'react-router-dom';

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

const SignUpLink = React.forwardRef((props, ref) => (
  <RLink innerRef={ref} to="/signup" {...props} />
));

const SignInLink = React.forwardRef((props, ref) => (
  <RLink innerRef={ref} to="/signin" {...props} />
));

export default function Welcome() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [version, setVersion] = useState('down');

  const loadVersion = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_PREFIX}/version`,
      );
      if (!response.ok) {
        return 'down';
      } else {
        return response.text();
      }
    } catch {
      return 'down';
    }
  };

  useEffect(() => {
    loadVersion().then((response) => {
      setVersion(response);
    });
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Rent Monitor
        </Typography>
      </div>
      <Grid container mt={5}>
        <Grid item xs style={{textAlign: 'center'}}>
          <Button component={SignInLink}>{t('signin')}</Button>
        </Grid>
        <Grid item xs style={{textAlign: 'center'}}>
          <Button component={SignUpLink}>{t('signup')}</Button>
        </Grid>
      </Grid>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary" align="center">
          Version: {process.env.REACT_APP_VERSION}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Backend: {process.env.REACT_APP_BACKEND_URL_PREFIX}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Backend version: {version}
        </Typography>
      </Box>
    </Container>
  );
}
