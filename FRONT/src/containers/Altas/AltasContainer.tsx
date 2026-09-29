import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  Alta,
  AltasProps
} from "../../types/altas/altasTypes";
import Index from "../../views/pages/altas";
import { getAltas } from "../../redux/actions/altasActions/altas.actions";
import { getInfo } from "../../redux/actions/user/user.actions";

const AltasContainer: React.FC<AltasProps> = ({
  getAltas,
  getInfo,
  altas,
  user,
}) => {
  const [filteredAltas, setFilteredAltas] = useState<Alta[]>([]);
  const [newAlta, setNewAlta] = useState<Partial<Alta>>({});
  const [showModal, setShowModal] = useState<boolean>(false);

  const permiteAlta: boolean = user?.id ? true : false; 

  const handleOpenShowModal = () => setShowModal(true);

  const onClickNuevaAlta = () => {
    handleOpenShowModal();
    setNewAlta({
      padre_id: user?.empleado_id,
      padre: user?.empleado,
    });
  };

  const updateFilteredAltas = (altas: Alta[]) => {
    setFilteredAltas(
      altas.map((alta) => ({
        ...alta,
        obj: JSON.stringify(alta),
      }))
    );
  };

  const handleEditAlta = async (alta: Alta) => {
    handleOpenShowModal();
    setNewAlta(alta);
  };

  useEffect(() => {
    getAltas();
    getInfo();
  }, [getAltas, getInfo]);

  useEffect(() => {
    setFilteredAltas(
      altas.map((alta) => ({
        ...alta,
        obj: JSON.stringify(alta),
      }))
    );
  }, [altas]);

  return (
    <>
      <Index
        altas={filteredAltas}
        newAlta={newAlta}
        permiteAlta={permiteAlta}
        showModal={showModal}
        onClickNuevaAlta={onClickNuevaAlta}
        setShowModal={setShowModal}
        updateFilteredAltas={updateFilteredAltas}
        handleEditAlta={handleEditAlta}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  altas: state.altas.data,
  user: state.user.user.data,
});

// Mapear las acciones de Redux a las props del componente
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAltas,
      getInfo,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AltasContainer);
