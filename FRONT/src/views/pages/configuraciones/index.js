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
 FormGroup, Label
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { toast, Zoom, Flip} from "react-toastify"
import PreConfirm from "../../../components/customs/PreConfirm";
import {
    faCalendarAlt,
    faDownload,
    faFileUpload,
    faUpload,

} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TipoCambio from "../../../components/configuracion/TipoCambio";
import CalendarioBonoSemestral from "../../../components/configuracion/CalendarioBonoSemestral";
import Select from "react-select";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fecha_periodo : undefined,
            showPreconfirm : false,
            textoPreconfirm : ''
        }
        this.handleFileChange = this.handleFileChange.bind(this)
    }

    componentDidMount() {
        API.getConfiguraciones().then((response)=>{
            let fecha = new Date(response.data.fecha_cierre);
            fecha = fecha.setDate(fecha.getDate() + 1);
            this.setState({
                fecha_periodo : fecha,
                fecha_liquidacion: new Date(),
                fecha_exportacion: new Date(),
            });
        })

        API.getEmpresas().then((response)=>{
            let arr = response.data.empresas.map((e, i) => ({ label: e.descripcion, value: e.id, obj:e }))
            this.setState({empresas:arr});
        })
    }


    toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    async handleFileChange (event, origen) {
        let selectedFile = event.target.files;
        let file = null;
        let fileName = "";
        //Check File is not Empty
        if (selectedFile.length > 0) {
            // Select the very first file from list
            let fileToLoad = selectedFile[0];
            fileName = fileToLoad.name;
            // FileReader function for read the file.avila.romina.valeria@gmail.com
            let fileReader = new FileReader();
            // Onload of file read the file content
            file = await this.toBase64(fileToLoad).catch(e => Error(e));
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
        }
        this.setState({['file' + '_' + origen] : file, ['fileName' + '_' + origen] : fileName})

    }

    render(){
        return (
            <div>
                <Row>
                    <PreConfirm show={this.state.showPreconfirm} texto={this.state.textoPreconfirm}/>


                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faCalendarAlt} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Cierre de Periodo</h3>

                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Ultimo periodo liquidado. Hasta el periodo indicado no se permitira cargar novedades
                                    </p>
                                </div>

                                <Flatpickr
                                    className="form-control"
                                    value={this.state.fecha_periodo}
                                    onChange={date => {
                                        this.setState({ fecha_periodo : date });
                                    }}
                                />
                                <br/>
                                <Button color="primary"  onClick={()=>{
                                    let fecha = new Date(this.state.fecha_periodo);
                                    let ano = fecha.getFullYear().toString();
                                    let mes = (fecha.getMonth() + 1).toString();
                                    mes = (mes.length==1) ? '0' + mes : mes;
                                    let dia = (fecha.getDate()).toString();
                                    dia = (dia.length==1) ? '0' + dia : dia;

                                    API.saveFechaCierre({fecha_cierre:(ano + mes + dia)}).then((response)=>{
                                        if(response.status === "success"){
                                            toast.success("Se guardo el periodo correctamente!", { transition: Zoom });}
                                    })
                                }}>
                                    Guardar
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>


                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faDownload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Descarga de Novedades</h3>

                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Novedades del periodo para subir en Bejerman
                                    </p>
                                </div>

                                <Flatpickr
                                    className="form-control"
                                    value={this.state.fecha_exportacion}
                                    onChange={date => {
                                        this.setState({ fecha_exportacion : date });
                                    }}
                                />
                                <br/>
                                <Button color="primary"  onClick={()=>{
                                    let fecha = new Date(this.state.fecha_exportacion);
                                    let ano = fecha.getFullYear().toString();
                                    let mes = (fecha.getMonth() + 1).toString();
                                    mes = (mes.length==1) ? '0' + mes : mes;
                                    let dia = (fecha.getDate()).toString();
                                    dia = (dia.length==1) ? '0' + dia : dia;

                                    API.downloadNovedades({periodo:(ano + mes + dia)}).then((response)=>{
                                        if(response.status === "success"){
                                            var link = document.createElement("a");
                                            link.download = "Novedades.xls";
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
                                    Exportar
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                <Row>
                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faFileUpload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Carga de Nomina Masiva</h3>
                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Aca debe subir el archivo de Nomina con los datos generales para actualizar o crear empleados de manera masiva.
                                    </p>
                                </div>

                                <Input
                                    type="file"
                                    required
                                    onChange={(event)=>this.handleFileChange(event,'nomina')}
                                />
                                <br/>
                                <Button color="primary"  onClick={()=>{

                                API.uploadNomina({ file: this.state.file_nomina, fileName: this.state.fileName_nomina })
                                .then((response) => {
                                    if (response.status === "success") {
                                        toast.success("Archivo Importado", { traedrgftvnsition: Zoom });
                                    } else {
                                        const errorMessage = response.error ;
                                        toast.error("Error! " + errorMessage, { transition: Zoom });
                                    }
                                })
                                .catch((error) => {
                                    const errorMessage = error.response?.data?.message || "Ocurrió un error inesperado";
                                    toast.error("Error! " + errorMessage, { transition: Zoom });
                                });

                                }}>
                                    Guardar
                                </Button>

                            </CardBody>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faFileUpload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Subir Archivo de Liquidacion</h3>

                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Subir el archivo de liquidaciones mensuales de Bejerman, va a actualizar los registros historicos.
                                    </p>
                                </div>

                                <br/>
                                <Flatpickr
                                    className="form-control"
                                    value={this.state.fecha_liquidacion}
                                    onChange={date => {
                                        this.setState({ fecha_liquidacion : date });
                                    }}
                                />
                                <br/>
                                <Input
                                    type="file"
                                    required
                                    onChange={(event)=>this.handleFileChange(event,'liquidacion')}
                                />
                                <br/>
                                <Button color="primary" onClick={() => {
                                    let fecha = new Date(this.state.fecha_liquidacion);
                                    let ano = fecha.getFullYear().toString();
                                    let mes = (fecha.getMonth() + 1).toString();
                                    mes = (mes.length === 1) ? '0' + mes : mes;
                                    let dia = (fecha.getDate()).toString();
                                    dia = (dia.length === 1) ? '0' + dia : dia;

                                    toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});

                                    API.uploadLiquidacion({
                                        file: this.state.file_liquidacion,
                                        fileName: this.state.fileName_liquidacion,
                                        periodo: ano + mes + dia
                                    })
                                    .then((response) => {
                                        toast.dismiss();

                                        if (response.status === "success") {
                                            toast.success("Archivo Importado", { transition: Zoom });
                                        } else {
                                            const errorMessage = response.error ? response.error : "Formato de archivo incorrecto";
                                            toast.error("Error! " + errorMessage, { transition: Zoom });
                                        }
                                    })
                                    .catch((error) => {
                                        toast.dismiss();

                                        const errorMessage = error.response?.data?.message || "Ocurrió un error inesperado";
                                        toast.error("Error! " + errorMessage, { transition: Zoom });
                                    });
                                }}>
                                    Guardar
                                </Button>


                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <TipoCambio/>
                    </Col>

                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faFileUpload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Carga de Comisiones</h3>
                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Seccion para subir el archivo de comisiones por periodo
                                    </p>
                                </div>

                                <Input
                                    type="file"
                                    required
                                    onChange={(event)=>this.handleFileChange(event,'comisiones')}
                                />
                                <br/>
                                <Button color="primary"  onClick={()=>{

                                    API.uploadComisiones({file:this.state.file_comisiones, fileName:this.state.fileName_comisiones}).then((response)=>{
                                        if(response.status === "success"){
                                            toast.success("Archivo Importado", { transition: Zoom });
                                        } else {
                                            toast.error("Error! " + response.error, { transition: Zoom });
                                        }
                                    });


                                }}>
                                    Guardar
                                </Button>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                <Row>

                    <Col md={6}>
                        <CalendarioBonoSemestral/>
                    </Col>

                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faDownload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Descarga de Comisiones Fondos (Seeker)</h3>

                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Archivo de Comisiones de Fondos por Oficial de Cuenta de Seeker
                                    </p>
                                </div>

                                <Flatpickr
                                    className="form-control"
                                    value={this.state.fecha_exportacion}
                                    onChange={date => {
                                        this.setState({ fecha_exportacion : date });
                                    }}
                                />
                                <br/>
                                <Button color="primary"  onClick={()=>{
                                    let fecha = new Date(this.state.fecha_exportacion);
                                    let ano = fecha.getFullYear().toString();
                                    let mes = (fecha.getMonth() + 1).toString();
                                    mes = (mes.length==1) ? '0' + mes : mes;
                                    let dia = (fecha.getDate()).toString();
                                    dia = (dia.length==1) ? '0' + dia : dia;

                                    API.downloadComisionesSeeker({periodo:(ano +  mes)}).then((response)=>{
                                        if(response.status === "success"){
                                            var link = document.createElement("a");
                                            link.download = "Comisiones.xls";
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
                                    Exportar
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>




                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faUpload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Subida de Archivo de Liquidacion</h3>

                                <div style={{height:50}}>
                                    <p style={{marginTop:20}}>
                                        Carga del archivo generado por Bejerman para su proceso con Asientos contables
                                    </p>
                                </div>

                                <Row>
                                    <Col md={12}>
                                        <Input
                                            type="file"
                                            required
                                            onChange={(event)=>this.handleFileChange(event,'liquidacion_bejerman')}
                                        />
                                    </Col>
                                </Row>

                                <br/>

                                <Row>
                                    <Col md={12}>
                                        <Flatpickr
                                            className="form-control"
                                            value={this.state.fecha_exportacion}
                                            onChange={date => {
                                                this.setState({ fecha_exportacion : date });
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <br/>

                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label style={{fontWeight:'bold'}}>Empresa:</Label>
                                            <Select
                                                className="React"
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                isClearable={true}
                                                options={this.state.empresas}
                                                style={{marginTop:5}}
                                                onChange={(e)=>{
                                                    this.setState({empresa:e?.value});
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>


                                <br/>
                                <Button color="primary" onClick={() => {
                                let fecha = new Date(this.state.fecha_exportacion);
                                let ano = fecha.getFullYear().toString();
                                let mes = (fecha.getMonth() + 1).toString();
                                mes = (mes.length === 1) ? '0' + mes : mes;
                                let dia = (fecha.getDate()).toString();
                                dia = (dia.length === 1) ? '0' + dia : dia;

                                toast.warn("Procesando..., aguarde!", { transition: Flip, autoClose: false });

                                API.uploadLiquidacionBejerman({
                                    periodo: ano + mes,
                                    empresa: this.state.empresa,
                                    file: this.state.file_liquidacion_bejerman,
                                    fileName: this.state.fileName_liquidacion_bejerman
                                })
                                .then((response) => {
                                    toast.dismiss();
                                    if (response.status === "success") {
                                        toast.success("Archivo Importado", { transition: Zoom });
                                    } else {
                                        toast.error("Error! " + (response.error || "Ocurrió un error desconocido"), { transition: Zoom });
                                    }
                                })
                                .catch((error) => {
                                    toast.dismiss();
                                    const errorMessage = error.response?.error || "Error en la carga del archivo. Intente nuevamente.";
                                    toast.error( errorMessage, { transition: Zoom });
                                });
                            }}>
                                    Importar
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>



                    <Col md={6}>
                        <Card style={{height:500}}>
                            <CardBody>
                                <div style={{height:60}}>
                                    <FontAwesomeIcon icon={faDownload} color={COLORS.GRAY_LIGHT} size={'4x'} style={{float:'right'}}/>
                                </div>

                                <h3 style={{color:COLORS.SECONDARY}}>Descarga de Asientos Contables</h3>

                                <div style={{height:100}}>
                                    <p style={{marginTop:20}}>
                                        Descarga de Excel para carga de Asientos Contables
                                    </p>
                                </div>

                                <Row>
                                    <Col md={12}>
                                        <Flatpickr
                                            className="form-control"
                                            value={this.state.fecha_exportacion}
                                            onChange={date => {
                                                this.setState({ fecha_exportacion : date });
                                            }}
                                        />
                                    </Col>
                                </Row>

                                <br/>
                                <br/>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label style={{fontWeight:'bold'}}>Empresa:</Label>
                                            <Select
                                                className="React"
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                isClearable={true}
                                                options={this.state.empresas}
                                                style={{marginTop:5}}
                                                onChange={(e)=>{
                                                    this.setState({empresa:e?.value});
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>


                                <br/>
                                <Button color="primary"  onClick={()=>{
                                    let fecha = new Date(this.state.fecha_exportacion);
                                    let ano = fecha.getFullYear().toString();
                                    let mes = (fecha.getMonth() + 1).toString();
                                    mes = (mes.length==1) ? '0' + mes : mes;
                                    let dia = (fecha.getDate()).toString();
                                    dia = (dia.length==1) ? '0' + dia : dia;
                                    toast.warn("Procesando..., aguarde!", { transition: Flip ,autoClose:false});

                                    API.downloadAsientosContables({periodo:(ano +  mes),empresa:this.state.empresa}).then((response)=>{
                                        if(response.status === "success"){
                                            var link = document.createElement("a");
                                            link.download = "AsientosContables.xls";
                                            link.href=response.data.ruta;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            toast.dismiss();
                                            toast.success("Listo!", { transition: Zoom });
                                        } else {
                                            toast.dismiss();
                                            toast.error(response.mensaje, { transition: Zoom });
                                        }
                                    })
                                }}>
                                    Exportar
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>



                </Row>
            </div>
        )
    }
}

export default Index;
