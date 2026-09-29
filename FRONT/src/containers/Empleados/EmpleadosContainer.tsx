import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addFavoritoEmpleado, getEmpleados, removeFavoritoEmpleado } from '../../redux/actions/empleados/empleados.actions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../../utility/utils";
import { Link, useLocation } from "react-router-dom";
import { faLink, faStar } from "@fortawesome/free-solid-svg-icons";
import { NumberFormat } from "../../helpers/numberFormat";

import { Button } from 'reactstrap';
import EmpleadosList from '../../views/pages/empleados/EmpleadosLists';

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

const EmpleadosContainer = (props: any) => {
  const { user, empleados, addFavoritoEmpleadoAction, removeFavoritoEmpleadoAction, getEmpleadosAction, isLoading } = props;
  const [columns, setColumns] = useState<Column[]>([]);
  const [soloActivos, setSoloActivos] = useState(true);
  const [data, setData] = useState<any>([]);
  const [buscador, setBuscador] = useState("");
  const location = useLocation(); 

   useEffect(() => {
    if (location.pathname === '/empleados') {
      getEmpleadosAction(false, soloActivos);
    }
  }, [location.pathname, getEmpleadosAction, soloActivos]);
  
  useEffect(() => {
    if (user?.rol?.codigo !== "GTE") {
      setColumns([
        { name: "Favorito", width: '8%', cell: (row: any) => {
            if (!row.es_favorito) {
              return (
                <Button 
                  size='sm' 
                  color={'warning'} 
                  outline={true} 
                  onClick={() => addFavoritoEmpleadoAction(row.id)} 
                >
                  <FontAwesomeIcon style={{ color: COLORS.WARNING }} icon={faStar} />
                </Button>
              );
            } else {
              return (
                <Button 
                  size='sm'
                  color={'warning'}
                  onClick={() => removeFavoritoEmpleadoAction(row.id)} 
                >
                  <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faStar} />
                </Button>
              );
            }
          }
        },
        { name: "Gerencia", wrap: true, cell: (row) => (<span>{row?.padre?.nombre_apellido}</span>) },
        { name: "Nombre Completo", selector: "nombre_apellido", wrap: true },
        { name: "Legajo Bejerman", selector: "legajo_bejerman", wrap: true },
        { name: "Legajo Sun", selector: "legajo_sun", wrap: true },
        { name: "Empresa", selector: "empresa.descripcion", wrap: true },
        { name: "Sector", selector: "sector.descripcion", wrap: true },
        { name: "Sueldo Bruto", selector: "sueldo_bruto", wrap: true, cell: (row) => (<span style={{ width: '80%', textAlign: 'right' }}>{NumberFormat(row.ultimo_sueldo, 0, ",", ".")}</span>) },
        { name: "Accion", width: '8%', cell: (row) => (
            <Link to={"/empleados/getone/" + row.id}>
              <Button size='sm' color="primary">
                <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faLink} />
              </Button>
            </Link>
          )
        },
      ]);
    } else {
      setColumns([
        { name: "Favorito", width: '8%', cell: (row) => {
            if (!row.es_favorito) {
              return (
                <Button 
                  size='sm' 
                  color={'transparent'} 
                  outline={true}
                  onClick={() => addFavoritoEmpleadoAction(row.id)} 
                >
                  <FontAwesomeIcon style={{ color: COLORS.GRAY_LIGHT }} icon={faStar} />
                </Button>
              );
            } else {
              return (
                <Button
                  size='sm' 
                  color={'transparent'} 
                  onClick={() => removeFavoritoEmpleadoAction(row.id)} 
                >
                  <FontAwesomeIcon style={{ color: COLORS.WARNING }} icon={faStar} />
                </Button>
              );
            }
          }
        },
        { name: "Nombre Completo", selector: "nombre_apellido", wrap: true },
        { name: "Legajo Bejerman", selector: "legajo_bejerman", wrap: true },
        { name: "Legajo Sun", selector: "legajo_sun", wrap: true },
        { name: "Empresa", selector: "empresa.descripcion", wrap: true },
        { name: "Sector", selector: "sector.descripcion", wrap: true },
        { name: "Sueldo Bruto", selector: "sueldo_bruto", wrap: true, cell: (row) => (<span style={{ width: '80%', textAlign: 'right' }}>{NumberFormat(row.ultimo_sueldo, 0, ",", ".")}</span>) },
        { name: "Accion", width: '8%', cell: (row) => (
            <Link to={"/empleados/getone/" + row.id}>
              <Button size='sm' color="primary">
                <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faLink} />
              </Button>
            </Link>
          )
        },
      ]);
    }
  }, [user, addFavoritoEmpleadoAction, removeFavoritoEmpleadoAction]);

  useEffect(() => {
    if (buscador === '') {
      setData(empleados.sort((a: any, b: any) => a.es_favorito < b.es_favorito ? 1 : -1).map((e: any) => ({
        ...e,
        obj: JSON.stringify(e),
      })));
    } else {
      let response: any[] = [];
      empleados.sort((a: any, b: any) => a.es_favorito < b.es_favorito ? 1 : -1).map((e: any) => {
        if (
          e.nombre_apellido.toUpperCase().includes(buscador.toUpperCase()) ||
          (e?.legajo_sun ?? '').toUpperCase().includes(buscador.toUpperCase()) ||
          (e?.legajo_bejerman ?? '').toUpperCase().includes(buscador.toUpperCase()) ||
          e.sector.descripcion.toUpperCase().includes(buscador.toUpperCase()) ||
          e.puesto.descripcion.toUpperCase().includes(buscador.toUpperCase()) ||
          e.empresa.descripcion.toUpperCase().includes(buscador.toUpperCase())
        ) {
          response.push(e);
        }
      });
      setData(response.map((e: any) => ({
        ...e,
        obj: JSON.stringify(e),
      })));
    }
  }, [buscador, empleados]);



  return (
    <>
        <EmpleadosList 
          columns={columns}
          data={data}
          setBuscador={setBuscador}
          buscador={buscador}
          getEmpleadosAction={getEmpleadosAction}
          setSoloActivos={setSoloActivos}
          soloActivos={soloActivos}
          customStyles={customStyles}
          isLoading={isLoading}
        />
      
    </>
  );
};

const mapStateToProps = (state: { user: any; empleados: any; loading: { isLoading: boolean } }) => ({
  empleados: state.empleados.data,
  user: state.user.data,
  isLoading: state.loading.isLoading,  
});
const mapDispatchToProps = (dispatch: any) => ({
  getEmpleadosAction: bindActionCreators(getEmpleados, dispatch),
  addFavoritoEmpleadoAction: bindActionCreators(addFavoritoEmpleado, dispatch),
  removeFavoritoEmpleadoAction: bindActionCreators(removeFavoritoEmpleado, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmpleadosContainer);
