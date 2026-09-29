import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faLink } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { COLORS } from '../../utility/utils';
import { NumberFormat } from '../../helpers/numberFormat';
import OficialesCuentaLists from '../../views/pages/empleados/OficialesCuentaLists';
import { getOficiales } from '../../redux/actions/oficialesDeCuentas/empleados.actions';



interface Column {
  name: string;
  width?: string;
  cell?: (row: any) => React.ReactNode;
  wrap?: boolean;
  selector?: string;
}

const customStyles = {
  rows: {},
  headCells: {
    style: {
      backgroundColor: COLORS.SECONDARY,
      color: COLORS.WHITE,
      textAlign: 'center'
    },
  },
  cells: {},
};

const OficialesCuentaContainer = (props: any) => {
  const { getOficialesAction, oficiales, isLoading } = props;
  const [columns, setColumns] = useState<Column[]>([]);
  const [data, setData] = useState<any>([]);
  const [buscador, setBuscador] = useState("");


  useEffect(() => {
    if ( oficiales.length === 0) {
      getOficialesAction();
    }
    setColumns([
      { name: "Origen", selector: "origen", wrap: true },
      { name: "Sucursal", selector: "sucursal", wrap: true },
      { name: "Ag. Colocador", selector: "agente_colocador_descripcion", wrap: true },
      { name: "Descripcion", selector: "descripcion", wrap: true },
      { name: "% Asignado", wrap: true, cell: (row) => (<span style={{ textAlign: 'right' }}>{NumberFormat(row.asignado, 0, ",", ".")} %</span>) },
      {
        name: "Accion", width: '8%', cell: (row) => (
          <Link to={"/empleados/oficiales/getone/" + row.id}>
            <Button size='sm' color="primary">
              <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faLink} />
            </Button>
          </Link>
        )
      },
    ]);
  }, [getOficialesAction, oficiales.length]);


  useEffect(() => {
    if (buscador === '') {
      setData(oficiales.map((e: any) => ({
        ...e,
        obj: JSON.stringify(e),
      })));
    } else {
      let response: any[] = [];
      oficiales.map((e: any) => {
        if (
          e?.descripcion?.toUpperCase().includes(buscador.toUpperCase()) ||
          e?.sucursal?.toUpperCase().includes(buscador.toUpperCase()) ||
          e?.origen?.toUpperCase().includes(buscador.toUpperCase()) ||
          e?.agente_colocador_descripcion?.toUpperCase().includes(buscador.toUpperCase())
        ) {
          response.push(e);
        }
      });
      setData(response.map((e) => ({
        ...e,
        obj: JSON.stringify(e),
      })));
    }
  }, [buscador, oficiales]);

  return (
    <>
        <OficialesCuentaLists
          columns={columns}
          data={data}
          setBuscador={setBuscador}
          buscador={buscador}
          customStyles={customStyles}
          isLoading={isLoading}
        />
    </>
  );
}

const mapStateToProps = (state: { user: any; oficiales: any; }) => ({
  isLoading: state.oficiales.loading, 
  oficiales: state.oficiales.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getOficialesAction: bindActionCreators(getOficiales, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OficialesCuentaContainer);
