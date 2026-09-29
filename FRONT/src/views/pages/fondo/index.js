import React, { useEffect, useState } from "react";
import { COLORS } from "../../../utility/utils";
import API from "./../../../api";
import {
  Input,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { Flip, toast } from "react-toastify";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import Oficiales from "./Oficiales";

const Index = props => {
  const [fondo, setFondo] = useState([]);
  const [fondos, setFondos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.getInfo().then(response => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    API.getFondos().then(response => {
      setFondos(
        response.data.fondos.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });
    API.getFondo(props.match.params.id).then(response => {
      setFondo(response.data.fondo);
    });
  }, [props]);

  const save = () => {
    setErrores([]);
    setLoading(true);
    API.saveFondo(fondo).then(response => {
      setLoading(false);
      if (response.error) {
        setErrores(response.error);
      } else {
        toast.success("Cambios realizados!", { transition: Flip });
      }
    });
  };

  const attachOficial = data => {
    setErrores([]);
    setLoading(true);
    API.attachFondoOficial(data).then(response => {
      setLoading(false);
      if (response.error) {
        setErrores(response.error);
      } else {
        toast.success("Cambios realizados!", { transition: Flip });
        setFondo(response.data.fondo);
      }
    });
  };

  const dettachOficial = data => {
    setErrores([]);
    setLoading(true);
    API.dettachFondoOficial(data).then(response => {
      setLoading(false);
      if (response.error) {
        setErrores(response.error);
      } else {
        toast.success("Cambios realizados!", { transition: Flip });
        setFondo(response.data.fondo);
      }
    });
  };

  return (
    <div>
      <Card>
        <CardBody>
          <Row style={{ marginBottom: 20 }}>
            <Col md={12}>
              <h1 style={{ color: COLORS.SECONDARY }}>Datos del Fondo</h1>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Row style={{ marginBottom: 10 }}>
                <Col md={12}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Numero:</Label>
                    <Input
                      type="text"
                      style={{ marginTop: 5 }}
                      value={fondo.numero_fondo}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row style={{ marginBottom: 10 }}>
                <Col md={12}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Descripcion:</Label>
                    <Input
                      type="text"
                      style={{ marginTop: 5 }}
                      value={fondo.descripcion}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row style={{ marginBottom: 10 }}>
                <Col md={6}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Abreviatura:</Label>
                    <Input
                      type="text"
                      style={{ marginTop: 5 }}
                      value={fondo.abreviatura}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>Moneda:</Label>
                    <Input
                      type="text"
                      style={{ marginTop: 5 }}
                      value={fondo.moneda}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          {fondo.id && (
            <Row>
              <Col md={12}>
                <label htmlFor="" style={{ fontWeight: "bold" }}>
                  Es Fondo Dedicado?
                </label>
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={20} />}
                  defaultChecked={fondo.es_dedicado}
                  label={fondo.es_dedicado ? "Si" : "No"}
                  size="lg"
                  onChange={e => {
                    setFondo({ ...fondo, es_dedicado: e.target.checked });
                    API.setEsDedicado({
                      id: fondo.id,
                      es_dedicado: e.target.checked,
                    }).then(response => {
                      setFondo(response.data.fondo);
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {fondo.es_dedicado && (
            <Row>
              <Col md={12}>
                <Oficiales
                  fondo={fondo}
                  oficiales={fondo.oficiales ?? []}
                  attachOficial={attachOficial}
                  dettachOficial={dettachOficial}
                />
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
