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
import {setComisiones, setNovedades} from "../../redux/actions/novedades";


const NovedadesComisiones = (props) =>{

    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [novedadesElegidas, setNovedadesElegidas] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{

        setColumns([
            {name:"Id",selector:"legajo_bejerman"},
            {name:"Empleado",cell :(row) => (<Link to={"/empleados/getone/"+  row.empleado.id}> {row.empleado.nombre_apellido} </Link>)},
            {name:"Periodo",selector:"periodo"},
            {name:"Importe",cell :(row) => (<span style={{width:'80%',textAlign: 'right'}}>{NumberFormat(row.importe,0,",",".")}</span>)},


            {name:"Accion", width:'14%',cell :(row) => (
                    <div style={{flexDirection:'row'}}>
                        <Button.Ripple size='sm'  color="success" onClick={()=>{
                            API.aprobarRechazarComision({id:row.id, estado:true}).then((response)=>{
                                setData(response.data.comisiones);
                                dispatch(setComisiones(response.data.comisiones.length));
                                toast.success("La comision Fue Aprobada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faCheck} />
                        </Button.Ripple>

                        <Button.Ripple size='sm'  color="danger" onClick={()=>{
                            API.aprobarRechazarComision({id:row.id, estado:false}).then((response)=>{
                                setData(response.data.comisiones);
                                dispatch(setComisiones(response.data.comisiones.length));
                                toast.error("La comision Fue Rechazada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faTimes} />
                        </Button.Ripple>
                    </div>
                )},
        ])

        API.getComisionesPendientes().then((response)=>{
            setData(response.data.comisiones)
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
        <Row>
            <Col md={12}>

                <div>
                    {data.length>0 &&
                    <div>
                        <Row>
                            <Col md={12}>
                                <span style={{fontSize:18, color:COLORS.SECONDARY, fontWeight:'bold'}}>Comisiones</span>
                            </Col>
                        </Row>

                        {novedadesElegidas.length>0 &&
                        <Row style={{marginTop:30,marginBottom:20}}>
                            <Col md={3}>
                                <Button.Ripple size='md' outline={true} color="success" onClick={()=>{
                                    API.aprobarRechazarComisiones({rows:novedadesElegidas, estado:true}).then((response)=>{
                                        setData(response.data.comisiones);
                                        dispatch(setNovedades(response.data.comisiones.length));
                                        toast.success("Todas las Comisiones fueron Aprobadas!", { transition: Flip });
                                    })
                                }}>
                                    Aprobar Todas
                                </Button.Ripple>
                            </Col>
                            <Col md={3}>
                                <Button.Ripple size='md' outline={true} color="danger" onClick={()=>{
                                    API.aprobarRechazarComisiones({rows:novedadesElegidas, estado:false}).then((response)=>{
                                        setData(response.data.comisiones);
                                        dispatch(setNovedades(response.data.comisiones.length));
                                        toast.error("Todas las Comisiones fueron Rechazadas!", { transition: Flip });
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
            </Col>
        </Row>

    )
}

export default NovedadesComisiones
