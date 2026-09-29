import  {Col,Badge, Button, Card, CardBody, CardTitle, Row} from "reactstrap";
import {COLORS, NumberFormat} from "../../../utility/utils";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    faArrowAltCircleDown,
    faArrowAltCircleUp, faArrowCircleDown, faArrowCircleUp,
    faArrowDown,
    faArrowRight,
    faArrowUp
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import API from "../../../api";

const ProffitLoss = (props)=>{
    const [posicionInstrumento, setPosicionInstrumento] = useState([]);
    const [posicionMoneda, setPosicionMoneda] = useState([]);
    const [posicion, setPosicion] = useState([]);


    useEffect(()=>{
        getPosicion();


    },[props])


    const getPosicion = ()=>{
        API.getPosicion().then((response)=>{
            setPosicionInstrumento(response.data.posicion.posiciones_instrumentos);
            setPosicionMoneda(response.data.posicion.posiciones_monedas);
            setPosicion(response.data.posicion);
            getPosicion();
        });
    }

    return (
        <Row>
            <Col md={8}>
                <Card style={{padding:20,borderStyle:'solid',borderWidth:1, minHeight:'100%'}}>
                    <CardBody style={{flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <Row>
                            <strong style={{fontSize:12, color:COLORS.SUCCESS}}>My Assets ({posicion.updated_at_formatted})</strong>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'center', fontWeight:'bold'}}>Asset</span>
                            </Col>
                            <Col md={2}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'center', fontWeight:'bold'}}>Qty</span>
                            </Col>
                            <Col md={2}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'center', fontWeight:'bold'}}>Last</span>
                            </Col>
                            <Col md={2}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'center', fontWeight:'bold'}}>Share</span>
                            </Col>
                            <Col md={3}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'center', fontWeight:'bold'}}>Var</span>
                            </Col>
                        </Row>
                        {posicionInstrumento.map((e,i)=>{
                            let variacion = ((e.precio_actual / e.precio_apertura)-1)*100;
                            let total = 0;
                            let x = 0;
                            for(x;x<posicionInstrumento.length;x++){
                                total += parseFloat( Math.abs(posicionInstrumento[x].cantidad)  * posicionInstrumento[x].precio_actual)
                            }
                            let share = ((Math.abs(e.cantidad) * e.precio_actual) / total) * 100;
                            return (
                                <Row>
                                    <Col md={2}>
                                        <span style={{fontSize:'80%',}}>{e.instrumento.abreviatura}</span>
                                    </Col>
                                    <Col md={2}>
                                        <span style={{fontSize:'80%', width:'100%', display:'inline-block', textAlign:'right', color: (e.cantidad<0) ? COLORS.ERROR : COLORS.SUCCESS}}>{NumberFormat(e.cantidad,0,",",".")}</span>
                                    </Col>
                                    <Col md={3}>
                                        <span style={{fontSize:'80%',width:'100%', display:'inline-block', textAlign:'right'}}>{NumberFormat(e.precio_actual,4,",",".")}</span>
                                    </Col>
                                    <Col md={2}>
                                        <span style={{fontSize:'80%',width:'100%', display:'inline-block', textAlign:'right'}}>({NumberFormat(share,2,",",".")}%)</span>
                                    </Col>
                                    <Col md={3}>
                                         <span style={{width:'100%', display:'inline-block', textAlign:'right'}}>
                                            <span style={{fontSize:'80%', color:((variacion>0 && e.cantidad>0) || (variacion<0 && e.cantidad<0)) ? COLORS.SUCCESS : COLORS.ERROR}}>{NumberFormat(variacion,2,",",".")} %</span>
                                            <FontAwesomeIcon  icon={(variacion>0) ? faArrowCircleUp : faArrowCircleDown}  color={((variacion>0 && e.cantidad>0) || (variacion<0 && e.cantidad<0)) ? COLORS.SUCCESS : COLORS.ERROR} style={{marginRight:10}} />
                                        </span>
                                    </Col>
                                </Row>
                            );
                        })}

                    </CardBody>
                </Card>
            </Col>

            <Col md={4}>
                <Card style={{padding:20,borderStyle:'solid',borderWidth:1, minHeight:'100%'}}>
                    <CardBody style={{flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <Row>
                            <strong style={{fontSize:12, color:COLORS.SUCCESS}}>My Balance ({posicion.updated_at_formatted})</strong>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'left'}}>Cash</span>
                            </Col>
                            <Col md={6}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'right'}}>{NumberFormat(posicionMoneda[0]?.dinero_efectivo,2,",",".")}</span>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'left'}}>Available</span>
                            </Col>
                            <Col md={6}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'right'}}>{NumberFormat(posicionMoneda[0]?.saldo_disponible,2,",",".")}</span>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'left'}}>Current Value</span>
                            </Col>
                            <Col md={6}>
                                <span style={{width:'100%', display:'inline-block', textAlign:'right'}}>{NumberFormat(posicionMoneda[0]?.valor_cuenta,2,",",".")}</span>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </Col>

        </Row>
    );
}


export default ProffitLoss;
