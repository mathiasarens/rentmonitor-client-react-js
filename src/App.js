import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import deLocale from 'date-fns/locale/de';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import PrivateRoute from './authentication/PrivateRoute';
import Signin from './authentication/signin/Signin';
import Signup from './authentication/signup/Signup';
import BookingEditor from './booking/BookingEditor';
import Bookings from './booking/Bookings';
import {
  ACCOUNT_PATH,
  AUTH_TOKEN,
  BOOKINGS_PATH,
  BOOKING_PATH,
  CONTRACT_PATH,
  TENANT_PATH,
  TRANSACTION_PATH
} from './Constants';
import Contract from './contract/Contract';
import ContractEditor from './contract/ContractEditor';
import Account from './fints/account/Account';
import AccountEditorWizard from './fints/account/AccountEditorWizard';
import FintsAccountSynchronisationSingle from './fints/synchronisation/FintsAccountSynchronisationSingle';
import FintsAccountTransaction from './fints/transaction/FintsAccountTransaction';
import Overview from './overview/Overview';
import Tenant from './tenant/Tenant';
import TenantEditor from './tenant/TenantEditor';
import Notifier from './utils/Notifier';
import Welcome from './welcome/Welcome';

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

export default function App() {
  const {t} = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

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
      case TENANT_PATH:
        return t('tenants');
      case BOOKING_PATH:
      case BOOKINGS_PATH:
        return t('bookings');
      case TRANSACTION_PATH:
        return t('transactions');
      default:
        return 'Rent Monitor';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
      <BrowserRouter>
        <Route
          path="/"
          render={({location}) => (
            <Fragment>
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
                  {sessionStorage.getItem(AUTH_TOKEN) ? (
                    <List>
                      <ListItem
                        button
                        key="overview"
                        onClick={handleDrawerClose}
                        component={Link}
                        to="/overview"
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
                        to={TENANT_PATH}
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
                        to={TRANSACTION_PATH}
                      >
                        <ListItemIcon>
                          <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('transactions')} />
                      </ListItem>
                    </List>
                  ) : (
                    <List>
                      <ListItem
                        button
                        key="signup"
                        onClick={handleDrawerClose}
                        component={Link}
                        to="/signup"
                      >
                        <ListItemIcon>
                          <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('signup')} />
                      </ListItem>

                      <ListItem
                        button
                        key="signin"
                        onClick={handleDrawerClose}
                        component={Link}
                        to="/signin"
                      >
                        <ListItemIcon>
                          <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('signin')} />
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
            </Fragment>
          )}
        />
        <Switch>
          <Redirect exact from="/" to="/welcome" />
          <Route path="/welcome">
            <Welcome />
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute path="/overview">
            <Overview />
          </PrivateRoute>
          <PrivateRoute exact path={TENANT_PATH}>
            <Tenant />
          </PrivateRoute>
          <PrivateRoute path={`${TENANT_PATH}/edit/:tenantId?`}>
            <TenantEditor />
          </PrivateRoute>
          <PrivateRoute exact path={CONTRACT_PATH}>
            <Contract />
          </PrivateRoute>
          <PrivateRoute path={`${CONTRACT_PATH}/edit/:contractId?`}>
            <ContractEditor />
          </PrivateRoute>
          <PrivateRoute path={`${BOOKINGS_PATH}/:tenantId?`}>
            <Bookings />
          </PrivateRoute>
          <PrivateRoute path={`${BOOKING_PATH}/edit/:bookingId?`}>
            <BookingEditor />
          </PrivateRoute>
          <PrivateRoute exact path={ACCOUNT_PATH}>
            <Account />
          </PrivateRoute>
          <PrivateRoute path={`${ACCOUNT_PATH}/edit/:accountId?`}>
            <AccountEditorWizard />
          </PrivateRoute>
          <PrivateRoute
            path={`${ACCOUNT_PATH}/synchronisation/:accountSettingsId?`}
          >
            <FintsAccountSynchronisationSingle />
          </PrivateRoute>
          <PrivateRoute exact path="/transaction">
            <FintsAccountTransaction />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </LocalizationProvider>
  );
}
