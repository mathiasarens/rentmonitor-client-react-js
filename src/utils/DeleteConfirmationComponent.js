import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles({});

export function DeleteConfirmationComponent(props) {
  const classes = useStyles();
  const {onDelete} = props;
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const {t} = useTranslation();
  let buttonVariant;
  let showDeleteIconTimer;
  if (showDeleteButton) {
    buttonVariant = 'contained';
  } else {
    buttonVariant = 'outlined';
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
        <Button size="small" variant={buttonVariant}>
          {t('delete')}
        </Button>
      </div>
    </div>
  );
}

DeleteConfirmationComponent.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
