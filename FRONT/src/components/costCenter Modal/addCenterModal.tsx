import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Modal, Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { createCenter } from '../../redux/actions/costsCenterActions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../utility/showAlert.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { handlePromise, validateForm } from '../../helpers/alertHelper';


interface AddCenterModalProps {
  open: boolean;
  handleClose: () => void;
  createCenter: (values: CenterValues, meta: any) => void;
}

interface CenterValues {
  descripcion: string;
  tipo: string;
}

const AddCenterModal: React.FC<AddCenterModalProps> = ({ open, handleClose, createCenter}) => {
  const handleSubmit = (values: CenterValues) => {
    const promise = new Promise((resolve, reject) => {
      createCenter(values, { resolve, reject });
    });

    const messages = {
      successTitle: 'Creación Exitosa',
      errorTitle: 'Error en la operación',
      errorText: 'Hubo un problema al crear el centro de costos'
    };

    handlePromise(promise, handleClose, messages, styles);
  };

  const validate = (values: CenterValues) => {
    return validateForm(values, {
      tipo: (value) => {
        if (/[^a-zA-Z]/.test(value)) {
          return 'El campo "Tipo" no admite caracteres especiales';
        }
        return null;
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
        }}>
          <Box 
            sx={{ 
              bgcolor: '#012a47', 
              p: 2, 
              borderTopLeftRadius: 8, 
              borderTopRightRadius: 8,
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" component="span" sx={{ color: 'white' }}>
              Centro de Costos
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ 
                color: '#012a47', 
                backgroundColor: 'white',
                borderRadius: '5px !important',
                padding: 0.5,
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 4 }}>
            <Formik initialValues={{ descripcion: '', tipo: '' }} validate={validate} onSubmit={handleSubmit}>
              {({ isSubmitting, values, errors }) => (
                <Form>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="span" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>Descripción:</Typography>
                    <Field 
                      as={TextField} 
                      name="descripcion" 
                      fullWidth 
                      sx={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                      }}
                      InputProps={{
                        sx: {
                          border: '1px solid lightgrey'
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="span" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>Tipo:</Typography>
                    <Field 
                      as={TextField} 
                      name="tipo" 
                      fullWidth 
                      sx={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                      }}
                      InputProps={{
                        sx: {
                          border: '1px solid lightgrey'
                        },
                      }}
                      inputProps={{ maxLength: 1 }} 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !values.descripcion || !values.tipo || !!errors.tipo}
                      sx={{
                        backgroundColor: (isSubmitting || !values.descripcion || !values.tipo || !!errors.tipo) ? 'lightgrey' : '#013A58',
                        color: 'white !important',
                        textTransform: 'none',
                        borderRadius: '8px !important',
                        '&:hover': {
                          backgroundColor: (isSubmitting || !values.descripcion || !values.tipo || !!errors.tipo) ? 'lightgrey' : '#012a47'
                        }
                      }}
                    >
                      Crear
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.costsCenter.loading,
  error: state.costsCenter.error,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createCenter: bindActionCreators(createCenter, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCenterModal);
