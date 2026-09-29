import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { deleteCenter, getAllCenter, updateCenter } from '../../redux/actions/costsCenterActions';
import { CostsCenterProps, EditData } from '../../components/interfaces/costsCenterInterfaces';
import styles from '../../utility/showAlert.module.css';
import { handlePromise } from '../../helpers/alertHelper';
import Swal from 'sweetalert2';
import Index from '../../views/pages/costs_center';
import CircularProgress from '@mui/material/CircularProgress'; 


const CostsCenterContainer: React.FC<CostsCenterProps> = ({ getAllCenterAction, deleteCenterAction, updateCenterAction, data, isLoading }) => {

  const [editData, setEditData] = useState<EditData>({});
  const [editRowIndices, setEditRowIndices] = useState<Set<number>>(new Set());
  const [openAddModal, setOpenAddModal] = useState(false);


  useEffect(() => {
    getAllCenterAction();
  }, [getAllCenterAction]);

  const startEdit = (index: number) => {
    const newIndices = new Set(editRowIndices);
    newIndices.add(index);
    setEditRowIndices(newIndices);
    setEditData({ ...editData, [index]: { ...data[index] } });
  };

  // Cancela la edición de una fila específica
  const cancelEdit = (index: number) => {
    const newIndices = new Set(editRowIndices);
    newIndices.delete(index);
    setEditRowIndices(newIndices);
    setEditData(prevEditData => {
      const newEditData = { ...prevEditData };
      delete newEditData[index];
      return newEditData;
    });
  };

  // Guarda los cambios de una fila editada
  const saveEdit = (index: number) => {
    const newIndices = new Set(editRowIndices);
    newIndices.delete(index);
    const dataToSave = editData[index];
    const promise = new Promise((resolve, reject) => {
      updateCenterAction(dataToSave, { resolve, reject });
    });
    handlePromise(promise, () => {}, { // Se llama a la función reutilizable que maneja las asincronías para mostrar las alertas tanto de éxito como de error y se le pasan propiedades específicas
      successTitle: 'Centro Editado con Éxito',
      errorTitle: 'Error',
      errorText: 'Hubo un problema al editar el centro de costos'
    }, styles);
    setEditRowIndices(newIndices);
  };

  // Maneja los cambios en los campos editables
  const handleEditChange = (value: string, index: number, fieldName: string) => {
    setEditData({
      ...editData,
      [index]: {
        ...editData[index],
        [fieldName]: value
      }
    });
  };

  // Maneja la eliminación de un centro de costos
  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar el centro de costos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: `${styles['custom-swal-button']} ${styles['custom-swal-button-gap']}`,
        cancelButton: styles['custom-swal-button']
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const promise = new Promise((resolve, reject) => {
          deleteCenterAction(id, { resolve, reject });
        });
        handlePromise(promise, () => {}, { // Se llama a la función reutilizable que maneja las asincronías para mostrar las alertas tanto de éxito como de error y se le pasan propiedades específicas
          successTitle: 'Centro Eliminado con Éxito',
          errorTitle: 'Error',
          errorText: 'Hubo un problema al eliminar el centro de costos'
        }, styles);
      }
    });
  };


  const handleAddClick = () => {
    setOpenAddModal(true);
  };

 
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  return (
    <>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: "darkblue" }} /> 
        </div>
      ) : (
        <Index
          data={data}
          editData={editData}
          editRowIndices={editRowIndices}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          handleEditChange={handleEditChange}
          handleDelete={handleDelete}
          handleAddClick={handleAddClick}
          openAddModal={openAddModal}
          handleCloseAddModal={handleCloseAddModal}
        />
      )}
    </>
  );
};


const mapStateToProps = (state: any) => ({
  data: state.costsCenter.data, 
  isLoading: state.loading.isLoading, 
});

// Mapear las acciones de Redux a las props del componente
const mapDispatchToProps = (dispatch: Dispatch) => ({
  getAllCenterAction: bindActionCreators(getAllCenter, dispatch),
  deleteCenterAction: bindActionCreators(deleteCenter, dispatch),
  updateCenterAction: bindActionCreators(updateCenter, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CostsCenterContainer);
