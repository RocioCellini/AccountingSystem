import {Button, Card, CardBody, Col, FormGroup, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt, faDollarSign} from "@fortawesome/free-solid-svg-icons";
import {COLORS} from "../../utility/utils";
import Flatpickr from "react-flatpickr";
import API from "../../api";
import {toast, Zoom} from "react-toastify";
import React, {useEffect, useState} from "react";
import CurrencyInput from "react-currency-input";
import {NumberFormat} from "../../helpers/numberFormat";


const CalendarioBonoSemestral = (props) => {

    const [data, setData] = useState([]);

    useEffect(()=>{
        API.getCalendarioBonos().then((response)=>{
            setData(response.data);
        })
    },[])

    const  handleData = (index, porcentaje_sueldos) =>{
        let temp = data;
        temp.map((e,i)=>{
            if(i==index){
                temp[i] = {
                    ...e,
                    porcentaje_sueldos:porcentaje_sueldos
                }
            }
        });
        setData(temp);
    }

    return (
        <Card>
            <CardBody>
                <div style={{height:60}}>
                    <FontAwesomeIcon icon={faDollarSign} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                </div>

                <h3 style={{color:COLORS.SECONDARY}}>Calendario Bonos</h3>

                <div style={{height:100}}>
                    <p style={{marginTop:20}}>
                        % de sueldos de Bono para sugerencia
                    </p>
                </div>

                {data.map((e,i)=>{
                    return (
                        <Row key={i} style={{marginTop:5}}>
                            <Col md={3}>
                                <span>{e.mes}</span>
                            </Col>
                            <Col md={3}>
                                <CurrencyInput style={{textAlign:'right'}}
                                               className="form-control"
                                               precision={2}
                                               selectAllOnFocus={true}
                                               decimalSeparator={','}
                                               thousandSeparator={'.'}
                                               value={NumberFormat(e.porcentaje_sueldos,2,",",".")}
                                               onChange={e => handleData(i, e.replaceAll('$','').replaceAll('.','').replaceAll(',','.')) }
                                />
                            </Col>
                        </Row>
                    )
                })}



                <br/>
                <Button color="primary"  onClick={()=>{
                    API.saveCalendarioBonos({data : data}).then((response)=>{
                        if(response.status){
                            toast.success("Se guardo la configuracion!", { transition: Zoom });}
                    })
                }}>
                    Guardar
                </Button>
            </CardBody>
        </Card>
    );

}

export default CalendarioBonoSemestral;