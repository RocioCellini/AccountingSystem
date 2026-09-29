import React from "react"
import {COLORS} from "../../../utility/utils";
import API from './../../../api';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Row,
    Col,
    FormGroup, Label
} from "reactstrap";
import Select from "react-select"
import {NumberFormat} from "../../../helpers/numberFormat";
import {toast, Zoom} from "react-toastify";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import "flatpickr/dist/themes/light.css";

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            empleados:[],
            empleado:[],
            comparaciones:[],
        }
    }


    componentDidMount() {

        API.getEmpleados(true).then((response)=>{
            this.setState({
                empleados:response.data.empleados.map((e, i) => ({ label: e.nombre_apellido, value: e.id, obj:e }))
            });
        })
    }


    render(){
        return (
            <div>
                <Row>
                    <Col md={12}>


                        <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>Comparar Empleados</span>

                        <Row style={{marginTop:30,marginBottom:30}}>
                            <Col md={4}>
                                <FormGroup>
                                    <Label style={{fontWeight:'bold'}}>Empleado:</Label>
                                    <Select
                                        className="React"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        isClearable={true}
                                        options={this.state.empleados}
                                        style={{marginTop:5}}
                                        onChange={(e)=>{
                                            this.setState({empleado:e?.obj});
                                        }}
                                    />

                                </FormGroup>
                            </Col>

                            <Col md={4}>
                                <br/>
                                <Button color="primary" outline={false}  onClick={()=>{
                                    this.setState({comparaciones:[...this.state.comparaciones,this.state.empleado]});
                                }}>
                                    Agregar
                                </Button>
                            </Col>

                        </Row>

                        <Card style={{marginTop:30}}>
                            <CardBody>
                                {(this.state.comparaciones.length >= 2) &&
                                    <Col md={4}>
                                        <br/>
                                        <Button color="success" outline={true}  onClick={()=>{
                                            API.downloadComparativo({empleados:this.state.comparaciones}).then((response)=>{
                                                if(response.status){
                                                    var link = document.createElement("a");
                                                    link.download = "Comparativo.xls";
                                                    link.href=response.data.ruta;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);

                                                    toast.success("Listo!", { transition: Zoom });
                                                } else {
                                                    toast.error(response.error, { transition: Zoom });
                                                }
                                            })
                                        }}>
                                            Exportar XLS
                                        </Button>
                                    </Col>
                                }



                            </CardBody>
                        </Card>

                        <Row>
                            {this.state.comparaciones.map((e,i)=>{

                                return (
                                    <Col md={4}>
                                        <Card>
                                            <CardHeader style={{backgroundColor:COLORS.SECONDARY, color:COLORS.WHITE,flex:1, display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                <h2 style={{color:COLORS.WHITE}}>{e.nombre_apellido}</h2>
                                            </CardHeader>
                                            <CardBody>
                                                <table>
                                                    <tr>
                                                        <td><strong>Legajo</strong></td>
                                                        <td style={{textAlign:'right'}}>{e.legajo_bejerman}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Nombre</strong></td>
                                                        <td style={{textAlign:'right'}}>{e.nombre_apellido}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Empresa</strong></td>
                                                        <td style={{textAlign:'right'}}>{e.empresa?.descripcion}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Sector</strong></td>
                                                        <td style={{textAlign:'right'}}>{e.sector?.descripcion}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Sueldo Bruto</strong></td>
                                                        <td style={{textAlign:'right'}}>{NumberFormat(e.ultimo_sueldo,0,",",".")}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Plan osde</strong></td>
                                                        <td style={{textAlign:'right'}}>{e.plan_osde}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Sueldos Bono</strong></td>
                                                        <td style={{textAlign:'right'}}>{NumberFormat(e.bono_semestral,0,",",".")}</td>
                                                    </tr>
                                                </table>


                                                <div style={{marginTop:30}}>
                                                    <Button color="danger" outline={true}  onClick={()=>{
                                                        let comparaciones = this.state.comparaciones;
                                                        let arr = [];
                                                        comparaciones.map((x,y)=>{
                                                            if(e.id!=x.id){
                                                                arr.push(x);
                                                            }
                                                        })
                                                        this.setState({comparaciones:arr});
                                                    }}>
                                                        Quitar
                                                    </Button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            })}

                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}


