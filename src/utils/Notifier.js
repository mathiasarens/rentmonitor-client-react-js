import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import {SnackbarContent} from '@mui/material';
import {amber, green} from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import {withStyles} from '@mui/styles';
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
