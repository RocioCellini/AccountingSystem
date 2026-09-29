import React, {useEffect, useState} from "react"
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
import {Link} from "react-router-dom";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Index = (props) =>{
    const [user, setUser] = useState([]);
    const [fondos, setFondos] = useState([]);
    const [data, setData] = useState([]);
    const [buscador, setBuscador] = useState("");
    const [columns, setColumns] = useState([]);

    useEffect(()=>{
        API.getFondos().then((response)=>{
            setFondos(response.data.fondos);
            setData(response.data.fondos.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));
        });

        API.getInfo().then((response)=>{
            setUser(response.data);
            setColumns([
                {name:"Numero",selector:"numero_fondo",wrap: true},
                {name:"Nombre",selector:"descripcion",wrap: true},
                {name:"Moneda",selector:"moneda",wrap: true},
                {name:"Accion", width:'8%',cell :(row) => (
                        <Link to={"/configuracion-comisiones/fondos/getone/"+  row.id}>
                            <Button.Ripple size='sm'  color="primary"  >
                                <FontAwesomeIcon style={{color:COLORS.WHITE}} icon={faLink} />
                            </Button.Ripple>
                        </Link>
                    )},
            ])
        });
    },[]);



    useEffect(()=>{

        if(buscador==''){
            setData(fondos.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));

        } else {
            let response = [];
            fondos.map((e,i)=>{
                if(e.numero_fondo.toString().toUpperCase().includes(buscador.toUpperCase())
                    || (e?.descripcion ?? '').toUpperCase().includes(buscador.toUpperCase())
                    || (e?.moneda ?? '').toUpperCase().includes(buscador.toUpperCase())){
                    response.push(e);
                }
            });
            setData(response.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));
        }
    },[buscador]);


    const customStyles = {
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
    };

    return (
        <Card>
            <CardBody>

                <h1 style={{color:COLORS.SECONDARY}}>Fondos</h1>
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={6}>
                                <Input
                                    type="text"
                                    placeholder="Buscador"
                                    style={{width:300, marginTop:20}}
                                    value={buscador}
                                    onChange={e => setBuscador(e.target.value)}/>
                            </Col>
                        </Row>


                        <DataTable
                            data={data}
                            columns={columns}
                            pagination
                            striped={true}
                            noDataComponent={'No hay datos'}
                            customStyles={customStyles}
                        />


                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Index
