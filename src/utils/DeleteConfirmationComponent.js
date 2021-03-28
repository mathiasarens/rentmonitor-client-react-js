import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 100,
  },
  container: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
  },
});

export function DeleteConfirmationComponent(props) {
  const classes = useStyles();
  const {onDelete} = props;
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const {t} = useTranslation();
  let buttonClassName;
  let showDeleteIconTimer;
  if (showDeleteButton) {
    buttonClassName = classes.visible;
  } else {
    buttonClassName = classes.hidden;
  }
  let iconClassName;
  if (showDeleteButton) {
    iconClassName = classes.hidden;
  } else {
    iconClassName = classes.visible;
  }

  const onClickDelete = () => {
    if (showDeleteButton) {
      clearTimeout(showDeleteIconTimer);
      onDelete();
    } else {
      setShowDeleteButton(true);
      showDeleteIconTimer = setTimeout(() => {
        setShowDeleteButton(false);
      }, 2000);
    }
  };

  return (
    <div className={classes.container} onClick={onClickDelete}>
      <div>
        <Button className={buttonClassName} size="small" variant="outlined">
          {t('delete')}
        </Button>
      </div>
      <div className={classes.icon}>
        <IconButton className={iconClassName} size="small" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

DeleteConfirmationComponent.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
