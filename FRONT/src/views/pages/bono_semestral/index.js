import React from "react";
import DataTable from "react-data-table-component";
import { COLORS } from "../../../utility/utils";
import API from "./../../../api";
import {
  Button,
  Input,
  Card,
  CardBody,
  Row,
  Col,
  Alert,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faPaperPlane,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { NumberFormat } from "../../../helpers/numberFormat";
import CurrencyInput from "react-currency-input";
import { Flip, toast, Zoom } from "react-toastify";
import "react-data-table-component-extensions/dist/index.css";


class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTabla: true,
      dataFull: [],
      data: [],
      user: [],
      roles: [],
      columns: [],
      totalSugerencia: 0,
      totalReal: 0,
      cambio: false,
      rows: 0,
    };

    this.handleBono = this.handleBono.bind(this);
    this.buscador = this.buscador.bind(this);
  }

  componentDidMount() {
    this.setState({
      columns: [
        { name: "Leg.", selector: "legajo_bejerman", width: "5%" },
        {
          name: "Nombre Apellido",
          width: "20%",
          wrap: true,
          cell: row => (
            <Link
              to={"/empleados/getone/" + row.id}
              target="_blank"
              style={{ textDecoration: "underline", color: COLORS.MODERN_BLUE }}
            >
              <span>{row.nombre_apellido.toUpperCase()}</span>
            </Link>
          ),
        },
        { name: "Ingreso", selector: "fecha_ingreso_formatted", width: "15%" },
        {
          name: "Sueldo",
          width: "16%",
          cell: row => (
            <span style={{ width: "100%", textAlignment: "right" }}>
              {NumberFormat(row.ultimo_sueldo, 0, ",", ".")}
            </span>
          ),
        },
        {
          name: "Q Bonus",
          width: "12%",
          cell: row => (
            <span style={{ width: "100%", textAlignment: "right" }}>
              {NumberFormat(row.bono_semestral, 0, ",", ".")}
            </span>
          ),
        },
        {
          name: "Sugerencia",
          width: "16%",
          cell: row => (
            <span style={{ width: "100%", textAlignment: "right" }}>
              {NumberFormat(row.bonos_semestrales_sugerencia, 0, ",", ".")}
            </span>
          ),
        },
        {
          name: "Bono",
          cell: row => (
            <CurrencyInput
              style={{
                textAlign: "right",
                backgroundColor:
                  row?.bonos_semestrales_estado?.codigo == "DRAFT"
                    ? COLORS.WARNING_LIGHT
                    : row?.bonos_semestrales_estado?.codigo == "APR"
                    ? COLORS.SUCCESS_LIGHT
                    : row?.bonos_semestrales_estado?.codigo == "REC"
                    ? COLORS.ERROR_LIGHT
                    : COLORS.WHITE,
              }}
              className="form-control"
              precision={0}
              prefix={"$"}
              selectAllOnFocus={true}
              decimalSeparator={","}
              thousandSeparator={"."}
              value={parseInt(row.bonos_semestrales_importe)}
              onChange={e =>
                this.handleBono(
                  row.id,
                  e.replaceAll("$", "").replaceAll(".", "").replaceAll(",", ".")
                )
              }
            />
          ),
        },
      ],
    });

    API.getBonosSemestrales().then(response => {
      let totalSugerencia = 0;
      let totalReal = 0;
      for (let i = 0; i < response.data.empleados.length; i++) {
        totalSugerencia += parseFloat(
          response.data.empleados[i].bonos_semestrales_sugerencia
        );
        totalReal += parseFloat(
          response.data.empleados[i].bonos_semestrales_importe
        );
      }

      this.setState({
        showTabla: response.data.bonos != 0 ? true : false,
        fecha: response.data.fecha,
        periodo: response.data.periodo,
        bonos: response.data.bonos,
        data: response.data.empleados,
        dataFull: response.data.empleados,
        totalReal: totalReal,
        totalSugerencia: totalSugerencia,
      });
    });

    API.getInfo().then(response => {
      this.setState({ user: response.data });
    });
  }

  buscador(valor) {
    if (valor == "") {
      this.setState({
        data: this.state.dataFull,
      });
    } else {
      let response = [];
      this.state.dataFull.map((e, i) => {
        if (e.nombre_apellido.toUpperCase().includes(valor.toUpperCase())) {
          response.push(e);
        }
      });

      this.setState({
        data: response,
      });
    }
  }

  handleBono(id, importe) {
    let oldData = this.state.data;
    let index = oldData.findIndex(e => e.id === id);
    oldData[index].bonos_semestrales_importe = importe;

    let totalSugerencia = 0;
    let totalReal = 0;
    for (let i = 0; i < oldData.length; i++) {
      totalSugerencia += parseFloat(oldData[i].bonos_semestrales_sugerencia);
      totalReal += parseFloat(oldData[i].bonos_semestrales_importe);
    }

    this.setState({
      cambio: true,
      data: oldData,
      totalReal: totalReal,
      totalSugerencia: totalSugerencia,
    });
  }

  render() {
    const tableData = {
      columns: this.state.columns,
      data: this.state.data,
    };

    return (
      <div>
        <Row style={{ marginTop: 30 }}>
          <Col
            md={12}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 30,
                color: COLORS.SECONDARY,
                fontWeight: "bold",
              }}
            >
              Bono Semestral
            </span>

            {!this.state.showTabla && (
              <span
                style={{
                  fontSize: 20,
                  color: COLORS.BLACK,
                  fontWeight: "bold",
                }}
              >
                No es posible cargar bono semestral para el Periodo{" "}
                {this.state.periodo}
              </span>
            )}

            <Input
              type="text"
              placeholder="Buscador"
              style={{
                width: 300,
                borderRadius: 10,
                marginLeft: 30,
                marginRight: 30,
              }}
              onChange={e => this.buscador(e.target.value)}
            />

            {this.state.cambio && (
              <Alert color="warning">
                Por favor recuerde guardar antes de Salir!
              </Alert>
            )}

            <Button.Ripple
              style={{ marginRight: 10 }}
              size="sm"
              outline={false}
              color="warning"
              onClick={() => {
                API.saveBonosSemestrales({
                  fecha: this.state.fecha,
                  empleados:
                    this.state.rows.length == 0
                      ? this.state.data
                      : this.state.rows,
                  estado: false,
                }).then(response => {
                  this.setState({ cambio: false });
                  toast.success("Se cargaron correctamente los bonos!", {
                    transition: Flip,
                  });
                });
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} size={"2x"} /> Guardar como
              Borrador
            </Button.Ripple>

            <Button.Ripple
              style={{ marginRight: 10 }}
              size="sm"
              outline={false}
              color="success"
              onClick={() => {
                API.saveBonosSemestrales({
                  fecha: this.state.fecha,
                  empleados:
                    this.state.rows.length == 0
                      ? this.state.data
                      : this.state.rows,
                  estado: true,
                }).then(response => {
                  this.setState({ cambio: false });
                  toast.success("Se cargaron correctamente los bonos!", {
                    transition: Flip,
                  });
                });
              }}
            >
              <FontAwesomeIcon icon={faSave} size={"2x"} /> Guardar y Enviar a
              Aprobacion
            </Button.Ripple>

            {!this.state.cambio && (
              <Button.Ripple
                size="sm"
                color="success"
                onClick={() => {
                  API.downloadBonosSemestrales("202204").then(response => {
                    if (response.status) {
                      var link = document.createElement("a");
                      link.download = "Bonos.xls";
                      link.href = response.data.ruta;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      toast.success("Listo!", { transition: Zoom });
                    } else {
                      toast.error(response.error, { transition: Zoom });
                    }
                  });
                }}
              >
                <FontAwesomeIcon icon={faFileExcel} size={"2x"} /> Exportar
              </Button.Ripple>
            )}
          </Col>
        </Row>

        <Card style={{ marginTop: 30 }}>
          <CardBody>
            {this.state.showTabla && (
              <div>
                <Row>
                  <Col md={12}>
                    <div style={{ marginTop: 50 }}>
                      <Row>
                        <Col md={4}>
                          {" "}
                          <strong>Periodo: </strong>{" "}
                        </Col>
                        <Col md={4}>
                          {" "}
                          <span
                            style={{ width: "100%", textAlignment: "right" }}
                          >
                            {" "}
                            {this.state.periodo}{" "}
                          </span>{" "}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          {" "}
                          <strong>% Bono Recomendado: </strong>{" "}
                        </Col>
                        <Col md={4}>
                          {" "}
                          <span
                            style={{ width: "100%", textAlignment: "right" }}
                          >
                            {" "}
                            {NumberFormat(
                              this.state.bonos * 100,
                              0,
                              ",",
                              "."
                            )}{" "}
                            %
                          </span>{" "}
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          {" "}
                          <strong> Total Sugerencia: </strong>{" "}
                        </Col>
                        <Col md={4}>
                          {" "}
                          <span
                            style={{ width: "100%", textAlignment: "right" }}
                          >
                            {" "}
                            {NumberFormat(
                              this.state.totalSugerencia,
                              0,
                              ",",
                              "."
                            )}{" "}
                          </span>{" "}
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          {" "}
                          <strong> Total Real: </strong>{" "}
                        </Col>
                        <Col md={4}>
                          {" "}
                          <span
                            style={{ width: "100%", textAlignment: "right" }}
                          >
                            {" "}
                            {NumberFormat(
                              this.state.totalReal,
                              0,
                              ",",
                              "."
                            )}{" "}
                          </span>{" "}
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          {" "}
                          <strong> Diferencia: </strong>{" "}
                        </Col>
                        <Col md={4}>
                          {" "}
                          <span
                            style={{
                              width: "100%",
                              textAlignment: "right",
                              color:
                                this.state.totalReal >
                                this.state.totalSugerencia
                                  ? COLORS.MODERN_RED
                                  : this.state.totalReal <
                                    this.state.totalSugerencia
                                  ? COLORS.MODERN_GREEN
                                  : COLORS.BLACK,
                            }}
                          >
                            {" "}
                            {NumberFormat(
                              this.state.totalReal - this.state.totalSugerencia,
                              0,
                              ",",
                              "."
                            )}{" "}
                          </span>{" "}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <DataTable
                      data={this.state.data}
                      columns={this.state.columns}
                      striped={true}
                      selectableRows={true}
                      selectableRowsHighlight={true}
                      clearSelectedRows={true}
                      noDataComponent={"No hay datos"}
                      onSelectedRowsChange={({
                        allSelected,
                        selectedCount,
                        selectedRows,
                      }) => {
                        this.setState({ rows: selectedRows });
                      }}
                      customStyles={{
                        rows: {},
                        headCells: {
                          style: {
                            backgroundColor: COLORS.SECONDARY,
                            color: COLORS.WHITE,
                            textAlign: "center",
                          },
                        },
                        cells: {},
                      }}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Index;
