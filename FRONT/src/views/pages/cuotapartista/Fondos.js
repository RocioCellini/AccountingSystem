import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {COLORS} from "../../../utility/utils";
import Select from "react-select";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input";
import React, {useEffect, useState} from "react";
import API from "../../../api";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import {Flip, toast, Zoom} from "react-toastify";
import {NumberFormat} from "../../../helpers/numberFormat";

const Fondos = (props) =>{

    const [loading, setLoading] = useState(false);
    const [fondos, setFondos] = useState([]);
    const [catalogoFondos, setCatalogoFondos] = useState([]);
    const [fondo, setFondo] = useState([]);
    const [porcentaje, setPorcentaje] = useState(0);

    useEffect(()=>{
        setFondos(props.fondos);

    },[props]);

    useEffect(()=>{
        API.getFondos().then((response)=>{
            setCatalogoFondos(response.data.fondos.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        })
    },[]);


    return (
        <Card>
            <CardBody>
                <Row style={{marginBottom:20}}>
                    <Col md={12}>
                        <h1 style={{color:COLORS.SECONDARY}}>Excepciones</h1>
                    </Col>
                </Row>
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
                                    setFondo(e.obj);
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
                                           let valor  =e.replaceAll('$','').replaceAll('.','').replaceAll(',','.');
                                           setPorcentaje(valor);
                                       }}/>
                    </Col>
                    <Col md={2}>
                        <br/>
                        <Button color="success" disabled={!(fondo?.id && porcentaje>-0.01)} onClick={()=>{props.attachFondo(fondo.id,porcentaje)}}>
                            Agregar
                        </Button>
                    </Col>
                </Row>


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
                                    Porcentaje
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
                                <Button color="danger" onClick={()=>{props.dettachFondo(e?.fondo?.id)}}>
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

export default Fondos;