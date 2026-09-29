import {Button, Card, CardBody, Col, FormGroup, Label, Row} from "reactstrap";
import {COLORS} from "../../../utility/utils";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import React, {useEffect, useState} from "react";
import API from "../../../api";
import {NumberFormat} from "../../../helpers/numberFormat";

const Fondo = (props) =>{

    const [fondos, setFondos] = useState([]);
    const [user, setUser] = useState([]);
    const [porcentaje, setPorcentaje] = useState(0);
    const [catalogoFondo, setCatalogoFondo] = useState([]);
    const [catalogoFondos, setCatalogoFondos] = useState([]);


    useEffect(()=>{
        setFondos(props.fondos);

    },[props]);

    useEffect(()=>{

        API.getInfo().then((response)=>{
            setUser(response.data);
        })

        API.getFondos().then((response)=>{
            setCatalogoFondos(response.data.fondos.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        })

    },[]);


    return (
        <Card>
            <CardBody>
                <Row style={{marginBottom:20}}>
                    <Col md={12}>
                        <h1 style={{color:COLORS.SECONDARY}}>Excepciones del Empleado por Fondo</h1>
                    </Col>
                </Row>
                {(user?.rol?.codigo=="RRHH" || user?.rol?.codigo=="SU" || user?.rol?.codigo=="GTEF") &&
                <Row>
                    <Col md={7}>
                        <FormGroup>
                            <Label style={{fontWeight:'bold'}}>Fondo</Label>
                            <Select
                                className="React"
                                classNamePrefix="select"
                                isSearchable={true}
                                isClearable={true}
                                options={catalogoFondos}
                                style={{marginTop:5}}
                                onChange={(e)=>{
                                    setCatalogoFondo(e.obj);
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <Label style={{fontWeight:'bold'}}>Porcentaje</Label>
                        <CurrencyInput style={{textAlign:'right'}}
                                       className="form-control"
                                       precision={2}
                                       decimalSeparator={','}
                                       thousandSeparator={'.'}
                                       value={parseFloat(porcentaje)}
                                       onChange={(e,name) => {
                                           let porcentaje  =e.replaceAll('$','').replaceAll('.','').replaceAll(',','.');
                                           setPorcentaje(porcentaje);
                                       }}/>
                    </Col>
                    <Col md={2}>
                        <br/>
                        <Button color="success" disabled={!(catalogoFondo?.id  && porcentaje>=0 )}  onClick={()=>{props.attachFondo(catalogoFondo.id,porcentaje)}}>
                            Agregar
                        </Button>
                    </Col>
                </Row>
                }

                <Row style={{backgroundColor:COLORS.SECONDARY,marginTop:30}}>
                    <Col md={2}>
                                <span style={{color:COLORS.WHITE}}>
                                    # Id
                                </span>
                    </Col>

                    <Col md={6}>
                                <span style={{color:COLORS.WHITE}}>
                                    Fondo
                                </span>
                    </Col>


                    <Col md={2}>
                                <span style={{color:COLORS.WHITE}}>
                                    % Comision
                                </span>
                    </Col>



                    <Col md={2}>

                    </Col>
                </Row>

                {fondos.map((e,i)=>{
                    return (
                        <Row style={{marginTop:20}}>
                            <Col md={2}>
                                <span style={{color:COLORS.BLACK}}>
                                    {e.id}
                                </span>
                            </Col>

                            <Col md={6}>
                                <span style={{color:COLORS.BLACK}}>
                                    {e?.fondo?.descripcion}
                                </span>
                            </Col>

                            <Col md={2}>
                                <span style={{color:COLORS.BLACK}}>
                                    {NumberFormat(e?.porcentaje ?? 0,2,",",".")}
                                </span>
                            </Col>


                            <Col md={2}>
                                <Button color="danger"  onClick={()=>{props.dettachFondo(catalogoFondo.id,porcentaje)}} >
                                    Borrar
                                </Button>
                            </Col>
                        </Row>
                    );
                })}
            </CardBody>
        </Card>
    );
}

export default Fondo;