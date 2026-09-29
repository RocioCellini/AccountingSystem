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
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
} from "reactstrap";

import { NumberFormat } from "../../../helpers/numberFormat";
import {
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import { toast,  Flip} from "react-toastify";

const Index = props => {
  const [user, setUser] = useState([]);
  const [llaves, setLlaves] = useState([]);
  const [data, setData] = useState([]);
  const [buscador, setBuscador] = useState("");
  const [columns, setColumns] = useState([]);
  const [show, setShow] = useState(false);
  const [llave, setLlave] = useState([]);
  const [centros, setCentros] = useState([]);
  const [draft, setDraft] = useState([]);

  useEffect(() => {
    API.getLlavesDistribucion().then(response => {
      setLlaves(response.data.llaves);
      setData(
        response.data.llaves.map(e => ({
          ...e,
          obj: JSON.stringify(e),
        }))
      );
    });

    API.getCentrosCosto().then(response => {
      setCentros(
        response.data.centros.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getInfo().then(response => {
      setUser(response.data);
      setColumns([
        { name: "Nombre", selector: "descripcion", wrap: true },
        {
          name: "Centros de Costo",
          wrap: true,
          cell: row => (
            <span>
              {row.distribucion.map((e, i) => {
                return (
                  <Col md={12}>
                    {e?.centro_costo?.descripcion} (
                    {NumberFormat(e?.porcentaje, 2, ",", ".")} %)
                  </Col>
                );
              })}
            </span>
          ),
        },
        {
          name: "Accion",
          width: "8%",
          cell: row => (
            <Button.Ripple
              size="sm"
              color="primary"
              onClick={() => {
                let element = {
                  descripcion: row.descripcion,
                  id: row.id,
                  distribucion: [],
                };
                row.distribucion.map((e, i) => {
                  element.distribucion[e.centro_costo.id] = e;
                });

                setLlave(element);
                setShow(true);
              }}
            >
              <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faLink} />
            </Button.Ripple>
          ),
        },
      ]);
    });
  }, []);

  useEffect(() => {
    if (buscador == "") {
      setData(
        llaves.map(e => ({
          ...e,
          obj: JSON.stringify(e),
        }))
      );
    } else {
      let response = [];
      llaves.map((e, i) => {
        if (
          (e?.descripcion ?? "").toUpperCase().includes(buscador.toUpperCase())
        ) {
          response.push(e);
        }
      });
      setData(
        response.map(e => ({
          ...e,
          obj: JSON.stringify(e),
        }))
      );
    }
  }, [buscador]);

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
            Llaves de Distribucion
          </span>

          <Input
            type="text"
            placeholder="Buscador"
            style={{
              width: 300,
              borderRadius: 10,
              marginLeft: 30,
              marginRight: 30,
            }}
            value={buscador}
            onChange={e => setBuscador(e.target.value)}
          />

          <Button.Ripple
            size="md"
            color="primary"
            onClick={() => {
              setShow(true);
              setLlave({ distribucion: [] });
            }}
          >
            <span style={{ fontSize: 20 }}>Agregar Llave</span>
          </Button.Ripple>
        </Col>
      </Row>

      <Card style={{ marginTop: 30 }}>
        <CardBody>
          <Row>
            <Col md={12}>
              <DataTable
                data={data}
                columns={columns}
                pagination
                striped={true}
                noDataComponent={"No hay datos"}
                customStyles={customStyles}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal
        isOpen={show}
        toggle={() => {
          setShow(!show);
        }}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          toggle={() => {
            setShow(!show);
          }}
          className="bg-primary"
        >
          <span>Llave de Distribucion </span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label style={{ fontWeight: "bold" }}>Descripcion:</Label>
                <Input
                  type="text"
                  style={{ marginTop: 5 }}
                  value={llave?.descripcion}
                  onChange={e =>
                    setLlave({ ...llave, descripcion: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col md={7}>
              <FormGroup>
                <Label style={{ fontWeight: "bold" }}>Centro Costo:</Label>
                <Select
                  className="React"
                  classNamePrefix="select"
                  isSearchable={true}
                  isClearable={true}
                  options={centros}
                  style={{ marginTop: 5 }}
                  onChange={e => {
                    setDraft({ ...draft, centro_costo: e?.obj });
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <Label style={{ fontWeight: "bold" }}>% Porcentaje</Label>
              <CurrencyInput
                style={{ textAlign: "right" }}
                className="form-control"
                precision={2}
                decimalSeparator={","}
                thousandSeparator={"."}
                value={parseFloat(draft?.porcentaje)}
                onChange={(e, name) => {
                  let porcentaje = parseFloat(
                    e
                      .replaceAll("$", "")
                      .replaceAll(".", "")
                      .replaceAll(",", ".")
                  );
                  setDraft({ ...draft, porcentaje: porcentaje });
                }}
              />
            </Col>
            <Col md={2}>
              <br />
              {(draft.centro_costo ?? "").toString() != "" &&
                (draft.porcentaje ?? 0) != 0 && (
                  <Button
                    color="primary"
                    size={"sm"}
                    onClick={() => {
                      let distr = llave.distribucion;
                      distr[draft.centro_costo.id] = {
                        centro_costo: draft.centro_costo,
                        porcentaje: draft.porcentaje,
                      };
                      setLlave({ ...llave, distribucion: distr });
                      setDraft([]);
                    }}
                  >
                    Agregar
                  </Button>
                )}
            </Col>
          </Row>

          {(llave?.distribucion ?? []).length > 0 && (
            <Row style={{ marginTop: 15 }}>
              <Col md={12}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: COLORS.PRIMARY_DARKER,
                  }}
                >
                  Distribucion
                </span>
              </Col>
            </Row>
          )}
          {(llave?.distribucion ?? []).length > 0 && (
            <Row style={{ marginTop: 15 }}>
              {llave.distribucion.map((e, i) => {
                return (
                  <Col md={12}>
                    {e?.centro_costo?.descripcion} (
                    {NumberFormat(e?.porcentaje, 2, ",", ".")} %)
                  </Col>
                );
              })}
            </Row>
          )}

          {(llave?.distribucion ?? []).length > 0 && (
            <Row style={{ marginTop: 15 }}>
              <Col md={12}>
                <Button
                  color="success"
                  size={"sm"}
                  onClick={() => {
                    if ((llave?.descripcion ?? "").toString() == "") {
                      toast.error("La descripcion es obligatoria!", {
                        transition: Flip,
                      });
                    } else if (
                      (llave?.descripcion ?? "").toString().length >= 20
                    ) {
                      toast.error("La descripcion es muy larga!", {
                        transition: Flip,
                      });
                    } else {
                      var total = parseFloat(0);
                      (llave?.distribucion ?? []).map((e, i) => {
                        total += parseFloat(e.porcentaje);
                      });

                      if (total != 100) {
                        toast.error("Debe sumar 100% la distribucion", {
                          transition: Flip,
                        });
                      } else {
                        toast.warn("Procesando..., aguarde!", {
                          transition: Flip,
                          autoClose: false,
                        });
                        API.saveLlaveDistribucion(llave).then(response => {
                          toast.dismiss();
                          toast.success("Exito!", { transition: Flip });
                          setLlave([]);
                          setShow(false);
                          setLlaves(response.data.llaves);
                          setData(
                            response.data.llaves.map(e => ({
                              ...e,
                              obj: JSON.stringify(e),
                            }))
                          );
                        });
                      }
                    }
                  }}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Index;
