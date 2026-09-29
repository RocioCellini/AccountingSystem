import React from "react"
import DataTable from "react-data-table-component";
import API from './../../api';
import {
    Button,
    Row,
    Col,
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input";
import {Flip, toast} from "react-toastify";
import {COLORS} from "../../utility/utils";


class TablaSugerenciasBonosTrimestrales extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            data:[],
            user:[],
            roles:[],
            columns:[],
            totalSugerencia:0,
            totalReal:0,
        }

        this.handleBono = this.handleBono.bind(this);
    }

    componentDidMount(){

        this.setState({columns:[
                {name:"Leg.",selector:"legajo_bejerman", width:'20%'},
                {name:"Nombre",selector:"nombre_apellido", width:'45%'},
                {name:"Bono", width:'35%',cell :(row) => (
                        <CurrencyInput style={{textAlign:'right', backgroundColor:row?.bonos_semestrales_estado?.codigo=="APR" ? COLORS.SUCCESS_LIGHT : row?.bonos_semestrales_estado?.codigo=="REC" ? COLORS.ERROR_LIGHT : COLORS.WHITE}}
                                       className="form-control"
                                       precision={0}
                                       prefix={'USD '}
                                       selectAllOnFocus={true}
                                       decimalSeparator={','}
                                       thousandSeparator={'.'}
                                       value={parseInt(row.bonos_trimestral_importe)}
                                       onChange={e => this.handleBono(row.id, e.replaceAll('USD ','').replaceAll('$','').replaceAll('.','').replaceAll(',','.'))}
                        />
                    )}
            ]});


        API.getBonosTrimestrales().then((response)=>{
            let totalReal = 0;
            for(let i=0; i<response.data.empleados.length; i++){
                totalReal += parseFloat(response.data.empleados[i].bonos_semestrales_importe);
            }
            this.setState({
                fecha:response.data.fecha,
                periodo:response.data.periodo,
                data:response.data.empleados,
            });

        });

        this.setState({user:this.props.user});
    }


    handleBono(id, importe){
        let oldData = this.state.data;
        let index = oldData.findIndex((e) => e.id === id)
        oldData[index].bonos_trimestral_importe = importe;
        this.setState({data:oldData});
    }



    render(){
        return (
            <div>
                {(["RRHH","APR","SU"].includes(this.state.user?.rol?.codigo)) &&
                <Row>
                    <Col md={7}>


                        <DataTable
                            data={this.state.data}
                            columns={this.state.columns}
                            striped={true}
                            title={'Carga Inicial'}
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
                    <Col md={3}>
                        <div  style={{marginTop:50}}>
                            <Button.Ripple size='sm' outline={true} color="success" onClick={()=>{
                                API.saveBonosTrimestralesSugerencias({
                                    fecha:this.state.fecha,
                                    empleados:this.state.data
                                }).then((response)=>{
                                    if (response.status){
                                        toast.success("Se cargaron correctamente los bonos!", { transition: Flip });
                                    }
                                })
                            }}>
                                <FontAwesomeIcon icon={faSave}  size={"2x"}/> Guardar
                            </Button.Ripple>
                        </div>
                    </Col>
                </Row>
                }
            </div>
        )
    }
}

export default TablaSugerenciasBonosTrimestrales
