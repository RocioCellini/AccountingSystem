import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {COLORS} from "../../utility/utils";
import API from './../../api';
import {Button, Row, Col} from "reactstrap";
import {NumberFormat} from "../../helpers/numberFormat";
import {Link} from "react-router-dom";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Flip, toast} from "react-toastify";
import {setNovedades} from "../../redux/actions/novedades";
import {useDispatch} from "react-redux";


const NovedadesIncrementos = (props) =>{
    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [novedadesElegidas,setNovedadesElegidas] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{

        setColumns([
            {name:"Id",selector:"id", wrap:true},
            {name:"Propuesto Por",selector:"propuesto_por.name", wrap:true},
            {name:"Empleado", wrap:true,cell :(row) => (
                    <Link to={"/empleados/getone/"+  row.empleado.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                            <span>
                                {row.empleado.nombre_apellido.toUpperCase()}
                            </span>
                    </Link>)},
            {name:"Sector", wrap:true,selector:"empleado.sector.descripcion"},
            {name:"Periodo", wrap:true,selector:"periodo"},
            {name:"Incremento", wrap:true,cell :(row) => (<span style={{width:'80%',textAlign: 'right'}}>{NumberFormat(row.variacion,0,",",".")} %</span>)},
            {name:"Nuevo Sueldo", wrap:true,cell :(row) => (<span style={{width:'80%',textAlign: 'right'}}>$ {NumberFormat(row.sueldo_bruto,0,",",".")}</span>)},
            {name:"Accion", wrap:true,cell :(row) => (
                    <div style={{flexDirection:'row'}}>
                        <Button.Ripple size='sm'  color="success" onClick={()=>{
                            API.aprobarRechazarNovedad({id:row.id, estado:true}).then((response)=>{
                                setData(response.data.novedades);
                                dispatch(setNovedades(response.data.novedades.length));
                                toast.success("La Novedad Fue Aprobada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faCheck} />
                        </Button.Ripple>

                        <Button.Ripple size='sm'  color="danger" onClick={()=>{
                            API.aprobarRechazarNovedad({id:row.id, estado:false}).then((response)=>{
                                setData(response.data.novedades);
                                dispatch(setNovedades(response.data.novedades.length));
                                toast.error("La Novedad Fue Rechazada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faTimes} />
                        </Button.Ripple>
                    </div>
                )},
        ])

        API.getNovedadesPendientesAprobacion().then((response)=>{
            setData(response?.data?.novedades || []);
        });

        API.getInfo().then((response)=>{
            setUser(response.data);
        });
    },[]);

    const customStyles = {
        headCells: {
            style: {
                backgroundColor:COLORS.SECONDARY,
                color:COLORS.WHITE,
                textAlign:'center'
            },
        },
    };

    return (
        <div>
            <Row>
                <Col md={12}>
                    <span style={{fontSize:18, color:COLORS.SECONDARY, fontWeight:'bold'}}>Incrementos Salariales</span>
                </Col>
            </Row>

            {novedadesElegidas.length > 0 && (
                <Row style={{marginTop:30, marginBottom:20}}>
                    <Col md={3}>
                        <Button.Ripple size='md' outline={true} color="success" onClick={()=>{
                            toast.warn("Procesando..., aguarde!", { transition: Flip, autoClose: false });
                            API.aprobarRechazarNovedades({rows: novedadesElegidas, estado: true}).then((response)=>{
                                toast.dismiss();
                                setData(response.data.novedades);
                                dispatch(setNovedades(response.data.novedades.length));
                                toast.success("Todas las Novedades fueron Aprobadas!", { transition: Flip });
                            });
                        }}>
                            Aprobar Todas
                        </Button.Ripple>
                    </Col>
                    <Col md={3}>
                        <Button.Ripple size='md' outline={true} color="danger" onClick={()=>{
                            toast.warn("Procesando..., aguarde!", { transition: Flip, autoClose: false });
                            API.aprobarRechazarNovedades({rows: novedadesElegidas, estado: false}).then((response)=>{
                                toast.dismiss();
                                setData(response.data.novedades);
                                dispatch(setNovedades(response.data.novedades.length));
                                toast.error("Todas las Novedades fueron Rechazadas!", { transition: Flip });
                            });
                        }}>
                            Rechazar Todas
                        </Button.Ripple>
                    </Col>
                </Row>
            )}

            <DataTable
                data={data}
                columns={columns}
                pagination
                striped={true}
                selectableRows={true}
                selectableRowsHighlight={true}
                clearSelectedRows={true}
                noDataComponent={'No hay datos'}
                onSelectedRowsChange={({allSelected, selectedCount, selectedRows })=>{
                    setNovedadesElegidas(selectedRows);
                }}
                customStyles={customStyles}
            />
        </div>
    )
}

export default NovedadesIncrementos;
