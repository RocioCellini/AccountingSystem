import React, { useEffect, useState } from "react";
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
  FormGroup,
  Label,
  Alert,
} from "reactstrap";
import { NumberFormat } from "../../../helpers/numberFormat";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import { Flip, toast } from "react-toastify";

const Index = props => {
  const [user, setUser] = useState([]);
  const [oficial, setOficial] = useState([]);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [empleado, setEmpleado] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [totalAsignado, setTotalAsignado] = useState(0);

  useEffect(() => {
    API.getInfo().then(response => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    var total = 0;
    data.map((e, i) => {
      total += parseFloat(e.porcentaje_base_calculo);
    });

    setTotalAsignado(total);
  }, [data]);

  useEffect(() => {
    setColumns([
      {
        name: "Nombre Apellido",
        wrap: true,
        cell: row => (
          <Link
            to={"/empleados/getone/" + row.empleado.id}
            target="_blank"
            style={{ textDecoration: "underline", color: COLORS.MODERN_BLUE }}
          >
            <span>{row.empleado.nombre_apellido.toUpperCase()}</span>
          </Link>
        ),
      },
      {
        name: "Base Calculo",
        width: "15%",
        wrap: true,
        cell: row => (
          <span>
            {NumberFormat(row.porcentaje_base_calculo, 2, ",", ".")} %
          </span>
        ),
      },
      {
        name: "% Comision",
        width: "15%",
        wrap: true,
        cell: row => <span>{NumberFormat(row.porcentaje, 2, ",", ".")} %</span>,
      },
      {
        name: "Accion",
        width: "15%",
        cell: row => (
          <Button.Ripple
            size="sm"
            color="danger"
            outline={true}
            onClick={() => {
              toast.warn("Procesando..., aguarde!", {
                transition: Flip,
                autoClose: false,
              });
              API.dettachOficial({
                empleado_id: row.empleado.id,
                oficial_id: props.match.params.id,
                origen: "oficial",
              }).then(response => {
                toast.dismiss();
                toast.success("Listo!", { transition: Flip });
                API.getOficial(props.match.params.id).then(response => {
                  setOficial(response.data.oficial);
                  setData(response.data.oficial.empleados);
                });
              });
            }}
          >
            <FontAwesomeIcon style={{ color: COLORS.ERROR }} icon={faTrash} />
          </Button.Ripple>
        ),
      },
    ]);

    API.getEmpleados(false, true).then(response => {
      setEmpleados(
        response.data.empleados.map((e, i) => ({
          label: e.nombre_apellido,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getOficial(props.match.params.id).then(response => {
      setOficial(response.data.oficial);
      setData(response.data.oficial.empleados);
    });
  }, [props.match.params.id]);

  const customStyles = {
    rows: {},
    headCells: {
      style: {
        backgroundColor: COLORS.SECONDARY,
        color: COLORS.WHITE,
        textAlign: "center",
      },
    },
    cells: {},
  };

  return (
    <div>
      <Card>
        <CardBody>
          <Row style={{ marginBottom: 20 }}>
            <Col md={12}>
              <h1 style={{ color: COLORS.SECONDARY }}>Datos del Oficial</h1>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label style={{ fontWeight: "bold" }}>Descripcion:</Label>
                <Input
                  type="text"
                  style={{ marginTop: 5 }}
                  value={oficial?.descripcion}
                  disabled={true}
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label style={{ fontWeight: "bold" }}>Origen:</Label>
                <Input
                  type="text"
                  style={{ marginTop: 5 }}
                  value={oficial?.origen}
                  disabled={true}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label style={{ fontWeight: "bold" }}>Agente Colocador:</Label>
                <Input
                  type="text"
                  style={{ marginTop: 5 }}
                  value={oficial?.agente_colocador_descripcion}
                  disabled={true}
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label style={{ fontWeight: "bold" }}>Sucursal:</Label>
                <Input
                  type="text"
                  style={{ marginTop: 5 }}
                  value={oficial?.sucursal}
                  disabled={true}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {(user?.rol?.codigo == "RRHH" || user?.rol?.codigo == "SU") && (
            <div>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Empleado</Label>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      isSearchable={true}
                      isClearable={true}
                      options={empleados}
                      style={{ marginTop: 5 }}
                      onChange={e => {
                        setEmpleado({ ...empleado, empleado: e?.obj });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <Label style={{ fontWeight: "bold" }}>% Base Calculo</Label>
                  <CurrencyInput
                    style={{ textAlign: "right" }}
                    className="form-control"
                    precision={2}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    value={parseFloat(empleado?.porcentaje_base_calculo)}
                    onChange={(e, name) => {
                      let porcentaje = e
                        .replaceAll("$", "")
                        .replaceAll(".", "")
                        .replaceAll(",", ".");
                      setEmpleado({
                        ...empleado,
                        porcentaje_base_calculo: porcentaje,
                      });
                    }}
                  />
                </Col>
                <Col md={2}>
                  <Label style={{ fontWeight: "bold" }}>% Comisiones</Label>
                  <CurrencyInput
                    style={{ textAlign: "right" }}
                    className="form-control"
                    precision={2}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    value={parseFloat(empleado?.porcentaje)}
                    onChange={(e, name) => {
                      let porcentaje = e
                        .replaceAll("$", "")
                        .replaceAll(".", "")
                        .replaceAll(",", ".");
                      setEmpleado({ ...empleado, porcentaje: porcentaje });
                    }}
                  />
                </Col>
                <Col md={2}>
                  <br />
                  <Button
                      color="success"
                      disabled={false}
                      onClick={() => {
                        toast.warn("Procesando..., aguarde!", {
                          transition: Flip,
                          autoClose: false,
                        });

                        API.attachOficial({
                          empleado_id: empleado?.empleado?.id,
                          oficial_id: oficial.id,
                          porcentaje: empleado?.porcentaje_base_calculo,
                          porcentaje_base_calculo: empleado?.porcentaje,
                          origen: "oficial",
                        }).then(response => {
                          toast.dismiss();
                          toast.success("Listo!", { transition: Flip });

                          API.getOficial(props.match.params.id).then(response => {
                            setOficial(response.data.oficial);
                            setData(response.data.oficial.empleados);
                          });
                          setEmpleado([]);
                        }).catch(error => {
                          toast.dismiss();
                          toast.error("Error al agregar el oficial", {
                            transition: Flip,
                          });
                        });
                      }}
                    >
                      Agregar
                  </Button>
                </Col>
              </Row>

              {totalAsignado !== 100 && (
                <Row>
                  <Col md={12}>
                    <Alert color="danger">
                      Por favor revise las asignaciones, las mismas no suman
                      100%
                    </Alert>
                  </Col>
                </Row>
              )}
            </div>
          )}

          <Row>
            <Col md={12}>
              <DataTable
                data={data}
                columns={columns}
                pagination
                striped={true}
                noDataComponent={"Cargando..."}
                customStyles={customStyles}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
