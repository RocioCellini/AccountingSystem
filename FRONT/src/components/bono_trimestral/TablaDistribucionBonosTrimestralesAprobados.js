import React from "react"
import DataTable from "react-data-table-component";
import API from './../../api';
import {
    Button,
    Input,
    Row,
    Col,
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faSave} from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input";
import {Flip, toast} from "react-toastify";
import {COLORS} from "../../utility/utils";
import {NumberFormat} from "../../helpers/numberFormat";

class TablaDistribucionBonosTrimestralesAprobados extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            showTabla:true,
            data:[],
            dataFull:[],
            user:[],
            roles:[],
            columns:[],
            totalReal:0,
            totalSugerencia:0,
        }

        this.handleBono = this.handleBono.bind(this);
        this.buscador = this.buscador.bind(this);
    }

    componentDidMount(){
        this.setState({columns:[
                {name:"Leg.",selector:"empleado.legajo_bejerman", width:'10%'},
                {name:"Nombre",selector:"empleado.nombre_apellido", width:'30%'},
                {name:"Bono USD",width:'15%',cell :(row) => (<span>{NumberFormat(row.bono_usd,0,",",".")}</span>)},
                {name:"Tipo Cambio",width:'15%',cell :(row) => (<span>{NumberFormat(row.tipo_cambio,4,",",".")}</span>)},
                {name:"Bono ARS",width:'15%',cell :(row) => (<span>{NumberFormat(row.bono_ars,0,",",".")}</span>)},
                {name:"Ajuste", width:'15%',cell :(row) =>
                    {
                        return (
                            <CurrencyInput style={{textAlign:'right', color:row.ajuste<0 ? COLORS.ERROR : COLORS.BLACK}}
                                           className="form-control"
                                           precision={0}
                                           prefix={'$'}
                                           selectAllOnFocus={true}
                                           decimalSeparator={','}
                                           thousandSeparator={'.'}
                                           allowNegative={true}
                                           value={parseInt(row.ajuste)}
                                           onChange={e => this.handleBono(row.id, e.replaceAll('USD ','').replaceAll('$','').replaceAll('.','').replaceAll(',','.'))}
                            />
                        )
                    }
                }
            ]});



        API.getBonosAprobadosParaAjustar().then((response)=>{

            let data = (response.data.bonos.map((e, i) => ({...e, bono_usd:e.importe, tipo_cambio:response.data.tipo_cambio, bono_ars:(e.importe * response.data.tipo_cambio)})));

            this.setState({
                showTabla: (["01","04","07","10"].includes(response.data.fecha.substring(4,6)) ? true : false),
                fecha:response.data.fecha,
                periodo:response.data.periodo,
                data:data,
                dataFull:data,
            });

        });

        this.setState({user:this.props.user});
    }


    buscador(valor){

        if(valor==''){
            this.setState({
                data:this.state.dataFull
            })
        } else {
            let response = [];
            this.state.dataFull.map((e,i)=>{
                if(e?.empleado?.nombre_apellido.toUpperCase().includes(valor.toUpperCase())){
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
        oldData[index].ajuste = parseFloat(importe);
        this.setState({data:oldData});
    }



    render(){
        return (
            <div>
                {!this.state.showTabla && (["RRHH","SU"].includes(this.state.user?.rol?.codigo)) &&
                <h3>No es posible cargar Bono Trimestral para el Periodo {this.state.periodo}</h3>
                }
                {this.state.showTabla &&
                <div>
                    <div>
                        {(["RRHH","SU"].includes(this.state.user?.rol?.codigo)) &&
                        <Row>

                            <Col md={12}>
                                <span>* Los importes cargados son en USD Dolares</span>
                                <div  style={{marginTop:50}}>
                                    <Row>
                                        <Col md={6}>
                                            <Input
                                                type="text"
                                                placeholder="Buscador"
                                                style={{width:300, marginTop:20}}
                                                onChange={e => this.buscador(e.target.value)}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}> <strong>Periodo: </strong> </Col>
                                        <Col md={4}>  <span style={{width:'100%', textAlignment:'right'}}> {this.state.periodo} </span> </Col>
                                    </Row>
                                </div>
                                <Col md={12}>
                                    <div  style={{marginTop:50}}>
                                        <Button.Ripple size='sm' outline={true} color="success" onClick={()=>{
                                            API.saveBonosTrimestralesDistribucionAjustes({
                                                fecha:this.state.fecha,
                                                bonos:this.state.data
                                            }).then((response)=>{
                                                if (response.status){
                                                    toast.success("Se ajustaron correctamente los bonos!", { transition: Flip });
                                                }
                                            })
                                        }}>
                                            <FontAwesomeIcon icon={faSave}  size={"2x"}/> Guardar
                                        </Button.Ripple>
                                    </div>
                                </Col>

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
                        }
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default TablaDistribucionBonosTrimestralesAprobados
