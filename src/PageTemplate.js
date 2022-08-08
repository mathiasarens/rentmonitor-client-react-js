import '@aws-amplify/ui-react/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import {Auth} from 'aws-amplify';
import clsx from 'clsx';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {
  ACCOUNT_PATH,
  BOOKINGS_PATH,
  BOOKING_PATH,
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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PageTemplate(props) {
  const {t} = useTranslation();
  const classes = useStyles();
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
      case CONTRACT_PATH:
        return t('contracts');
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
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {renderHeadlineFromLocationPathname(location)}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
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
                to={CONTRACT_PATH}
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
                to={ACCOUNT_PATH}
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

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        ></main>
      </div>
    </React.Fragment>
  );
}
