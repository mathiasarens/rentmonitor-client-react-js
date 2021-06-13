import {SnackbarContent} from '@material-ui/core';
import {amber, green} from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import {withStyles} from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

let openSnackbarFn;

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class Notifier extends React.Component {
  state = {
    open: false,
    message: '',
    variant: 'info',
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  handleSnackbarRequestClose = () => {
    this.setState({
      open: false,
      message: '',
    });
  };

  openSnackbar = ({message, variant}) => {
    this.setState({open: true, message, variant});
  };

  render() {
    const {classes} = this.props;
    const Icon = variantIcon[this.state.variant];

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        autoHideDuration={10000}
        onClose={this.handleSnackbarRequestClose}
        open={this.state.open}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
      >
        <SnackbarContent
          className={clsx(classes[this.state.variant], classes)}
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {this.state.message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleSnackbarRequestClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

export function openSnackbar({message, variant}) {
  openSnackbarFn({message, variant});
}

export default withStyles(styles)(Notifier);
