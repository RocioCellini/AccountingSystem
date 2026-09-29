
import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { PlusCircle } from 'react-feather';

interface AddButtonProps {
  tooltip: string;
  handleOpen: () => void;
  icon?: React.ReactElement;
  styles?: any;
}

//funcion para agregarle el boton de añadir a las tablas de MUI
const AddButton: React.FC<AddButtonProps> = ({ tooltip, handleOpen, icon, styles }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleOpen} className={styles?.iconButton}>
        {icon || <PlusCircle className={styles?.icon} />}
      </IconButton>
    </Tooltip>
  );
};

export default AddButton;
