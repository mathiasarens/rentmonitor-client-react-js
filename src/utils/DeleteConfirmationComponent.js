import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

export function DeleteConfirmationComponent(props) {
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
    <div onClick={onClickDelete}>
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
