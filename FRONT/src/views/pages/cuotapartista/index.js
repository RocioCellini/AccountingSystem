import React, {useEffect, useState} from "react"
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
    ModalHeader,
    ModalBody, FormGroup, Label, Alert
} from "reactstrap";

import {NumberFormat} from "../../../helpers/numberFormat";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import {Flip, toast} from "react-toastify";



const Index = (props) =>{
    const [cuotapartista, setCuotapartista] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cuotapartistas, setCuotapartistas] = useState([]);
    const [fondos, setFondos] = useState([]);
    const [distribucion, setDistribucion] = useState([]);

    const [porcentajeExterno, setPorcentajeExterno] = useState(0);
    const [porcentajeInterno, setPorcentajeInterno] = useState(100);

    const [porcentajeAsignadoExterno, setPorcentajeAsignadoExterno] = useState(0);
    const [porcentajeAsignadoInterno, setPorcentajeAsignadoInterno] = useState(0);

    const [oficialesInternos, setOficialesInternos] = useState([]);
    const [oficialesExternos, setOficialesExternos] = useState([]);

    const [oficialInterno, setOficialInterno] = useState([]);
    const [oficialExterno, setOficialExterno] = useState([]);

    const [filtroOficial, setFiltroOficial] = useState([]);
    const [filtroFondo, setFiltroFondo] = useState([]);
    const [filtros, setFiltros] = useState([]);

    const [show, setShow] = useState(false);
    const [cuotapartistasAsociados, setCuotapartistasAsociados] = useState([]);
    const [cuotapartistaAsociado, setCuotapartistaAsociado] = useState([]);




    useEffect(()=>{
        API.getInfo().then((response)=>{
            setUser(response.data);
        })

        API.getOficiales().then((response)=>{
            setOficialesInternos(response.data.oficiales.filter((e)=>(e.origen == 'VFONDOS') && (e.agente_colocador_codigo==2 || e.agente_colocador_codigo==3)).map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
            setOficialesExternos(response.data.oficiales.filter((e)=>(e.origen == 'VFONDOS') && (e.agente_colocador_codigo!=2 && e.agente_colocador_codigo!=3)).map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        })

        API.getFondos().then((response)=>{
            setFondos(response.data.fondos);
            setFiltroFondo(response.data.fondos.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        })


        API.getCuotapartistas().then((response)=>{
            setCuotapartistas(response.data.cuotapartistas.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        })
    },[]);




    useEffect(()=>{
        setPorcentajeInterno(100-parseFloat(porcentajeExterno));
    },[porcentajeExterno])

    useEffect(()=>{
        var totalExterno = 0;
        var totalInterno = 0;
        (cuotapartista?.oficialesExternos ?? []).map((e)=>{
            totalExterno += parseFloat(e.porcentaje);
        });

        (cuotapartista?.oficialesInternos ?? []).map((e)=>{
            totalInterno += parseFloat(e.porcentaje);
        });


        setPorcentajeAsignadoExterno(totalExterno);
        setPorcentajeAsignadoInterno(totalInterno);
    },[cuotapartista])



    useEffect(()=>{
        API.getCuotapartista(props.match.params.id).then((response)=>{
            setCuotapartista({...response.data.cuotapartista, oficialesExternos:response.data.cuotapartista.agentes_externos, oficialesInternos:response.data.cuotapartista.agentes_internos});
            setPorcentajeInterno(parseFloat(response.data.cuotapartista.agentes_internos_porcentaje));
            setPorcentajeExterno(parseFloat(response.data.cuotapartista.agentes_externos_porcentaje));
            setCuotapartistasAsociados(response.data.cuotapartista.cuotapartistas_asociados);
            setDistribucion(response.data.cuotapartista.distribuciones);

            var arrOficialesFiltro = [];

            (response?.data.cuotapartista?.agentes_externos ?? []).map((externo)=>{
                arrOficialesFiltro.push({label:externo.oficial.descripcion, value:externo.oficial.id, obj:externo.oficial});
            });

            (response?.data.cuotapartista?.agentes_internos ?? []).map((interno)=>{
                arrOficialesFiltro.push({label:interno.oficial.descripcion, value:interno.oficial.id, obj:interno.oficial});
            });

            setFiltroOficial(arrOficialesFiltro);

        })
    },[props.match.params.id]);



    const save = () => {
        //setErrores([]);
        setLoading(true);
        API.saveCuotapartista(cuotapartista).then((response)=>{
            setLoading(false);
            if(response.error){
                //setErrores(response.data);
            } else {
                toast.success("Cambios realizados!", { transition: Flip });
            }
        })
    }


    return (
        <div>
            <Row style={{marginTop:30}}>
                <Col md={10} style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'flex-start'}}>

                    {cuotapartista.id &&
                        <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>{cuotapartista?.descripcion?.toUpperCase()} | Nro  #{cuotapartista.numero_cuotapartista}</span>
                    }

                </Col>
                <Col md={2}>
                    <Button color="primary" size={'lg'}
                            onClick={()=>{setShow(!show)}}>
                        Guardar Cambios
                    </Button>
                </Col>
            </Row>

            <div>
                <Row  style={{marginTop:30}}>
                    <Col md={12}>
                        <Row>
                            <Col md={6}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col md={6}>
                                                <span style={{fontSize:24,color:COLORS.SECONDARY,fontWeight:'bold'}}>Agente Externo</span>
                                            </Col>
                                            <Col md={2}>
                                                <span style={{fontSize:17,color:COLORS.GRAY_LIGHT}}>Base</span>
                                            </Col>
                                            <Col md={4}>
                                                <Input
                                                    type="text"
                                                    placeholder="%"
                                                    style={{borderRadius:10, marginLeft:5, marginRight:5, width:80,textAlign:'right'}}
                                                    value={porcentajeExterno}
                                                    onChange={e => setPorcentajeExterno(e?.target?.value)}/>
                                            </Col>
                                        </Row>

                                        <Row style={{marginTop:15}}>
                                            <Col md={7}>
                                                <FormGroup>
                                                    <Label style={{fontWeight:'bold'}}>Oficial</Label>
                                                    <Select
                                                        className="React"
                                                        classNamePrefix="select"
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        options={oficialesExternos}
                                                        style={{marginTop:5}}
                                                        onChange={(e)=>{
                                                            setOficialExterno({...oficialExterno, oficial:e?.obj});
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <Label style={{fontWeight:'bold'}}>% Comision</Label>
                                                <CurrencyInput style={{textAlign:'right'}}
                                                               className="form-control"
                                                               precision={2}
                                                               decimalSeparator={','}
                                                               thousandSeparator={'.'}
                                                               value={parseFloat(oficialExterno?.porcentaje)}
                                                               onChange={(e,name) => {
                                                                   let porcentaje  = parseFloat(e.replaceAll('$','').replaceAll('.','').replaceAll(',','.')) ;
                                                                   setOficialExterno({...oficialExterno, porcentaje:porcentaje})
                                                               }}/>
                                            </Col>
                                            <Col md={2}>
                                                <br/>
                                                <Button color="primary" size={'sm'} disabled={!(oficialExterno?.oficial && oficialExterno?.porcentaje)}
                                                        onClick={()=>{
                                                            let arr = cuotapartista?.oficialesExternos ?? [];
                                                            arr.push(oficialExterno);
                                                            setCuotapartista({...cuotapartista, oficialesExternos:arr});
                                                        }}>
                                                    Agregar
                                                </Button>
                                            </Col>
                                        </Row>

                                        {porcentajeExterno!=0 && porcentajeAsignadoExterno!=100 &&
                                            <Alert color="danger">
                                                Por favor revise las asignaciones, las mismas no suman 100%
                                            </Alert>
                                        }

                                        {cuotapartista?.oficialesExternos?.length!=0 &&
                                            <Row style={{marginTop:10}}>
                                                <table className='table table-striped'>
                                                    {cuotapartista?.oficialesExternos?.map((e,i)=>(
                                                        <tr>
                                                            <td>{e?.oficial?.descripcion}</td>
                                                            <td>{NumberFormat(e?.porcentaje,2,",",".")}</td>
                                                            <td>
                                                                <Button.Ripple size='sm'  color="danger" outline={true} onClick={()=>{
                                                                    let arr = cuotapartista?.oficialesExternos;
                                                                    arr.splice(i,1);
                                                                    setCuotapartista({...cuotapartista, oficialesExternos:arr});
                                                                }}>
                                                                    <span style={{color:COLORS.ERROR}}>Eliminar</span>
                                                                </Button.Ripple>

                                                            </td>
                                                        </tr>
                                                    ))}
                                                </table>
                                            </Row>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                  
                            <Col md={6}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col md={6}>
                                                <span style={{fontSize:24,color:COLORS.SECONDARY,fontWeight:'bold'}}>Oficiales</span>
                                            </Col>
                                            <Col md={2}>
                                                <span style={{fontSize:17,color:COLORS.GRAY_LIGHT}}>Base</span>
                                            </Col>
                                            <Col md={4}>
                                                <Input
                                                    type="text"
                                                    placeholder="%"
                                                    style={{borderRadius:10, marginLeft:5, marginRight:5, width:80,textAlign:'right'}}
                                                    disabled={true}
                                                    value={porcentajeInterno}/>
                                            </Col>
                                        </Row>

                                        <Row style={{marginTop:15}}>
                                            <Col md={7}>
                                                <FormGroup>
                                                    <Label style={{fontWeight:'bold'}}>Oficial</Label>
                                                    <Select
                                                        className="React"
                                                        classNamePrefix="select"
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        options={oficialesInternos}
                                                        style={{marginTop:5}}
                                                        onChange={(e)=>{
                                                            setOficialInterno({...oficialInterno, oficial:e?.obj});
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <Label style={{fontWeight:'bold'}}>% Comision</Label>
                                                <CurrencyInput style={{textAlign:'right'}}
                                                               className="form-control"
                                                               precision={2}
                                                               decimalSeparator={','}
                                                               thousandSeparator={'.'}
                                                               value={parseFloat(oficialInterno?.porcentaje)}
                                                               onChange={(e,name) => {
                                                                   let porcentaje  = parseFloat(e.replaceAll('$','').replaceAll('.','').replaceAll(',','.')) ;
                                                                   setOficialInterno({...oficialInterno, porcentaje:porcentaje})
                                                               }}/>
                                            </Col>
                                            <Col md={2}>
                                                <br/>
                                                <Button color="primary" size={'sm'} disabled={!(oficialInterno?.oficial && oficialInterno?.porcentaje)}
                                                        onClick={()=>{
                                                            let arr = cuotapartista?.oficialesInternos ?? [];
                                                            arr.push(oficialInterno);
                                                            setCuotapartista({...cuotapartista, oficialesInternos:arr});
                                                        }}>
                                                    Agregar
                                                </Button>
                                            </Col>
                                        </Row>


                                        {cuotapartista?.oficialesInternos?.length!=0 &&
                                            <Row style={{marginTop:10}}>
                                                <table className='table table-striped'>
                                                    {cuotapartista?.oficialesInternos?.map((e,i)=>(
                                                        <tr>
                                                            <td>{e?.oficial?.descripcion}</td>
                                                            <td>{NumberFormat(e?.porcentaje,2,",",".")}</td>
                                                            <td>
                                                                <Button.Ripple size='sm'  color="danger" outline={true} onClick={()=>{
                                                                    let arr = cuotapartista?.oficialesInternos;
                                                                    arr.splice(i,1);
                                                                    setCuotapartista({...cuotapartista, oficialesInternos:arr});
                                                                }}>
                                                                    <span style={{color:COLORS.ERROR}}>Eliminar</span>
                                                                </Button.Ripple>

                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr style={{color:COLORS.SECONDARY}}>
                                                        <td>Restante</td>
                                                        <td>{NumberFormat(100 - porcentajeAsignadoInterno,2,",",".")}</td>
                                                        <td></td>
                                                    </tr>
                                                </table>
                                            </Row>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>


                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <Row style={{marginTop:30}}>
                                    <Col md={12}>
                                        <span style={{fontSize:24,color:COLORS.SECONDARY,fontWeight:'bold'}}>Fondos</span>
                                    </Col>
                                </Row>

                                <Row style={{marginTop:30}}>
                                    <Col md={12}>

                                        <Button color="primary" size={'sm'}
                                                onClick={()=>{
                                                    var arr = [];
                                                    var arrOficialesFiltro = [];

                                                    (cuotapartista?.oficialesExternos ?? []).map((externo)=>{
                                                        arrOficialesFiltro.push({label:externo.oficial.descripcion, value:externo.oficial.id, obj:externo.oficial});


                                                        fondos.map((fondo)=>{
                                                            arr.push({
                                                                fondo:fondo,
                                                                oficial:externo.oficial,
                                                                base_calculo:porcentajeExterno,
                                                                //porcentaje:externo.porcentaje,
                                                                porcentaje:0,
                                                                modificado:false,
                                                            })
                                                        })
                                                    });

                                                    (cuotapartista?.oficialesInternos ?? []).map((interno)=>{
                                                        arrOficialesFiltro.push({label:interno.oficial.descripcion, value:interno.oficial.id, obj:interno.oficial});


                                                        fondos.map((fondo)=>{
                                                            arr.push({
                                                                fondo:fondo,
                                                                oficial:interno.oficial,
                                                                base_calculo:porcentajeInterno,
                                                                //porcentaje:interno.porcentaje,
                                                                porcentaje:0,
                                                                modificado:false,
                                                            })
                                                        })
                                                    });


                                                    setFiltroOficial(arrOficialesFiltro);
                                                    setDistribucion(arr);

                                                }}>
                                            Actualizar
                                        </Button>

                                    </Col>
                                </Row>

                                <Row style={{marginTop:30}}>
                                    <Col md={12}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Select
                                                        className="React"
                                                        classNamePrefix="select"
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        options={filtroOficial}
                                                        style={{marginTop:5}}
                                                        onChange={(e)=>{
                                                            setFiltros({...filtros,oficial:e?.obj})
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Select
                                                        className="React"
                                                        classNamePrefix="select"
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        options={filtroFondo}
                                                        style={{marginTop:5}}
                                                        onChange={(e)=>{
                                                            setFiltros({...filtros,fondo:e?.obj})
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>


                                        <table className='table table-striped'>
                                            <tr  className="bg-primary text-white">
                                                <td>Fondo</td>
                                                <td>Oficial</td>
                                                <td>Base</td>
                                                <td>%</td>
                                            </tr>
                                            {distribucion.map((e,i)=>(
                                                <tr className={(filtros?.fondo?.id && filtros?.fondo?.id!=e?.fondo?.id) || (filtros?.oficial?.id && filtros?.oficial?.id!=e?.oficial?.id) ? 'd-none' : ''}
                                                    >
                                                    <td>{e?.fondo?.descripcion}</td>
                                                    <td>{e?.oficial?.descripcion}</td>
                                                    <td style={{textAlign:'right'}}>
                                                        {NumberFormat( e.base_calculo,2,",",".")}
                                                    </td>
                                                    <td>
                                                        <CurrencyInput style={{textAlign:'right'}}
                                                                       className="form-control"
                                                                       precision={2}
                                                                       decimalSeparator={','}
                                                                       thousandSeparator={'.'}
                                                                       value={parseFloat(e?.porcentaje)}
                                                                       onChange={(v) => {
                                                                           let porcentaje  = parseFloat(v.replaceAll('$','').replaceAll('.','').replaceAll(',','.')) ;
                                                                           let arr = distribucion;
                                                                           arr.map((element,i)=>{
                                                                               if(e?.fondo?.id==element?.fondo?.id && e?.oficial?.id==element?.oficial?.id){
                                                                                   element.porcentaje = porcentaje;
                                                                                   element.modificado = true;
                                                                               }
                                                                           })
                                                                           setDistribucion(arr);


                                                                       }}/>

                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </div>



            <Modal
                isOpen={show}
                toggle={()=>{setShow(!show)}}
                className="modal-dialog-centered modal-lg">
                <ModalHeader className={'bg-primary text-white'}>
                    <span style={{fontSize:20,color:COLORS.WHITE}}>
                        Aplicar a Todos
                    </span>
                </ModalHeader>
                <ModalBody>

                    <Row>
                        <Col md={9}>
                            <FormGroup>
                                <Select
                                    className="React"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    isClearable={true}
                                    options={cuotapartistas}
                                    style={{marginTop:5}}
                                    onChange={(e)=>{
                                        setCuotapartistaAsociado(e?.obj);
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <Button color="primary" size={'sm'}
                                    onClick={()=>{
                                        setCuotapartistasAsociados([...cuotapartistasAsociados,cuotapartistaAsociado]);
                                    }}>
                                Agregar
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <p style={{color:COLORS.SECONDARY}}>
                                Los cambios se aplicaran a los siguientes cuotapartistas
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <table className={'table table-stripped'}>
                                <tr>
                                    <td># {cuotapartista?.numero_cuotapartista}</td>
                                    <td>{cuotapartista?.descripcion}</td>
                                    <td>
                                    </td>
                                </tr>

                                {cuotapartistasAsociados.map((e,i)=>(
                                    <tr>
                                        <td># {e.numero_cuotapartista}</td>
                                        <td>{e.descripcion}</td>
                                        <td>
                                            <Button.Ripple size='sm'  color="danger" outline={true} onClick={()=>{
                                                let arr = cuotapartistasAsociados;
                                                arr.splice(i,1);
                                                setCuotapartistasAsociados(arr);
                                            }}>
                                                <span style={{color:COLORS.ERROR}}>Eliminar</span>
                                            </Button.Ripple>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </Col>
                    </Row>


                    <Row>
                        <Col md={12}>
                            <Button.Ripple size='md'  color="primary" outline={true} onClick={()=>{
                                toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});
                                API.saveCuotapartista({
                                    ...cuotapartista,
                                    asociaciones:cuotapartistasAsociados,
                                    porcentaje_agentes_externos:porcentajeExterno,
                                    porcentaje_agentes_internos:porcentajeInterno,
                                    distribucion:distribucion
                                }).then((response)=>{
                                    toast.dismiss();
                                    toast.success("Listo!", { transition: Flip});
                                    setShow(false);
                                })
                            }}>
                                <span style={{color:COLORS.SECONDARY}}>Guardar</span>
                            </Button.Ripple>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>







        </div>
    )
}

export default Index
