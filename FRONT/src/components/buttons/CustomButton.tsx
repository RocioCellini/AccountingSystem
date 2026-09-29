import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

type CustomButtonProps = {
  title: string;
  onClick: () => void;
  backgroundColor: string;
  color?: string;
  icon?: React.ReactNode;
  text?: string;
};

//botones customizables del tipo ícono para reutilizar donde se requieran por ejemplo en la columna de acciones

const CustomButton: React.FC<CustomButtonProps> = ({ title, onClick, backgroundColor, color, icon, text }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        style={{
          backgroundColor: backgroundColor,
          color: color || 'white',
          borderRadius: '5px',
          padding: '5px 16px',
        }}
        onClick={onClick}
      >
        {text && !icon && text}
        {icon && icon}
      </IconButton>
    </Tooltip>
  );
};

export default CustomButton;