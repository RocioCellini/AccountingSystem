import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { COLORS } from "../../../utility/utils";
import Select from "react-select";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input";
import React, { useEffect, useState } from "react";
import API from "../../../api";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import { Flip, toast } from "react-toastify";
import moment from 'moment';

const DatosPersonales = (props) => {
  const [loading, setLoading] = useState(false);
  const [empleado, setEmpleado] = useState([]);
  const [user, setUser] = useState([]);
  const [errores, setErrores] = useState([]);
  const [subsegmentos, setSubsegmentos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [padres, setPadres] = useState([]);
  const [llaves, setLlaves] = useState([]);
  const [comboGerente, setComboGerente] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const storedDate = localStorage.getItem("selectedDate");
    if (storedDate) {
      setSelectedDate(storedDate);
    } else {
      if (empleado.fecha_ingreso) {
        const fechaIngresoMoment = moment(empleado.fecha_ingreso, "DD/MM/YYYY");
        const antiguedadReconocidaFormatted = fechaIngresoMoment.format("YYYY-MM-DD");
        setSelectedDate(antiguedadReconocidaFormatted);
      }
    }
  }, [empleado.fecha_ingreso]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    localStorage.setItem("selectedDate", newDate)
  };
  


  const handleSelectChange = (selected) => {
    setComboGerente(selected);
    setEmpleado({
      ...empleado,
      padre_id: selected?.value,
      padre: selected?.obj ?? [],
    });
  };
  useEffect(() => {
    API.getGerente().then((response) => {
      setPadres(
        response.data.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });
    API.getEmpresas().then((response) => {
      setEmpresas(
        response.data.empresas.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getPuestos().then((response) => {
      setPuestos(
        response.data.puestos.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getSectores().then((response) => {
      setSectores(
        response.data.sectores.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getSubsegmentos().then((response) => {
      setSubsegmentos(
        response.data.subsegmentos.map((e, i) => ({
          label: e.codigo,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getLlavesDistribucion().then((response) => {
      setLlaves(
        response.data.llaves.map((e, i) => ({
          label: e.descripcion,
          value: e.id,
          obj: e,
        }))
      );
    });

    API.getInfo().then((response) => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    setEmpleado({
      ...props.empleado,
      es_comercial: parseInt(props.empleado.es_comercial),
      repite_bono_semestral: parseInt(props.empleado.repite_bono_semestral),
      fecha_ingreso: props.empleado.fecha_ingreso_string,
      fecha_nacimiento: props.empleado.fecha_nacimiento_string,
      fecha_baja: props.empleado.fecha_baja_string,
    });
    if (empleado)
      setComboGerente({
        label: props.empleado?.padre?.name,
        value: props.empleado?.padre?.id,
        obj: props.empleado,
      });
  }, [props]);

  const save = () => {
    setErrores([]);
    setLoading(true);
    const { padre, ...empleadoData } = empleado;
    API.saveEmpleado(empleadoData).then((response) => {
      setLoading(false);
      if (response.error) {
        setErrores(response.data);
      } else {
        toast.success("Cambios realizados!", { transition: Flip });
      }
    });
  };

  return (
    <Card>
      <CardBody>
        <Row style={{ marginBottom: 20 }}>
          <Col md={12}>
            <h1 style={{ color: COLORS.SECONDARY }}>Datos Personales</h1>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Nombre:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                value={empleado.nombre_apellido}
                disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                onChange={(e) =>
                  setEmpleado({ ...empleado, nombre_apellido: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.nombre_apellido?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>DNI:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                disabled={true}
                value={empleado.documento}
                onChange={(e) =>
                  setEmpleado({ ...empleado, documento: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.documento?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Titulo Puesto:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                value={empleado.titulo_puesto}
                onChange={(e) =>
                  setEmpleado({ ...empleado, titulo_puesto: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.titulo_puesto?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}># Bejerman:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                value={empleado.legajo_bejerman}
                disabled={true}
                onChange={(e) =>
                  setEmpleado({ ...empleado, legajo_bejerman: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.legajo_bejerman?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}># SUN:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                value={empleado.legajo_sun}
                disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                onChange={(e) =>
                  setEmpleado({ ...empleado, legajo_sun: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.legajo_sun?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Subsegmento:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                options={subsegmentos}
                style={{ marginTop: 5 }}
                value={{
                  label: empleado?.subsegmento?.descripcion,
                  value: empleado?.subsegmento?.id,
                  obj: {},
                }}
                onChange={(e) => {
                  setEmpleado({
                    ...empleado,
                    subsegmento_id: e?.value,
                    subsegmento: e?.obj ?? [],
                  });
                }}
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.empresa_id?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Plan Osde:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                options={[
                  { label: "Osde 210", value: "Osde 210" },
                  { label: "Osde 310", value: "Osde 310" },
                  { label: "Osde 410", value: "Osde 410" },
                ]}
                style={{ marginTop: 5 }}
                value={{
                  label: empleado?.plan_osde,
                  value: empleado?.plan_osde,
                  obj: {},
                }}
                onChange={(e) => {
                  setEmpleado({ ...empleado, plan_osde: e?.value });
                }}
              />
              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.plan_osde?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Fecha Nacimiento:</Label>
              <InputMask
                className="form-control"
                mask="99/99/9999"
                style={{ textAlign: "right" }}
                placeholder={"DD/MM/YYYY"}
                disabled={true}
                value={empleado.fecha_nacimiento}
                onChange={(e) =>
                  setEmpleado({ ...empleado, fecha_nacimiento: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.fecha_nacimiento?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Fecha ingreso:</Label>
              <InputMask
                className="form-control"
                mask="99/99/9999"
                style={{ textAlign: "right" }}
                disabled={true}
                placeholder={"DD/MM/YYYY"}
                value={empleado.fecha_ingreso}
                onChange={(e) =>
                  setEmpleado({ ...empleado, fecha_ingreso: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.fecha_ingreso?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Ant. Reconocida:</Label>
              <Input
                type="date"
                style={{ marginTop: 5 }}
                value={selectedDate }
                onChange={handleDateChange}
                disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
              />
              <span style={{ color: COLORS.ERROR }}>
                {errores?.fecha_ingreso?.[0]}
              </span>
            </FormGroup>
          </Col>
        </Row>

        <Row style={{ zIndex: 1000 }}>
          <Col md={8}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>Empresa:</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    options={empresas}
                    menuPosition={"static"}
                    style={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 5 }),
                    }}
                    value={{
                      label: empleado?.empresa?.descripcion,
                      value: empleado?.empresa?.id,
                      obj: {},
                    }}
                    onChange={(e) => {
                      setEmpleado({
                        ...empleado,
                        empresa_id: e?.value,
                        empresa: e?.obj ?? [],
                      });
                    }}
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.empresa_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>Puesto:</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    options={puestos}
                    style={{ marginTop: 5 }}
                    value={{
                      label: empleado?.puesto?.descripcion,
                      value: empleado?.puesto?.id,
                      obj: {},
                    }}
                    onChange={(e) => {
                      setEmpleado({
                        ...empleado,
                        puesto_id: e?.value,
                        puesto: e?.obj ?? [],
                      });
                    }}
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.puesto_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>Sector:</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    options={sectores}
                    style={{ marginTop: 5 }}
                    value={{
                      label: empleado?.sector?.descripcion,
                      value: empleado?.sector?.id,
                      obj: {},
                    }}
                    onChange={(e) => {
                      setEmpleado({
                        ...empleado,
                        sector_id: e?.value,
                        sector: e?.obj ?? [],
                      });
                    }}
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.sector_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>
                    Llave Distribución:
                  </Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    options={llaves}
                    style={{ marginTop: 5 }}
                    value={{
                      label: empleado?.llave_distribucion?.descripcion,
                      value: empleado?.llave_distribucion?.id,
                      obj: {},
                    }}
                    onChange={(e) => {
                      setEmpleado({
                        ...empleado,
                        llave_distribucion_id: e?.value,
                        llave_distribucion: e?.obj ?? [],
                      });
                    }}
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.sector_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>Tipo Empleado:</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    options={[
                      { label: "Regular", value: "R" },
                      { label: "Jubilado", value: "J" },
                      { label: "Director", value: "D" },
                    ]}
                    style={{ marginTop: 5 }}
                    value={
                      empleado?.tipo_empleado == "J"
                        ? { label: "Jubilado", value: "J" }
                        : empleado?.tipo_empleado == "D"
                        ? { label: "Director", value: "D" }
                        : { label: "Regular", value: "R" }
                    }
                    onChange={(e) => {
                      setEmpleado({ ...empleado, tipo_empleado: e?.value });
                    }}
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.sector_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={9}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>Gerente:</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    options={padres}
                    style={{ marginTop: 5 }}
                    value={comboGerente}
                    onChange={handleSelectChange}
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.padre_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label style={{ fontWeight: "bold" }}>
                    Bonos Semestrales:
                  </Label>
                  <CurrencyInput
                    style={{ textAlign: "right" }}
                    className="form-control"
                    precision={0}
                    selectAllOnFocus={true}
                    disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    value={empleado.bono_semestral}
                    onChange={(e) =>
                      setEmpleado({
                        ...empleado,
                        bono_semestral: e
                          .replaceAll("$", "")
                          .replaceAll(".", "")
                          .replaceAll(",", "."),
                      })
                    }
                  />

                  <span style={{ color: COLORS.ERROR }}>
                    {" "}
                    {errores?.padre_id?.[0]}{" "}
                  </span>
                </FormGroup>
              </Col>
            </Row>
          </Col>

          {empleado.id && (
            <Col md={4}>
              <Row>
                <Col md={12} style={{ marginTop: 10 }}>
                  <label htmlFor="">Repite Bono Semestral</label>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={20} />}
                    defaultChecked={empleado.repite_bono_semestral}
                    disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                    label={empleado.repite_bono_semestral ? "Si" : "No"}
                    size="lg"
                    onChange={(e) => {
                      setEmpleado({
                        ...empleado,
                        repite_bono_semestral: e.target.checked,
                      });
                    }}
                  />
                </Col>

                {empleado.id && (
                  <Col md={12} style={{ marginTop: 10 }}>
                    <label htmlFor="">Es Oficial de Cuenta</label>
                    <Checkbox
                      color="primary"
                      icon={<Check className="vx-icon" size={20} />}
                      defaultChecked={empleado.es_comercial}
                      disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                      label={empleado.es_comercial ? "Si" : "No"}
                      size="lg"
                      onChange={(e) => {
                        setEmpleado({
                          ...empleado,
                          es_comercial: e.target.checked,
                        });
                      }}
                    />
                  </Col>
                )}
                <Col md={12}>
                  <Row>
                    {empleado.id && (
                      <Col md={6} style={{ marginTop: 10 }}>
                        <label htmlFor="">Es Baja</label>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={20} />}
                          defaultChecked={empleado.es_baja}
                          disabled={!["RRHH", "SU"].includes(user?.rol?.codigo)}
                          label={empleado.es_baja ? "Si" : "No"}
                          size="lg"
                          onChange={(e) => {
                            setEmpleado({
                              ...empleado,
                              es_baja: e.target.checked,
                            });
                          }}
                        />
                      </Col>
                    )}

                    {empleado.id && empleado.es_baja && (
                      <Col md={6} style={{ marginTop: 10 }}>
                        <FormGroup>
                          <Label style={{ fontWeight: "bold" }}>
                            Fecha Baja:
                          </Label>
                          <InputMask
                            className="form-control"
                            mask="99/99/9999"
                            style={{ textAlign: "right" }}
                            disabled={
                              !["RRHH", "SU"].includes(user?.rol?.codigo)
                            }
                            placeholder={"DD/MM/YYYY"}
                            value={empleado.fecha_baja}
                            onChange={(e) =>
                              setEmpleado({
                                ...empleado,
                                fecha_baja: e.target.value,
                              })
                            }
                          />

                          <span style={{ color: COLORS.ERROR }}>
                            {" "}
                            {errores?.fecha_baja?.[0]}{" "}
                          </span>
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </Col>
          )}
        </Row>

        {["RRHH", "SU"].includes(user?.rol?.codigo) && (
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
        )}
      </CardBody>
    </Card>
  );
};

export default DatosPersonales;
