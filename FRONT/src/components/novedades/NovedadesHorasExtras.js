import React, {useEffect, useState} from "react"
import DataTable from "react-data-table-component";
import {COLORS} from "../../utility/utils";
import API from './../../api';
import {
    Button,
    Row,
    Col,
} from "reactstrap";

import {NumberFormat} from "../../helpers/numberFormat";
import {Link} from "react-router-dom";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Flip, toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {setHorasExtras, setNovedades} from "../../redux/actions/novedades";


const NovedadesHorasExtras = (props) =>{
    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [novedadesElegidas,setNovedadesElegidas] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{

        setColumns([
            {name:"Id",selector:"id", wrap:true},
            {name:"Cargado Por",selector:"propuesto_por.name", wrap:true},
            {name:"Empleado", wrap:true,cell :(row) => (
                    <Link to={"/empleados/getone/"+  row.empleado.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                            <span>
                                {row.empleado.nombre_apellido.toUpperCase()}
                            </span>
                    </Link>)},
            {name:"Sector",selector:"empleado.sector.descripcion", wrap:true},
            {name:"Periodo",selector:"periodo", wrap:true},
            {name:"Cantidad Hs 50%", wrap:true,cell :(row) => (<span style={{width:'80%',textAlign: 'right'}}>{NumberFormat(row.horas_extras_50,2,",",".")}</span>)},
            {name:"Cantidad Hs 100%", wrap:true,cell :(row) => (<span style={{width:'80%',textAlign: 'right'}}>{NumberFormat(row.horas_extras_100,2,",",".")}</span>)},
            {name:"Accion", wrap:true,cell :(row) => (
                    <div style={{flexDirection:'row'}}>
                        <Button.Ripple size='sm'  color="success" onClick={()=>{
                            toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});
                            API.aprobarRechazarHorasExtras({id:row.id, estado:true}).then((response)=>{
                                toast.dismiss();
                                setData(response.data.novedades);
                                dispatch(setHorasExtras(response.data.novedades.length));
                                toast.success("Las Horas Extras Fue Aprobada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faCheck} />
                        </Button.Ripple>

                        <Button.Ripple size='sm'  color="danger" onClick={()=>{
                            toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});
                            API.aprobarRechazarHorasExtras({id:row.id, estado:false}).then((response)=>{
                                toast.dismiss();
                                setData(response.data.novedades);
                                dispatch(setHorasExtras(response.data.novedades.length));
                                toast.error("Las Horas Extras Fue Rechazada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faTimes} />
                        </Button.Ripple>
                    </div>
                )},
        ])

        API.getHorasExtrasPendientesAprobacion().then((response)=>{
            setData(response.data.novedades)
        });

        API.getInfo().then((response)=>{
            setUser(response.data);
        })
    },[]);




    const customStyles = {
        rows: {

        },
        headCells: {
            style: {
                backgroundColor:COLORS.SECONDARY,
                color:COLORS.WHITE,
                textAlign:'center'
            },
        },
        cells: {

        },
    };

    return (
        <div>
            {data?.length>0 &&
                <div>
                    <Row>
                        <Col md={12}>
                            <span style={{fontSize:18, color:COLORS.SECONDARY, fontWeight:'bold'}}>Horas Extras</span>
                        </Col>
                    </Row>

                    {novedadesElegidas.length>0 &&
                        <Row style={{marginTop:30,marginBottom:20}}>
                            <Col md={3}>
                                <Button.Ripple size='md' outline={true}  color="success" onClick={()=>{
                                    API.aprobarRechazarHorasExtrasMasivas({rows:novedadesElegidas, estado:true}).then((response)=>{
                                        setData(response.data.novedades);
                                        dispatch(setNovedades(response.data.novedades.length));
                                        toast.success("Todas las Horas Extras fueron Aprobadas!", { transition: Flip });
                                    })
                                }}>
                                    Aprobar Todas
                                </Button.Ripple>
                            </Col>
                            <Col md={3}>
                                <Button.Ripple size='md' outline={true}  color="danger" onClick={()=>{
                                    API.aprobarRechazarHorasExtrasMasivas({rows:novedadesElegidas, estado:false}).then((response)=>{
                                        setData(response.data.novedades);
                                        dispatch(setNovedades(response.data.novedades.length));
                                        toast.error("Todas las Horas Extras fueron Rechazadas!", { transition: Flip });
                                    })
                                }}>
                                    Rechazar Todas
                                </Button.Ripple>
                            </Col>
                        </Row>
                    }
                    <DataTable
                        data={data}
                        columns={columns}
                        pagination
                        striped={true}
                        selectableRows={true}
                        selectableRowsHighlight={true}
                        clearSelectedRows={true}
                        noDataComponent={'No hay datos'}

                        onSelectedRowsChange = {({allSelected, selectedCount, selectedRows })=>{
                            setNovedadesElegidas(selectedRows)
                        }}
                        customStyles={customStyles}
                    />
                </div>
            }
        </div>
    )
}

export default NovedadesHorasExtras
