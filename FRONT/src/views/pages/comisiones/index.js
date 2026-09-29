import React from "react"
import {COLORS} from "../../../utility/utils";
import API from './../../../api';
import {
    Button,
    Input,
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap";
import {Link} from "react-router-dom";
import {NumberFormat} from "../../../helpers/numberFormat";
import CurrencyInput from "react-currency-input";
import {toast, Zoom} from "react-toastify";
import Flatpickr from "react-flatpickr";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import "flatpickr/dist/themes/light.css";

export default class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            empleados:[],
            empleadosFull:[],
        }

        this.buscador = this.buscador.bind(this);
    }


    componentDidMount() {
        API.getConfiguraciones().then((response)=>{
            let fecha = new Date(response.data.fecha_cierre);
            fecha = new Date(fecha.setDate(fecha.getDate() + 2));
            let ano = fecha.getFullYear().toString();
            let mes = (fecha.getMonth() + 1).toString();
            mes = (mes.length==1) ? '0' + mes : mes;

            API.getComisiones(ano + mes).then((response)=>{
                this.setState({
                    fecha:fecha,
                    periodo:ano+mes,
                    empleados:response.data.empleados,
                    empleadosFull:response.data.empleados
                });
            })
        })









    }

    buscador(valor){

        if(valor==''){
            this.setState({
                empleados:this.state.empleadosFull
            })
        } else {
            let response = [];
            this.state.empleadosFull.map((e,i)=>{
                if(e.nombre_apellido.toUpperCase().includes(valor.toUpperCase())){
                    response.push(e);
                }
            });

            this.setState({
                empleados:response
            })
        }
    }

    render(){
        return (

            <div>

                <Row style={{marginTop:30,marginBottom:30}}>
                    <Col md={4}>
                        <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>Comisiones del periodo</span>
                    </Col>

                    <Col md={4}>
                        <label style={{fontWeight:'bold', color:COLORS.SECONDARY}}> Seleccionar Periodo</label>
                        <Flatpickr
                            className="form-control"
                            value={this.state.fecha}
                            onChange={date => {
                                this.setState({fecha:date});

                                let fechaP = new Date(date);
                                let ano = fechaP.getFullYear().toString();
                                let mes = (fechaP.getMonth() + 1).toString();
                                mes = (mes.length==1) ? '0' + mes : mes;


                                this.setState({periodo:ano + mes});
                                API.getComisiones(ano + mes).then((response)=>{
                                    this.setState({empleados:response.data.empleados
                                    });
                                })


                            }}
                        />
                    </Col>

                    <Col md={4}>
                        <Input
                            type="text"
                            placeholder="Buscador"
                            style={{width:300, marginTop:20}}
                            onChange={e => this.buscador(e.target.value)}/>
                    </Col>
                </Row>

                <Card  style={{marginTop:30}}>
                    <CardBody>
                        <div>

                            <table className=" table table-stripped">
                                <tr className="bg-primary text-white">
                                    <td># Bejerman</td>
                                    <td>Nombre</td>
                                    <td>Fondos</td>
                                    <td>Capital markets</td>
                                    <td>Rofex</td>
                                    <td>Cibsa</td>
                                    <td>Otros</td>
                                </tr>
                                {this.state.empleados.map((e,i)=> {
                                    if (e.es_comercial) {
                                        return (
                                            <tr>
                                                <td>
                                                    <span style={{fontSize:12}}>{e.legajo_bejerman}</span>
                                                </td>
                                                <td>
                                                    <Link to={"/empleados/getone/"+  e.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                                                    <span>
                                                        {e.nombre_apellido.toUpperCase()}
                                                    </span>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <CurrencyInput className="form-control"
                                                                   precision={0}
                                                                   style={{textAlign:'right', backgroundColor: (e?.comision?.estado?.codigo=="APR") ? COLORS.SUCCESS_LIGHT : (e?.comision?.estado?.codigo=="REC") ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                                                   selectAllOnFocus={true}
                                                                   decimalSeparator={','}
                                                                   thousandSeparator={'.'}
                                                                   value={NumberFormat(e?.comision?.fondos,2,",",".")}
                                                                   onChange={value => {
                                                                       let temp = this.state.empleados;
                                                                       temp[i] ={
                                                                           ...e,
                                                                           comision : {
                                                                               ...e.comision,
                                                                               fondos:value.replaceAll("$","").replaceAll(".","").replaceAll(",",""),
                                                                           }
                                                                       };
                                                                       this.setState({empleados:temp });
                                                                   }}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyInput className="form-control"
                                                                   precision={0}
                                                                   style={{textAlign:'right', backgroundColor: (e?.comision?.estado?.codigo=="APR") ? COLORS.SUCCESS_LIGHT : (e?.comision?.estado?.codigo=="REC") ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                                                   selectAllOnFocus={true}
                                                                   decimalSeparator={','}
                                                                   thousandSeparator={'.'}
                                                                   value={NumberFormat(e?.comision?.capital_markets,2,",",".")}
                                                                   onChange={value => {
                                                                       let temp = this.state.empleados;
                                                                       temp[i] ={
                                                                           ...e,
                                                                           comision : {
                                                                               ...e.comision,
                                                                               capital_markets:value.replaceAll("$","").replaceAll(".","").replaceAll(",",""),
                                                                           }
                                                                       };
                                                                       this.setState({empleados:temp });
                                                                   }}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyInput className="form-control"
                                                                   precision={0}
                                                                   style={{textAlign:'right', backgroundColor: (e?.comision?.estado?.codigo=="APR") ? COLORS.SUCCESS_LIGHT : (e?.comision?.estado?.codigo=="REC") ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                                                   selectAllOnFocus={true}
                                                                   decimalSeparator={','}
                                                                   thousandSeparator={'.'}
                                                                   value={NumberFormat(e?.comision?.rofex,2,",",".")}
                                                                   onChange={value => {
                                                                       let temp = this.state.empleados;
                                                                       temp[i] ={
                                                                           ...e,
                                                                           comision : {
                                                                               ...e.comision,
                                                                               rofex:value.replaceAll("$","").replaceAll(".","").replaceAll(",",""),
                                                                           }
                                                                       };
                                                                       this.setState({empleados:temp });
                                                                   }}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyInput className="form-control"
                                                                   precision={0}
                                                                   style={{textAlign:'right', backgroundColor: (e?.comision?.estado?.codigo=="APR") ? COLORS.SUCCESS_LIGHT : (e?.comision?.estado?.codigo=="REC") ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                                                   selectAllOnFocus={true}
                                                                   decimalSeparator={','}
                                                                   thousandSeparator={'.'}
                                                                   value={NumberFormat(e?.comision?.cibsa,2,",",".")}
                                                                   onChange={value => {
                                                                       let temp = this.state.empleados;
                                                                       temp[i] ={
                                                                           ...e,
                                                                           comision : {
                                                                               ...e.comision,
                                                                               cibsa:value.replaceAll("$","").replaceAll(".","").replaceAll(",",""),
                                                                           }
                                                                       };
                                                                       this.setState({empleados:temp });
                                                                   }}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyInput className="form-control"
                                                                   precision={0}
                                                                   style={{textAlign:'right', backgroundColor: (e?.comision?.estado?.codigo=="APR") ? COLORS.SUCCESS_LIGHT : (e?.comision?.estado?.codigo=="REC") ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                                                   selectAllOnFocus={true}
                                                                   decimalSeparator={','}
                                                                   thousandSeparator={'.'}
                                                                   value={NumberFormat(e?.comision?.otros,2,",",".")}
                                                                   onChange={value => {
                                                                       let temp = this.state.empleados;
                                                                       temp[i] ={
                                                                           ...e,
                                                                           comision : {
                                                                               ...e.comision,
                                                                               otros:value.replaceAll("$","").replaceAll(".","").replaceAll(",",""),
                                                                           }
                                                                       };
                                                                       this.setState({empleados:temp });
                                                                   }}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                })}
                            </table>

                        </div>

                        <div style={{marginTop:20}}>
                            <Button color="primary"  onClick={()=>{
                                API.saveComisiones({
                                    periodo:this.state.periodo,
                                    comisiones:this.state.empleados,
                                }).then((response)=>{
                                    if(response?.error){
                                        toast.error("El Periodo se encuentra cerrado!", { transition: Zoom });
                                    } else {
                                        this.setState({empleados:response.data.empleados});
                                        toast.success("Se guardaron las comisiones!", { transition: Zoom });
                                    }

                                })

                            }}>
                                Guardar
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }
}


