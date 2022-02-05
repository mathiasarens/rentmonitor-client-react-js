import {withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
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
import {Amplify} from 'aws-amplify';
import clsx from 'clsx';
import deLocale from 'date-fns/locale/de';
import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {BrowserRouter, Link, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import awsExports from './aws-exports';
import BookingEditor from './booking/BookingEditor';
import Bookings from './booking/Bookings';
import {
  ACCOUNT_PATH,
  AUTH_TOKEN,
  BOOKINGS_PATH,
  BOOKING_PATH,
  CONTRACT_PATH,
  TENANT_PATH,
  TRANSACTION_PATH,
} from './Constants';
import Contract from './contract/Contract';
import ContractEditor from './contract/ContractEditor';
import Account from './fints/account/Account';
import AccountEditorStepAccountSelection from './fints/account/AccountEditorStepAccountSelection';
import AccountEditorStepInitial from './fints/account/AccountEditorStepInitial';
import AccountEditorStepTan from './fints/account/AccountEditorStepTan';
import FintsAccountSynchronisationSingle from './fints/synchronisation/FintsAccountSynchronisationSingle';
import FintsAccountTransaction from './fints/transaction/FintsAccountTransaction';
import Overview from './overview/Overview';
import Tenant from './tenant/Tenant';
import TenantEditor from './tenant/TenantEditor';
import theme from './theme';
import Notifier from './utils/Notifier';

Amplify.configure(awsExports);

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

function App() {
  const {t} = useTranslation();
  const classes = useStyles();
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
        <Routes>
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
                        className={clsx(
                          classes.menuButton,
                          open && classes.hide,
                        )}
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

          {/*
          <Route path="/" element={() => <Navigate to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          */}
          <Route path="/overview" element={<Overview />} />
          <Route path={TENANT_PATH} element={<Tenant />}>
            <Route path="edit/:tenantId" element={<TenantEditor />} />
          </Route>
          <Route path={CONTRACT_PATH} element={<Contract />}>
            <Route path="edit/:contractId" element={<ContractEditor />} />
          </Route>
          <Route path={`${BOOKINGS_PATH}/:tenantId?`} element={<Bookings />} />
          <Route
            path={`${BOOKING_PATH}/edit/:bookingId?`}
            element={<BookingEditor />}
          />
          <Route path={`${ACCOUNT_PATH}/*`} element={<Account />}>
            <Route
              from="edit"
              render={<Navigate to={`${ACCOUNT_PATH}/edit/step1`} />}
            />
            <Route
              path="edit/step1/:accountId?"
              element={<AccountEditorStepInitial />}
            />
            <Route
              path="edit/step2/:accountId?"
              element={<AccountEditorStepAccountSelection />}
            />
            <Route
              path="edit/stepTan/:accountId?"
              element={<AccountEditorStepTan />}
            />

            <Route
              path="synchronisation/:accountSettingsId"
              element={<FintsAccountSynchronisationSingle />}
            />
          </Route>
          <Route path="/transaction" element={<FintsAccountTransaction />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default withAuthenticator(App);
