import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import {SnackbarContent} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

let openSnackbarFn;

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

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
          message={
            <span id="client-snackbar">
              <Icon />
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
              <CloseIcon />
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

export default Notifier;
