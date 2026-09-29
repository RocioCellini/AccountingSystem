import React from 'react';
import CustomTable from '../../../components/Table/CustomTable';
import costsCenterColumns from '../../../components/columns/costsCenterColums';
import AddCenterModal from '../../../components/costCenter Modal/addCenterModal';

const Index: React.FC<{
  data: any;
  editData: any;
  editRowIndices: Set<number>;
  startEdit: (index: number) => void;
  cancelEdit: (index: number) => void;
  saveEdit: (index: number) => void;
  handleEditChange: (value: string, index: number, fieldName: string) => void;
  handleDelete: (id: number) => void;
  handleAddClick: () => void;
  openAddModal: boolean;
  handleCloseAddModal: () => void;
}> = ({
  data,
  editData,
  editRowIndices,
  startEdit,
  cancelEdit,
  saveEdit,
  handleEditChange,
  handleDelete,
  handleAddClick,
  openAddModal,
  handleCloseAddModal,
}) => {
  return (
    <div>
      <h1 style={{ color: '#013A58', fontWeight: 'bold' }}>Centro de Costos</h1>
      <CustomTable
        data={data}
        columns={costsCenterColumns}
        editData={editData}
        editRowIndices={editRowIndices}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        handleEditChange={handleEditChange}
        handleDelete={handleDelete}
        handleAddClick={handleAddClick}
        addButtonTooltip="Agregar Centro de Costos"
      />
      <AddCenterModal
        open={openAddModal}
        handleClose={handleCloseAddModal}
      />
    </div>
  );
};

export default Index;
