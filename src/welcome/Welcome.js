import {Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, {useEffect, useState} from 'react';
import './Authenticator.css';

export default function Welcome() {
  //const {t} = useTranslation();
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
      <Box mb={2}>
        <Typography component="h1" variant="h5" align="center">
          Rent Monitor
        </Typography>
      </Box>
      <Authenticator hideSignUp={true}>
        {({signOut, user}) => (
          <main>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
      <Box mt={2}>
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
