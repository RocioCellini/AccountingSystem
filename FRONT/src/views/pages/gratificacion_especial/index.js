import React from "react"
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

} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faSave
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {NumberFormat} from "../../../helpers/numberFormat";
import CurrencyInput from "react-currency-input";
import {Flip, toast, Zoom} from "react-toastify";

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            data:[],
            dataFull:[],
            user:[],
            roles:[],
            columns:[],
            totalReal:0,
        }

        this.handleBono = this.handleBono.bind(this);
        this.buscador = this.buscador.bind(this);
    }

    componentDidMount(){

        this.setState({columns:[
                {name:"Leg.",selector:"legajo_bejerman", width:'10%'},
                {name:"Nombre Apellido",width:'40%',wrap: true,cell:(row)=>(
                        <Link to={"/empleados/getone/"+  row.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                            <span>
                                {row.nombre_apellido.toUpperCase()}
                            </span>
                        </Link>
                    )},
                {name:"Sueldo", width:'25%',cell :(row) => (<span style={{width:'100%', textAlignment:'right'}}>{NumberFormat(row.sueldo_bruto,0,",",".")}</span>)},
                {name:"Gratificacion", width:'25%',cell :(row) => (
                        <CurrencyInput style={{textAlign:'right', backgroundColor:row?.gratificacion_especial_estado?.codigo=="APR" ? COLORS.SUCCESS_LIGHT : row?.gratificacion_especial_estado?.codigo=="REC" ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                       className="form-control"
                                       precision={0}
                                       prefix={'$'}
                                       selectAllOnFocus={true}
                                       decimalSeparator={','}
                                       thousandSeparator={'.'}
                                       value={parseInt(row.gratificacion_especial_importe)}
                                       onChange={e => this.handleBono(row.id, e.replaceAll('$','').replaceAll('.','').replaceAll(',','.'))}
                        />
                    )}
            ]});

        API.getGratificacionesEspeciales().then((response)=> {
            let totalReal = 0;
            for (let i = 0; i < response.data.empleados.length; i++) {
                totalReal += parseFloat(response.data.empleados[i].gratificacion_especial_importe);
            }




            this.setState({
                fecha:response.data.fecha,
                periodo:response.data.periodo,
                bonos:response.data.bonos,
                data:response.data.empleados,
                dataFull:response.data.empleados,
                totalReal:totalReal,
            });

        });

        API.getInfo().then((response)=>{
            this.setState({user:response.data});
        });
    }

    buscador(valor){

        if(valor==''){
            this.setState({
                data:this.state.dataFull
            })
        } else {
            let response = [];
            this.state.dataFull.map((e,i)=>{
                if(e.nombre_apellido.toUpperCase().includes(valor.toUpperCase())){
                    response.push(e);
                }
            });

            this.setState({
                data:response
            })
        }
    }

    handleBono(id, importe){
        let oldData = this.state.data;
        let index = oldData.findIndex((e) => e.id === id)
        oldData[index].gratificacion_especial_importe = importe;

        let totalReal = 0;
        for(let i=0; i<oldData.length; i++){
            totalReal += parseFloat(oldData[i].gratificacion_especial_importe);
        }

        this.setState({data:oldData, totalReal:totalReal});
    }



    render(){
        return (
            <div>
                <Row style={{marginTop:30}}>
                    <Col md={12} style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'flex-start'}}>

                        <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>Gratificaciones Especiales</span>


                        <Input
                            type="text"
                            placeholder="Buscador"
                            style={{width:300, borderRadius:10, marginLeft:30, marginRight:30}}
                            onChange={e => this.buscador(e.target.value)}/>


                        <Button.Ripple size='sm' outline={false} color="success" onClick={()=>{
                            API.saveGratificacionesEspeciales({
                                fecha:this.state.fecha,
                                empleados:this.state.data
                            }).then((response)=>{
                                toast.success("Se cargaron correctamente los bonos!", { transition: Flip });
                            })
                        }}>
                            <FontAwesomeIcon icon={faSave}  size={"2x"}/> Guardar
                        </Button.Ripple>

                    </Col>
                </Row>

                <Card style={{marginTop:30}}>
                    <CardBody>
                        <Row>
                            <Col md={12}>
                                <div  style={{marginTop:50}}>
                                    <Row>
                                        <Col md={4}> <strong>Periodo: </strong> </Col>
                                        <Col md={4}>  <span style={{width:'100%', textAlignment:'right'}}> {this.state.periodo} </span> </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}> <strong> Total Real: </strong> </Col>
                                        <Col md={4}>  <span style={{width:'100%', textAlignment:'right'}}> {NumberFormat(this.state.totalReal,0,",",".")} </span> </Col>
                                    </Row>
                                </div>

                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>

                                <DataTable
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    striped={true}
                                    noDataComponent={'No hay datos'}
                                    customStyles={{
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
                                    }}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default Index
