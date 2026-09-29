import React, {useEffect, useState} from "react"
import DataTable from "react-data-table-component";
import {COLORS} from "../../../utility/utils";
import API from './../../../api';
import {
    Button,
    Input,
    Card,
    CardBody,
    Row,
    Col,
    Modal,
    ModalBody, FormGroup, Label
} from "reactstrap";


import { faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Select from "react-select";

import {Flip, toast} from "react-toastify";


const Index = (props) =>{
    const [user, setUser] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [data, setData] = useState([]);
    const [buscador, setBuscador] = useState("");
    const [columns, setColumns] = useState([]);
    const [show, setShow] = useState(false);
    const [centros, setCentros] = useState([]);
    const [conceptos, setConceptos] = useState([]);
    const [cuenta, setCuenta] = useState([]);


    useEffect(()=>{
        API.getCuentasContables().then((response)=>{
            setCuentas(response.data.cuentas);
            setData(response.data.cuentas.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));
        });

        API.getCentrosCosto().then((response)=>{
            setCentros(response.data.centros.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        });

        API.getConceptosLiquidacion().then((response)=>{
            setConceptos(response.data.conceptos.map((e, i) => ({ label: e.descripcion, value: e.codigo, obj:e })));
        });


        API.getInfo().then((response)=>{
            setUser(response.data);
            setColumns([
                {name:"Empresa",wrap: true,cell:(row)=>(<span>{row?.empresa?.descripcion}</span>)},
                {name:"Numero",selector:"numero_cuenta",wrap: true},
                {name:"Descripcion",selector:"descripcion",wrap: true},
                {name:"Concepto",selector:"concepto",wrap: true},
                {name:"Centro Costo",wrap: true,cell:(row)=>(<span>{row?.centro_costo?.descripcion}</span>)},
                {name:"Accion", width:'8%',cell :(row) => (
                        <Button.Ripple size='sm'  color="primary"   onClick={()=>{setCuenta(row); setShow(true)}}>
                            <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faLink} />
                        </Button.Ripple>

                    )},
            ])
        });
    },[]);



    useEffect(()=>{

        if(buscador==''){
            setData(cuentas.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));

        } else {
            let response = [];
            cuentas.map((e,i)=>{
                if((e?.descripcion ?? '').toUpperCase().includes(buscador.toUpperCase())
                    || (e?.numero_cuenta ?? '').toUpperCase().includes(buscador.toUpperCase())
                    || (e?.empresa?.descripcion ?? '').toUpperCase().includes(buscador.toUpperCase())
                    || (e?.centro_costo?.numero_cuenta ?? '').toUpperCase().includes(buscador.toUpperCase())
                    || (e?.concepto ?? '').toUpperCase().includes(buscador.toUpperCase())
                ){
                    response.push(e);
                }
            });
            setData(response.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));
        }
    },[buscador]);


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

                    <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>Cuentas Contables</span>

                    <Input
                        type="text"
                        placeholder="Buscador"
                        style={{width:300, borderRadius:10, marginLeft:30, marginRight:30}}
                        value={buscador}
                        onChange={e => setBuscador(e.target.value)}/>

                </Col>
            </Row>


            <Card style={{marginTop:30}}>
                <CardBody>


                    <Row>
                        <Col md={12}>


                            <DataTable
                                data={data}
                                columns={columns}
                                pagination
                                striped={true}
                                noDataComponent={'No hay datos'}
                                customStyles={customStyles}
                            />


                        </Col>
                    </Row>
                </CardBody>
            </Card>



            <Modal
                isOpen={show}
                toggle={()=>{setShow(!show)}}
                className="modal-dialog-centered modal-lg">
                <ModalBody>

                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label style={{fontWeight:'bold'}}>Numero:</Label>
                                <Input
                                    type="text"
                                    style={{marginTop:5}}
                                    disabled={true}
                                    value={cuenta?.numero_cuenta}/>
                            </FormGroup>
                        </Col>
                        <Col md={8}>
                            <FormGroup>
                                <Label style={{fontWeight:'bold'}}>Descripcion:</Label>
                                <Input
                                    type="text"
                                    style={{marginTop:5}}
                                    disabled={true}
                                    value={cuenta?.descripcion}/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row style={{marginTop:15}}>
                        <Col md={6}>
                            <FormGroup>
                                <Label style={{fontWeight:'bold'}}>Centro Costo:</Label>
                                <Select
                                    className="React"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    isClearable={true}
                                    options={centros}
                                    style={{marginTop:5}}
                                    onChange={(e)=>{
                                        setCuenta({...cuenta, centro_costo:e?.obj, centro_costo_id:e?.value});

                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label style={{fontWeight:'bold'}}>Concepto:</Label>
                                <Select
                                    className="React"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    isClearable={true}
                                    options={conceptos}
                                    style={{marginTop:5}}
                                    onChange={(e)=>{
                                        setCuenta({...cuenta, concepto:e?.value});
                                    }}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2}>
                            <br/>
                            <Button color="primary" size={'sm'}
                                    onClick={()=>{
                                        toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});
                                        API.saveCuentaContable(cuenta).then((response)=>{
                                            toast.dismiss();
                                            toast.success("Listo!", { transition: Flip});
                                            setCuentas(response.data.cuentas);
                                            setData(response.data.cuentas.map((e)=>({
                                                ...e,
                                                obj:JSON.stringify(e),
                                            })));

                                            setShow(false);
                                            setCuenta([]);
                                        })
                                    }}>
                                Guardar
                            </Button>
                        </Col>
                    </Row>



                </ModalBody>
            </Modal>

        </div>
    )
}

export default Index
