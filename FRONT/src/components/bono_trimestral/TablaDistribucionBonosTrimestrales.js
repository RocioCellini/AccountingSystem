import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import API from "./../../api";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  ModalFooter,
  UncontrolledDropdown,
  Badge,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faInfoCircle,
  faPlusCircle,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import { Flip, toast } from "react-toastify";
import { COLORS } from "../../utility/utils";
import { NumberFormat } from "../../helpers/numberFormat";

class TablaDistribucionBonosTrimestrales extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showtabla: true,
      data: [],
      dataFull: [],
      user: [],
      roles: [],
      columns: [],
      totalReal: 0,
      totalSugerencia: 0,
    };

    this.handleBono = this.handleBono.bind(this);
    this.buscador = this.buscador.bind(this);
  }

  componentDidMount() {
    this.setState({
      columns: [
        { name: "Leg.", selector: "legajo_bejerman", width: "20%" },
        { name: "Nombre", selector: "nombre_apellido", width: "45%" },
        {
          name: "Bono",
          width: "35%",
          cell: row => (
            <CurrencyInput
              style={{
                textAlign: "right",
                backgroundColor:
                  row?.bono_trimestral_estado?.codigo == "APR"
                    ? COLORS.SUCCESS_LIGHT
                    : row?.bono_trimestral_estado?.codigo == "REC"
                    ? COLORS.ERROR_LIGHT
                    : COLORS.WHITE,
              }}
              className="form-control"
              precision={0}
              prefix={"USD "}
              selectAllOnFocus={true}
              decimalSeparator={","}
              thousandSeparator={"."}
              value={parseInt(row.bono_trimestral_distribuido)}
              onChange={e =>
                this.handleBono(
                  row.id,
                  e
                    .replaceAll("USD ", "")
                    .replaceAll("$", "")
                    .replaceAll(".", "")
                    .replaceAll(",", ".")
                )
              }
            />
          ),
        },
      ],
    });

    API.getBonosTrimestralesMyPool().then(response => {
      let totalReal = 0;
      for (let i = 0; i < response.data.empleados.length; i++) {
        totalReal += parseFloat(
          response.data.empleados[i].bono_trimestral_distribuido
        );
      }

      this.setState({
        showTabla: ["01", "04", "07", "10"].includes(
          response.data.fecha.substring(4, 6)
        )
          ? true
          : false,
        fecha: response.data.fecha,
        periodo: response.data.periodo,
        data: response.data.empleados,
        dataFull: response.data.empleados,
        totalSugerencia: response.data.sugerencia,
        totalReal: totalReal,
      });
    });

    this.setState({ user: this.props.user });
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
    oldData[index].bono_trimestral_distribuido = importe;
    let totalReal = 0;
    for (let i = 0; i < oldData.length; i++) {
      totalReal += parseFloat(oldData[i].bono_trimestral_distribuido);
    }

    this.setState({ data: oldData, totalReal: totalReal });
  }

  render() {
    return (
      <div>
        {!this.state.showTabla &&
          ["GTE", "APR", "RRHH", "GTEF"].includes(
            this.state.user?.rol?.codigo
          ) && (
            <h3>
              No es posible cargar Bono Trimestral para el Periodo{" "}
              {this.state.periodo}
            </h3>
          )}

        {this.state.showTabla && (
          <div>
            {["GTE", "APR", "GTEF"].includes(this.state.user?.rol?.codigo) && (
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
                  <Col md={7}>
                    <span>* Los importes cargados son en USD Dolares</span>
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
                          <strong> Total: </strong>{" "}
                        </Col>
                        <Col md={4}>
                          {" "}
                          <span
                            style={{ width: "100%", textAlignment: "right" }}
                          >
                            USD{" "}
                            {NumberFormat(this.state.totalReal, 0, ",", ".")}{" "}
                          </span>{" "}
                        </Col>
                      </Row>
                    </div>

                    <DataTable
                      data={this.state.data}
                      columns={this.state.columns}
                      striped={true}
                      noDataComponent={"No hay datos"}
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
                  <Col md={3}>
                    <div style={{ marginTop: 50 }}>
                      <Button.Ripple
                        size="sm"
                        outline={true}
                        color="success"
                        onClick={() => {
                          API.saveBonosTrimestralesDistribucion({
                            fecha: this.state.fecha,
                            empleados: this.state.data,
                          }).then(response => {
                            if (response.status){
                              toast.success(
                                "Se cargaron correctamente los bonos!",
                                { transition: Flip }
                              );
                            }
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faSave} size={"2x"} /> Guardar
                      </Button.Ripple>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default TablaDistribucionBonosTrimestrales;
