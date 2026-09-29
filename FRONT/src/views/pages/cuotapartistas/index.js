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
    const [cuotapartistas, setCuotapartistas] = useState([]);
    const [data, setData] = useState([]);
    const [buscador, setBuscador] = useState("");
    const [columns, setColumns] = useState([]);

    useEffect(()=>{
        API.getCuotapartistas().then((response)=>{
            setCuotapartistas(response.data.cuotapartistas);
            setData(response.data.cuotapartistas.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));
        });

        API.getInfo().then((response)=>{
            setUser(response.data);
            setColumns([
                {name:"Numero",selector:"numero_cuotapartista",wrap: true},
                {name:"Nombre",selector:"descripcion",wrap: true},
                {name:"Oficial",wrap: true,cell:(row)=>(
                        <Link to={"/empleados/oficiales/getone/"+  row.oficial.id} target="_blank" style={{textDecoration:'underline', color:COLORS.MODERN_BLUE }}>
                            <span>
                                {row.oficial.descripcion.toUpperCase()}
                            </span>
                        </Link>
                    )},
                {name:"Accion", width:'8%',cell :(row) => (
                        <Link to={"/configuracion-comisiones/cuotapartistas/getone/"+  row.id}>
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
            setData(cuotapartistas.map((e)=>({
                ...e,
                obj:JSON.stringify(e),
            })));

        } else {
            let response = [];
            cuotapartistas.map((e,i)=>{
                if(e.numero_cuotapartista.toString().toUpperCase().includes(buscador.toUpperCase())
                    || (e?.descripcion ?? '').toUpperCase().includes(buscador.toUpperCase())
                    || (e?.oficial?.descripcion ?? '').toUpperCase().includes(buscador.toUpperCase())){
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
        <div>
            <Row style={{marginTop:30}}>
                <Col md={12} style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'flex-start'}}>

                    <span style={{fontSize:30,color:COLORS.SECONDARY,fontWeight:'bold'}}>Cuotapartistas</span>

                    <Input
                        type="text"
                        placeholder="Buscador"
                        style={{width:300, borderRadius:10, marginLeft:30, marginRight:30}}
                        value={buscador}
                        onChange={e => setBuscador(e.target.value)}/>

                </Col>
            </Row>


            <Card style={{marginTop:30}}>
                <CardBody>


                    <Row>
                        <Col md={12}>


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
        </div>
    )
}

export default Index
