import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {COLORS} from "../../../utility/utils";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import React, {useEffect, useState} from "react";
import API from "../../../api";
import {NumberFormat} from "../../../helpers/numberFormat";
import {Link} from "react-router-dom";
import DataTable from "react-data-table-component";

const OficialCuenta = (props) =>{

    const [oficiales, setOficiales] = useState([]);
    const [catalogoOficiales, setCatalogoOficiales] = useState([]);
    const [catalogoOficial, setCatalogoOficial] = useState([]);
    const [catalogoOficialPorcentaje, setCatalogoOficialPorcentaje] = useState(0);
    const [catalogoOficialPorcentajeBaseCalculo, setCatalogoOficialPorcentajeBaseCalculo] = useState(0);
    const [user, setUser] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(()=>{
        setOficiales(props.oficiales);

    },[props]);

    useEffect(()=>{

        API.getInfo().then((response)=>{
            setUser(response.data);
        })

        API.getOficiales().then((response)=>{
            setCatalogoOficiales(response.data.oficiales.map((e, i) => ({ label: (e.origen + ' - ' + e.descripcion + (e.origen=="VFONDOS" ? '( Ag:' + e.agente_colocador_descripcion + ' Sucursal:' + e.sucursal  + ')' : '')), value: e.id, obj:e })));
        })

        setColumns([
            {name:"Descripcion",wrap: true,cell:(row)=>(
                    <Link to={"/empleados/oficiales/getone/"+  row.oficial.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                        <span>
                            {row.oficial.descripcion.toUpperCase()}
                        </span>
                    </Link>
                )},
            {name:"Agente", width:'20%' ,wrap: true,selector:'oficial.agente_colocador_descripcion'},
            {name:"Sucursal", width:'5%' ,wrap: true,selector:'oficial.sucursal'},
            {name:"Origen", width:'10%' ,wrap: true,selector:'oficial.origen'},
            {name:"Base Calculo", width:'10%' ,wrap: true,cell: (row)=>(<span>{NumberFormat(row.porcentaje_base_calculo,2,",",".")} %</span>)},
            {name:"% Comision", width:'10%' ,wrap: true,cell: (row)=>(<span>{NumberFormat(row.porcentaje,2,",",".")} %</span>)},
            {name:"Accion", width:'10%',cell :(row) => (
                    <Button.Ripple size='sm'  color="danger" outline={true} onClick={()=>{props.dettachOficial(row.oficial.id)}}  >
                        <span>Eliminar</span>
                    </Button.Ripple>

                )},
        ])
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
            <Row style={{marginTop:30}}>
                <Col md={12} style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'flex-start'}}>

                    <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>Oficiales de Cuenta Asignado</span>
                </Col>
            </Row>

            <Card style={{marginTop:30}}>
                <CardBody>

                    {(user?.rol?.codigo=="RRHH" || user?.rol?.codigo=="SU") &&
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label style={{fontWeight:'bold'}}>Oficial</Label>
                                    <Select
                                        className="React"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        isClearable={true}
                                        options={catalogoOficiales}
                                        style={{marginTop:5}}
                                        value={(!(catalogoOficial?.id) ? [] :  { label:(catalogoOficial.origen + ' - ' + catalogoOficial.descripcion + (catalogoOficial.origen=="VFONDOS" ? '( Ag:' + catalogoOficial.agente_colocador_descripcion + ' Sucursal:' + catalogoOficial.sucursal  + ')' : '')), value: catalogoOficial.id, obj:catalogoOficial })}
                                        onChange={(e)=>{
                                            setCatalogoOficial(e?.obj ?? []);
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <Label style={{fontWeight:'bold'}}>% Base Calculo</Label>
                                <CurrencyInput style={{textAlign:'right'}}
                                               className="form-control"
                                               precision={2}
                                               decimalSeparator={','}
                                               thousandSeparator={'.'}
                                               value={parseFloat(catalogoOficialPorcentajeBaseCalculo)}
                                               onChange={(e,name) => {
                                                   let porcentaje  =e.replaceAll('$','').replaceAll('.','').replaceAll(',','.');
                                                   setCatalogoOficialPorcentajeBaseCalculo(porcentaje);
                                               }}/>
                            </Col>
                            <Col md={2}>
                                <Label style={{fontWeight:'bold'}}>% Comisiones</Label>
                                <CurrencyInput style={{textAlign:'right'}}
                                               className="form-control"
                                               precision={2}
                                               decimalSeparator={','}
                                               thousandSeparator={'.'}
                                               value={parseFloat(catalogoOficialPorcentaje)}
                                               onChange={(e,name) => {
                                                   let porcentaje  =e.replaceAll('$','').replaceAll('.','').replaceAll(',','.');
                                                   setCatalogoOficialPorcentaje(porcentaje);
                                               }}/>

                            </Col>
                            <Col md={2}>
                                <br/>
                                <Button color="success"
                                        disabled={!(catalogoOficial?.id && catalogoOficialPorcentaje!='' && catalogoOficialPorcentaje>-1 && catalogoOficialPorcentajeBaseCalculo!='' && catalogoOficialPorcentajeBaseCalculo>-1)}
                                        onClick={()=>{props.attachOficial(catalogoOficial.id,catalogoOficialPorcentaje,catalogoOficialPorcentajeBaseCalculo); setCatalogoOficial([]); setCatalogoOficialPorcentajeBaseCalculo(0); setCatalogoOficialPorcentaje(0)}}>
                                    Agregar
                                </Button>
                            </Col>
                        </Row>
                    }



                    <DataTable
                        data={oficiales}
                        columns={columns}
                        pagination
                        striped={true}
                        noDataComponent={'Cargando...'}
                        customStyles={customStyles}
                    />

                </CardBody>
            </Card>
        </div>
    );
}

export default OficialCuenta;