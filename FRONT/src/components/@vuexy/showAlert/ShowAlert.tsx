import Swal from "sweetalert2";
import "./showAlert.css";
export const ShowAlert = {
  error,
  confirm,
  success,
  warning,
  loading,
  genericInput,
};

function error(message: string, title: string = "Error...") {
  return Swal.fire(title, message, "error");
}

function confirm(message: string) {

  return Swal.fire({
    title: message,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonColor: "#b90d04",
    confirmButtonColor: `#1b0da6`,
    icon: "question",
    customClass: {
      confirmButton: "swal2_actions",
      actions: "swal2_actions",
    },
  });
}

function success(message: string) {
  return Swal.fire("Exito...", message, "success");
}

function warning(message: string, title: string = "Advertencia") {
  return Swal.fire(title, message, "warning");
}

function loading(message: string = "Cargando...", title: string = "Cargando") {
  Swal.fire({
    title,
    html: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}
type GenericInputType = "text" | "email" | "file" | "number" | "password" | "textarea" | "select" | "none";


  function genericInput({
    title = "Confirmar!",
    text = "Selecciona un archivo CSV",
    inputType = "file" as GenericInputType,
    inputAttributes = { accept: ".csv, .xlsx" },
    showCancelButton = true,
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar",
    showLoaderOnConfirm = true,
    customClass = { input: "my-input-class", confirmButton: "my-confirm-button-class", cancelButton: "my-cancel-button-class" },
    allowOutsideClick = () => !Swal.isLoading(),
    preConfirmAction = async (selectedFile: any) => {
      if (!selectedFile && inputType === "file") {
        Swal.showValidationMessage("No se seleccionó ningún archivo.");
        return false;
      }
      return selectedFile;
    },
  }) {
    return Swal.fire({
      title,
      text,
      input: inputType !== "none" ? inputType : undefined,
      inputAttributes,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      showLoaderOnConfirm,
      customClass,
      allowOutsideClick,
      preConfirm: preConfirmAction,
    });
  }