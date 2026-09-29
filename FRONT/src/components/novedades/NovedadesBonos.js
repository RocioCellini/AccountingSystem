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
import {setBonos} from "../../redux/actions/novedades";


const NovedadesBonos = (props) =>{

    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [novedadesElegidas, setNovedadesElegidas] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{

        setColumns([
            {name:"Id", wrap:true,selector:"legajo_bejerman"},
            {name:"Empleado", wrap:true,cell :(row) => (
                    <Link to={"/empleados/getone/"+  row.empleado.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                            <span>
                                {row.empleado.nombre_apellido.toUpperCase()}
                            </span>
                    </Link>)},
            {name:"Periodo", wrap:true,selector:"periodo"},
            {name:"Importe", wrap:true,cell :(row) => (<span style={{width:'80%',textAlign: 'right'}}>{NumberFormat(row.importe,0,",",".")}</span>)},

            {name:"Accion", wrap:true,cell :(row) => (
                    <div style={{flexDirection:'row'}}>
                        <Button.Ripple size='sm'  color="success" onClick={()=>{
                            toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});
                            API.aprobarRechazarBono({id:row.id, estado:true}).then((response)=>{
                                toast.dismiss();
                                setData(response.data.bonos);
                                dispatch(setBonos(response.data.bonos.length));
                                toast.success("El Bono Fue Aprobada Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faCheck} />
                        </Button.Ripple>

                        <Button.Ripple size='sm'  color="danger" onClick={()=>{
                            toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});
                            API.aprobarRechazarBono({id:row.id, estado:false}).then((response)=>{
                                toast.dismiss();
                                setData(response.data.bonos);
                                dispatch(setBonos(response.data.bonos.length));
                                toast.error("El Bono Fue Rechazado Correctamente!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faTimes} />
                        </Button.Ripple>
                    </div>
                )},
        ])

        API.getBonosPendientesDeAprobacion().then((response)=>{
            setData(response.data.bonos)
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
                                <span style={{fontSize:18, color:COLORS.SECONDARY, fontWeight:'bold'}}>Bonos Semestrales</span>
                            </Col>
                        </Row>

                        {novedadesElegidas.length>0 &&
                        <Row style={{marginTop:30,marginBottom:20}}>
                            <Col md={3}>
                                <Button.Ripple size='md' outline={true} color="success" onClick={()=>{

                                    API.aprobarRechazarBonoMasivo({rows:novedadesElegidas, estado:true}).then((response)=>{
                                        setData(response.data.bonos);
                                        dispatch(setBonos(response.data.bonos.length));
                                        toast.success("Todas los Bonos fueron Aprobados!", { transition: Flip });
                                    })

                                }}>
                                    Aprobar Todas
                                </Button.Ripple>
                            </Col>
                            <Col md={3}>
                                <Button.Ripple size='md' outline={true} color="danger" onClick={()=>{
                                    API.aprobarRechazarBonoMasivo({rows:novedadesElegidas, estado:false}).then((response)=>{
                                        setData(response.data.bonos);
                                        dispatch(setBonos(response.data.bonos.length));
                                        toast.error("Todos las Bonos fueron Rechazados!", { transition: Flip });
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

export default NovedadesBonos
