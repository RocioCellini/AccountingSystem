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
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faPaperPlane,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
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
      cambio: false,
      rows: [],
      criteria: [],
    };

    this.buscador = this.buscador.bind(this);
    this.handleIncremento = this.handleIncremento.bind(this);
    this.validation = this.validation.bind(this);
  }

  componentDidMount() {
    API.getIncrementosMasivos()
      .then(response => {
        this.setState(
          {
            showTabla: response.data.empleados != 0 ? true : false,
            data: response.data.empleados,
            dataFull: response.data.empleados,
          },
          () => {
            this.setState({
              columns: [
                { name: "Leg.", selector: "legajo_bejerman", width: "8%" },
                { name: "Nombre", selector: "nombre_apellido", width: "15%" },
                {
                  name: "Sueldo",
                  width: "12%",
                  cell: row => (
                    <span style={{ width: "100%", textAlignment: "right" }}>
                      {NumberFormat(row.ultimo_sueldo, 0, ",", ".")}
                    </span>
                  ),
                },
                {
                  name: this.state.dataFull[0]?.periodos[0]?.periodo ?? "T+0",
                  cell: row => {
                    let i = 0;
                    return (
                      <CurrencyInput
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            row.periodos[i]?.estado === "DRAFT"
                              ? COLORS.WARNING_LIGHT
                              : row.periodos[i]?.estado === "APR"
                              ? COLORS.SUCCESS_LIGHT
                              : row.periodos[0]?.estado === "REC"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.WHITE,
                        }}
                        className="form-control"
                        precision={0}
                        prefix={"$"}
                        selectAllOnFocus={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        value={parseInt(row.periodos[i]?.importe)}
                        onChange={e =>
                          this.handleIncremento(
                            row.id,
                            i,
                            e
                              .replaceAll("$", "")
                              .replaceAll(".", "")
                              .replaceAll(",", ".")
                          )
                        }
                      />
                    );
                  },
                },
                {
                  name: this.state.dataFull[0]?.periodos[1]?.periodo ?? "T+1",
                  cell: row => {
                    let i = 1;
                    return (
                      <CurrencyInput
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            row.periodos[i]?.estado === "DRAFT"
                              ? COLORS.WARNING_LIGHT
                              : row.periodos[i]?.estado === "APR"
                              ? COLORS.SUCCESS_LIGHT
                              : row.periodos[0]?.estado === "REC"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.WHITE,
                        }}
                        className="form-control"
                        precision={0}
                        prefix={"$"}
                        selectAllOnFocus={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        value={parseInt(row.periodos[i]?.importe)}
                        onChange={e =>
                          this.handleIncremento(
                            row.id,
                            i,
                            e
                              .replaceAll("$", "")
                              .replaceAll(".", "")
                              .replaceAll(",", ".")
                          )
                        }
                      />
                    );
                  },
                },
                {
                  name: this.state.dataFull[0]?.periodos[2]?.periodo ?? "T+2",
                  cell: row => {
                    let i = 2;
                    return (
                      <CurrencyInput
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            row.periodos[i]?.estado === "DRAFT"
                              ? COLORS.WARNING_LIGHT
                              : row.periodos[i]?.estado === "APR"
                              ? COLORS.SUCCESS_LIGHT
                              : row.periodos[0]?.estado === "REC"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.WHITE,
                        }}
                        className="form-control"
                        precision={0}
                        prefix={"$"}
                        selectAllOnFocus={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        value={parseInt(row.periodos[i]?.importe)}
                        onChange={e =>
                          this.handleIncremento(
                            row.id,
                            i,
                            e
                              .replaceAll("$", "")
                              .replaceAll(".", "")
                              .replaceAll(",", ".")
                          )
                        }
                      />
                    );
                  },
                },
                {
                  name: this.state.dataFull[0]?.periodos[3]?.periodo ?? "T+3",
                  cell: row => {
                    let i = 3;
                    return (
                      <CurrencyInput
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            row.periodos[i]?.estado === "DRAFT"
                              ? COLORS.WARNING_LIGHT
                              : row.periodos[i]?.estado === "APR"
                              ? COLORS.SUCCESS_LIGHT
                              : row.periodos[0]?.estado ==="REC"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.WHITE,
                        }}
                        className="form-control"
                        precision={0}
                        prefix={"$"}
                        selectAllOnFocus={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        value={parseInt(row.periodos[i]?.importe)}
                        onChange={e =>
                          this.handleIncremento(
                            row.id,
                            i,
                            e
                              .replaceAll("$", "")
                              .replaceAll(".", "")
                              .replaceAll(",", ".")
                          )
                        }
                      />
                    );
                  },
                },
                {
                  name: this.state.dataFull[0]?.periodos[4]?.periodo ?? "T+4",
                  cell: row => {
                    let i = 4;
                    return (
                      <CurrencyInput
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            row.periodos[i]?.estado === "DRAFT"
                              ? COLORS.WARNING_LIGHT
                              : row.periodos[i]?.estado === "APR"
                              ? COLORS.SUCCESS_LIGHT
                              : row.periodos[0]?.estado === "REC"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.WHITE,
                        }}
                        className="form-control"
                        precision={0}
                        prefix={"$"}
                        selectAllOnFocus={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        value={parseInt(row.periodos[i]?.importe)}
                        onChange={e =>
                          this.handleIncremento(
                            row.id,
                            i,
                            e
                              .replaceAll("$", "")
                              .replaceAll(".", "")
                              .replaceAll(",", ".")
                          )
                        }
                      />
                    );
                  },
                },
                {
                  name: this.state.dataFull[0]?.periodos[5]?.periodo ?? "T+5",
                  cell: row => {
                    let i = 5;
                    return (
                      <CurrencyInput
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            row.periodos[i]?.estado === "DRAFT"
                              ? COLORS.WARNING_LIGHT
                              : row.periodos[i]?.estado === "APR"
                              ? COLORS.SUCCESS_LIGHT
                              : row.periodos[0]?.estado === "REC"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.WHITE,
                        }}
                        className="form-control"
                        precision={0}
                        prefix={"$"}
                        selectAllOnFocus={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        value={parseInt(row.periodos[i]?.importe)}
                        onChange={e =>
                          this.handleIncremento(
                            row.id,
                            i,
                            e
                              .replaceAll("$", "")
                              .replaceAll(".", "")
                              .replaceAll(",", ".")
                          )
                        }
                      />
                    );
                  },
                },
              ],
            });
          }
        );
      })
      .catch(error => {
        console.error(error);
      });

    API.getInfo().then(response => {
      this.setState({ user: response.data });
    });
  }

  handleIncremento(id, periodo, importe) {
    let oldData = this.state.data;
    let index = oldData.findIndex(e => e.id === id);
    oldData[index].periodos[periodo].importe = importe;

    this.setState({ cambio: true, data: oldData });
    if (!this.state.criteria.includes(oldData[index].id)) {
      this.setState({ criteria: [...this.state.criteria, oldData[index].id] });
      this.setState({ rows: [...this.state.rows, oldData[index]] });
    }
  }

  validation() {
    let response = [];
    var validation = true;
    this.state.dataFull.map((e, i) => {
      if (this.state.criteria.includes(e.id)) {
        let sueldo = parseInt(e.sueldo_bruto);
        let x = 0;
        for (x = 0; x <= 5; x++) {
          let importe = parseInt(e.periodos[x].importe);
          if (importe < sueldo && importe != 0) {
            this.setState({
              mensaje:
                "El sueldo para el periodo " +
                e.periodos[x].periodo +
                " del empleado #" +
                e.legajo_bejerman +
                " " +
                e.nombre_apellido +
                " es mas bajo del permitido por un periodo anterior",
            });
            validation = false;
          } else {
            sueldo = importe;
          }
        }
      }
    });

    return validation;
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

  render() {
    const conditionalRowStyles = [
      {
        when: row => this.state.criteria.includes(row.id),
        style: {
          backgroundColor: "#e3f2fd",
          color: "black",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
    ];

    const tableData = {
      columns: this.state.columns,
      data: this.state.data,
    };

    return (
      <Card>
        <CardBody>
          <h1 style={{ color: COLORS.SECONDARY }}>
            Carga de Incrementos Masivos
          </h1>
          {this.state.showTabla && (
            <div>
              <Row>
                <Col md={6}>
                  <Input
                    type="text"
                    placeholder="Buscador"
                    style={{ width: 300, marginTop: 20 }}
                    onChange={e => this.buscador(e.target.value)}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div style={{ marginTop: 50 }}>
                  <Button.Ripple
                  style={{ marginRight: 10 }}
                  size="sm"
                  outline={true}
                  color="warning"
                  onClick={() => {
                    if (!this.validation()) {
                      toast.error(this.state.error, { transition: Flip });
                      return false;
                    }
                    toast.warn("Procesando...", {
                      transition: Flip,
                      autoClose: false,
                    });
                    API.saveIncrementosMasivos({
                      empleados: this.state.rows,
                      estado: false,
                    }).then(response => {
                      toast.dismiss();
                      this.setState({
                        showTabla: response.data.empleados != 0 ? true : false,
                        data: response.data.empleados,
                        dataFull: response.data.empleados,
                        cambio: false,
                        rows: [],
                        criteria: [],
                      });
                      toast.success(
                        "Se cargaron correctamente los incrementos!",
                        { transition: Flip }
                      );

                      API.getIncrementosMasivos()
                        .then(response => {
                          this.setState({
                            showTabla: response.data.empleados != 0 ? true : false,
                            data: response.data.empleados,
                            dataFull: response.data.empleados,
                          });
                        })
                        .catch(error => {
                          console.error(error);
                        });
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} size={"2x"} /> Guardar como Borrador
                </Button.Ripple>

                <Button.Ripple
                  style={{ marginRight: 10 }}
                  size="sm"
                  outline={true}
                  color="success"
                  onClick={() => {
                    if (!this.validation()) {
                      toast.error(this.state.mensaje, { transition: Flip });
                      return false;
                    }
                    toast.warn("Procesando...", {
                      transition: Flip,
                      autoClose: false,
                    });
                    API.saveIncrementosMasivos({
                      empleados: this.state.data,
                      estado: true,
                    }).then(response => {
                      toast.dismiss();
                      this.setState({
                        showTabla: response.data.empleados != 0 ? true : false,
                        data: response.data.empleados,
                        dataFull: response.data.empleados,
                        cambio: false,
                        rows: [],
                        criteria: [],
                      });
                      toast.success(
                        "Se cargaron correctamente los incrementos!",
                        { transition: Flip }
                      );

                      API.getIncrementosMasivos()
                        .then(response => {
                          this.setState({
                            showTabla: response.data.empleados != 0 ? true : false,
                            data: response.data.empleados,
                            dataFull: response.data.empleados,
                          });
                        })
                        .catch(error => {
                          console.error(error);
                        });
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faSave} size={"2x"} /> Guardar y Enviar a Aprobacion
                </Button.Ripple>

                    {!this.state.cambio && (
                      <Button.Ripple
                        size="sm"
                        color="success"
                        onClick={() => {
                          if (!this.validation()) {
                            toast.error(this.state.mensaje, {
                              transition: Flip,
                            });
                            return false;
                          }
                          toast.warn("Procesando...", {
                            transition: Flip,
                            autoClose: false,
                          });
                          API.downloadIncrementosMasivos().then(response => {
                            toast.dismiss();
                            if (response.status === "success") {
                              var link = document.createElement("a");
                              link.download = "Incrementos.xls";
                              link.href = response.data
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast.success("Listo!", { transition: Zoom });
                            } else {
                              toast.error(response.error, {
                                transition: Zoom,
                              });
                            }
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faFileExcel} size={"2x"} />{" "}
                        Exportar
                      </Button.Ripple>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <DataTable
                    data={this.state.data}
                    columns={this.state.columns}
                    striped={true}
                    noDataComponent={"No hay datos"}
                    onSelectedRowsChange={({
                      allSelected,
                      selectedCount,
                      selectedRows,
                    }) => {
                      this.setState({ rows: selectedRows });
                    }}
                    conditionalRowStyles={conditionalRowStyles}
                    customStyles={{
                      rows: {
                        fontSize: 10,
                      },
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
    );
  }
}

export default Index;
