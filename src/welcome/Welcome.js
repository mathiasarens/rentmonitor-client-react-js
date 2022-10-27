import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {SIGNIN_PATH} from '../Constants';

export default function Welcome() {
  const {t} = useTranslation();
  const [version, setVersion] = useState('down');

  const loadVersion = async (abortController) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_PREFIX}/version`,
        {signal: abortController.signal},
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
    console.log('Welcome - useEffect');
    const abortController = new AbortController();
    loadVersion(abortController).then((response) => {
      setVersion(response);
    });
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <Box>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Rent Monitor
        </Typography>
      </Box>
      <Grid container mt={5}>
        <Grid item xs style={{textAlign: 'center'}}>
          <Button component={Link} to={`/${SIGNIN_PATH}`}>
            {t('signin')}
          </Button>
        </Grid>
        <Grid item xs style={{textAlign: 'center'}}>
          <Button component={Link} to={`/${SIGNIN_PATH}`}>
            {t('signup')}
          </Button>
        </Grid>
      </Grid>
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
    </>
  );
}
