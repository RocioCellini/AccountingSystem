import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {COLORS} from "../../../utility/utils";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import React, {useEffect, useState} from "react";
import API from "../../../api";
import {NumberFormat} from "../../../helpers/numberFormat";

const Oficiales = (props) =>{


    const [oficiales, setOficiales] = useState([]);
    const [user, setUser] = useState([]);
    const [porcentaje, setPorcentaje] = useState(0);
    const [catalogoOficial, setCatalogoOficial] = useState([]);
    const [catalogoOficiales, setCatalogoOficiales] = useState([]);


    useEffect(()=>{
        setOficiales(props.oficiales);

    },[props]);

    useEffect(()=>{

        API.getInfo().then((response)=>{
            setUser(response.data);
        })

        API.getOficiales().then((response)=>{
            setCatalogoOficiales(response.data.oficiales.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e })));
        })

    },[]);


    return (
        <Card>
            <CardBody>
                <Row style={{marginBottom:20}}>
                    <Col md={12}>
                        <h1 style={{color:COLORS.SECONDARY}}>Oficiales a Distribuir</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={7}>
                        <FormGroup>
                            <Label style={{fontWeight:'bold'}}>Oficiales</Label>
                            <Select
                                className="React"
                                classNamePrefix="select"
                                isSearchable={true}
                                isClearable={true}
                                options={catalogoOficiales}
                                style={{marginTop:5}}
                                onChange={(e)=>{
                                    setCatalogoOficial(e.obj);
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <Label style={{fontWeight:'bold'}}>Base de Calculo</Label>
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
                        <Button color="success" disabled={!(catalogoOficial?.id  && porcentaje>=0 )}
                                onClick={()=>{props.attachOficial({
                                    fondo_id:props.fondo.id,
                                    oficial_id:catalogoOficial.id,
                                    porcentaje:porcentaje
                                })}}>
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
                                    Oficial
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

                {oficiales?.map((e,i)=>{
                    return (
                        <Row style={{marginTop:20}}>
                            <Col md={2}>
                                <span style={{color:COLORS.BLACK}}>
                                    {e.id}
                                </span>
                            </Col>

                            <Col md={6}>
                                <span style={{color:COLORS.BLACK}}>
                                    {e?.oficial?.descripcion}
                                </span>
                            </Col>

                            <Col md={2}>
                                <span style={{color:COLORS.BLACK}}>
                                    {NumberFormat(e?.porcentaje ?? 0,2,",",".")}
                                </span>
                            </Col>


                            <Col md={2}>
                                <Button color="danger"
                                        onClick={()=>{props.dettachOficial({
                                            fondo_id:props.fondo.id,
                                            oficial_id:e.oficial.id,
                                            porcentaje:porcentaje
                                        })}}>

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

export default Oficiales;