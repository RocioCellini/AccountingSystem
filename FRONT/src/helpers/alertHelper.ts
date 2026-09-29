import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

//funcion para mostrar alertas de éxito o error ante cualquier acción manejada desde redux sagas para solucionar la asincronía
interface SwalMessages {
  successTitle: string;
  successText?: string;
  errorTitle: string;
  errorText?: string;
}

export const handlePromise = (promise: Promise<any>, handleClose: () => void, messages: SwalMessages, styles: any) => {
  promise
    .then(() => {
      handleClose();
  //alerta de éxito: 
      Swal.fire({
        title: messages.successTitle,
        text: messages.successText,
        icon: 'success',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: styles['custom-swal-button']
        }
      });
    })
    .catch((error) => {
  //alerta de error:
      Swal.fire({
        title: messages.errorTitle,
        text: `${messages.errorText}: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
};

//funcion para validar campos en un formulario y lanzar una alerta de tipo toast en caso de error

export const validateForm = <T extends Record<string, any>>(values: T, validationRules: { [K in keyof T]?: (value: T[K]) => string | null }): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const key in validationRules) {
    const validate = validationRules[key];
    if (validate) {
      const error = validate(values[key]);
      if (error) {
        errors[key] = error;
        toast.error(error);
      }
    }
  }
  
  return errors;
};
