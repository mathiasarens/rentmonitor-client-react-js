import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Auth} from 'aws-amplify';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {
  ACCOUNTS_PATH,
  ACCOUNT_PATH,
  BOOKINGS_PATH,
  BOOKING_PATH,
  CONTRACTS_PATH,
  CONTRACT_PATH,
  OVERVIEW_PATH,
  SIGNIN_PATH,
  TENANTS_PATH,
  TRANSACTIONS_PATH,
  WELCOME_PATH,
} from './Constants';
import theme from './theme';
import Notifier from './utils/Notifier';

function getFirstPathElement(path) {
  let pathelements = path.split('/');
  let firstPathelement = '/' + pathelements[1];
  return firstPathelement;
}

export default function PageTemplate(props) {
  const {t} = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = useCallback(() => {
    console.log('Auth.signOut - effect');
    Auth.signOut().then(() => {
      console.log('logged out');
      handleDrawerClose();
      props.loadCurrentAuthenticatedUser();
      navigate(`/${WELCOME_PATH}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const renderHeadlineFromLocationPathname = (fullLocation) => {
    switch (getFirstPathElement(fullLocation.pathname)) {
      case CONTRACTS_PATH:
      case CONTRACT_PATH:
        return t('contracts');
      case ACCOUNTS_PATH:
        return t('accounts');
      case ACCOUNT_PATH:
        return t('accounts');
      case TENANTS_PATH:
        return t('tenants');
      case BOOKING_PATH:
      case BOOKINGS_PATH:
        return t('bookings');
      case TRANSACTIONS_PATH:
        return t('transactions');
      default:
        return 'Rent Monitor';
    }
  };

  return (
    <React.Fragment>
      <Notifier />
      <Box sx={{flexGrow: 1}}>
        <AppBar component="nav" position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {renderHeadlineFromLocationPathname(location)}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer variant="persistent" anchor="left" open={open}>
            <div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            {!props.loggedIn && (
              <List>
                <ListItem
                  button
                  key="signin"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={SIGNIN_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('signin')} />
                </ListItem>
              </List>
            )}
            {props.loggedIn && (
              <List>
                <ListItem
                  button
                  key="overview"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={OVERVIEW_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('overview')} />
                </ListItem>

                <ListItem
                  button
                  key="tenants"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={TENANTS_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('tenants')} />
                </ListItem>

                <ListItem
                  button
                  key="contracts"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={CONTRACTS_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('contracts')} />
                </ListItem>

                <ListItem
                  button
                  key="bookings"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={BOOKINGS_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('bookings')} />
                </ListItem>

                <ListItem
                  button
                  key="accounts"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={ACCOUNTS_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('accounts')} />
                </ListItem>

                <ListItem
                  button
                  key="transactions"
                  onClick={handleDrawerClose}
                  component={Link}
                  to={TRANSACTIONS_PATH}
                >
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('transactions')} />
                </ListItem>

                <ListItem button key="logout" onClick={logout}>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('logout')} />
                </ListItem>
              </List>
            )}
          </Drawer>
        </Box>
        <Box component="main">
          <Toolbar />
          {props.children}
        </Box>
      </Box>
    </React.Fragment>
  );
}
