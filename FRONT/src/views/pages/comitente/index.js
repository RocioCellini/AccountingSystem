import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import Select from "react-select";
import CurrencyInput from "react-currency-input";
import { Flip, toast } from "react-toastify";


const Index = props => {
  const [comitente, setComitente] = useState([]);
  const [oficiales, setOficiales] = useState([]);
  const [errores, setErrores] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.getInfo().then(response => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    API.getComitente(props.match.params.id).then(response => {
      setOficiales(
        response.data.oficiales.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
      setComitente(response.data.comitente);
    });
  }, [props]);

  const save = () => {
    setErrores([]);
    setLoading(true);
    API.saveComitente(comitente).then(response => {
      setLoading(false);
      if (response.error) {
        setErrores(response.error);
      } else {
        toast.success("Cambios realizados!", { transition: Flip });
      }
    });
  };

  return (
    <div>
      <Card>
        <CardBody>
          <Row style={{ marginBottom: 20 }}>
            <Col md={12}>
              <h1 style={{ color: COLORS.SECONDARY }}>Datos del Comitente</h1>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Row style={{ marginBottom: 10 }}>
                <Col md={12}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}># Comitente:</Label>
                    <Input
                      type="text"
                      style={{ marginTop: 5 }}
                      value={comitente.numero_comitente}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row style={{ marginBottom: 10 }}>
                <Col md={12}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Nombre:</Label>
                    <Input
                      type="text"
                      style={{ marginTop: 5 }}
                      value={comitente.descripcion}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row style={{ marginBottom: 10 }}>
                <Col md={12}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Oficial:</Label>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      isSearchable={true}
                      isClearable={true}
                      options={oficiales}
                      style={{ marginTop: 5 }}
                      value={{
                        label: comitente?.oficial?.descripcion,
                        value: comitente?.oficial?.id,
                        obj: {},
                      }}
                      onChange={e => {
                        setComitente({
                          ...comitente,
                          oficial_id: e?.value,
                          oficial: e?.obj ?? [],
                        });
                      }}
                    />

                    <span style={{ color: COLORS.ERROR }}>
                      {" "}
                      {errores?.oficial_id?.[0]}{" "}
                    </span>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>
                      % a considerar:
                    </Label>
                    <CurrencyInput
                      style={{ textAlign: "right" }}
                      className="form-control"
                      precision={2}
                      decimalSeparator={","}
                      thousandSeparator={"."}
                      value={parseFloat(comitente?.porcentaje)}
                      onChange={(e, name) => {
                        setComitente({
                          ...comitente,
                          porcentaje: e
                            .replaceAll("$", "")
                            .replaceAll(".", "")
                            .replaceAll(",", "."),
                        });
                      }}
                    />
                    <span style={{ color: COLORS.ERROR }}>
                      {" "}
                      {errores?.porcentaje?.[0]}{" "}
                    </span>
                  </FormGroup>
                </Col>
              </Row>

              <Row style={{ marginTop: 30 }}>
                <Col md={12}>
                  <Button
                    color="primary"
                    onClick={() => {
                      save();
                    }}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
