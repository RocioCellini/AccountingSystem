import React, { useEffect, useState } from "react";
import { COLORS } from "../../../utility/utils";
import API from "./../../../api";
import {
  Button,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  Badge,
  ModalBody,
  FormGroup,
  Label,
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "flatpickr/dist/themes/light.css";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input";
import { useDispatch } from "react-redux";
import { setAltas } from "../../../redux/actions/novedades";
import { Check } from "react-feather";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";

const ModalAlta = (props) => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empleado, setEmpleado] = useState([]);
  const [files, setFiles] = useState([]);

  const [empresas, setEmpresas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [padres, setPadres] = useState([]);
  const [subsegmentos, setSubsegmentos] = useState([]);
  const [llaves, setLlaves] = useState([]);
  const [errores, setErrores] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
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
          label: e.descripcion,
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

    API.getEmpleados(true).then((response) => {
      setPadres(
        response.data.empleados.map((e, i) => ({
          label: e.nombre_apellido,
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
      fecha_ingreso: props.empleado.fecha_ingreso_string,
      fecha_nacimiento: props.empleado.fecha_nacimiento_string,
    });
  }, [props?.empleado?.id]);

  const save = () => {
    setErrores([]);
    setLoading(true);

    API.saveAlta({ ...empleado, archivos: files })
      .then((response) => {
        setLoading(false);

        if (response.status === 422) {
          setErrores(response.data);
        } else {
          API.getAltas().then((altasResponse) => {
            props.setShow(!props.show);
            props.callbackAltas(altasResponse.data.altas);
            let total = 0;
            altasResponse.data.altas.map((e) => {
              if (e?.estado?.codigo === "PEN") {
                total += 1;
              }
            });
            dispatch(setAltas(total));
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error al guardar el alta:", error);
      });
  };

  const pasarANomina = () => {
    setErrores([]);
    setLoading(true);
    API.pasarANomina({ ...empleado, archivos: files }).then((response) => {
      setLoading(false);
      if (response.error) {
        setErrores(response.error);
      } else {
        props.setShow(!props.show);
        props.callbackAltas(response.data.altas);
      }
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (event) => {
    var promise = Promise.resolve();
    let selectedFile = event.target.files;
    let file = null;
    let fileName = "";
    if (selectedFile.length > 0) {
      let fileToLoad = selectedFile[0];
      fileName = fileToLoad.name;
      let fileReader = new FileReader();
      file = await toBase64(fileToLoad).catch((e) => Error(e));
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
    setFiles([...files, { file: file, name: fileName }]);
  };

  return (
    <Modal
      isOpen={props.show}
      toggle={() => {
        props.setShow(!props.show);
      }}
      className="modal-dialog-centered modal-xl"
    >
      <ModalHeader
        toggle={() => {
          props.setShow(!props.show);
        }}
        className={
          !empleado?.estado?.codigo ||
          empleado?.estado?.codigo == "PEN" ||
          empleado?.estado?.codigo == "ING"
            ? "bg-primary"
            : empleado?.estado?.codigo == "REC"
            ? "bg-danger"
            : "bg-success"
        }
      >
        {empleado.id && (
          <span>
            Modificar Alta # {empleado.id} - {empleado.nombre}{" "}
          </span>
        )}
        {!empleado.id && <span>Nueva Alta </span>}
      </ModalHeader>
      <ModalBody>
        {empleado?.estado?.codigo && (
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md={12}>
              <Badge
                color={
                  empleado?.estado?.codigo == "PEN"
                    ? "light-warning"
                    : empleado?.estado?.codigo == "REC"
                    ? "light-danger"
                    : "light-success"
                }
                className="badge-lg"
              >
                {empleado?.estado?.descripcion}
              </Badge>
            </Col>
          </Row>
        )}

        <Row>
          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Nombre:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                value={empleado.nombre}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
                onChange={(e) =>
                  setEmpleado({ ...empleado, nombre: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.nombre?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Apellido:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                value={empleado.apellido}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
                onChange={(e) =>
                  setEmpleado({ ...empleado, apellido: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.apellido?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>DNI:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
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
              <Label style={{ fontWeight: "bold" }}>Título Puesto:</Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
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
              <Label style={{ fontWeight: "bold" }}>Plan Osde:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                options={[
                  { label: "Osde 210", value: "Osde 210" },
                  { label: "Osde 310", value: "Osde 310" },
                  { label: "Osde 410", value: "Osde 410" },
                ]}
                style={{ marginTop: 5 }}
                isDisabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
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

          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Fecha Nacimiento:</Label>
              <InputMask
                className="form-control"
                mask="99/99/9999"
                style={{ textAlign: "right" }}
                placeholder={"DD/MM/YYYY"}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
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

          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Fecha ingreso:</Label>
              <InputMask
                className="form-control"
                mask="99/99/9999"
                style={{ textAlign: "right" }}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
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
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Empresa:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                isDisabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo == "APR" ||
                    empleado?.estado?.codigo == "ING")
                }
                options={empresas}
                style={{ marginTop: 5 }}
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
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Puesto:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                isDisabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo === "APR" ||
                    empleado?.estado?.codigo === "ING")
                }
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
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Sector:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                isDisabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo === "APR" ||
                    empleado?.estado?.codigo === "ING")
                }
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
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Sueldo Bruto:</Label>
              <CurrencyInput
                style={{ textAlign: "right" }}
                className="form-control"
                precision={0}
                prefix={"$"}
                selectAllOnFocus={true}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo === "APR" ||
                    empleado?.estado?.codigo === "ING")
                }
                decimalSeparator={","}
                thousandSeparator={"."}
                value={empleado.sueldo_bruto}
                onChange={(e) =>
                  setEmpleado({
                    ...empleado,
                    sueldo_bruto: e
                      .replaceAll("$", "")
                      .replaceAll(".", "")
                      .replaceAll(",", "."),
                  })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.sueldo_bruto?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Bono Semestrales:</Label>
              <CurrencyInput
                style={{ textAlign: "right" }}
                className="form-control"
                precision={0}
                selectAllOnFocus={true}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo === "APR" ||
                    empleado?.estado?.codigo === "ING")
                }
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
                {errores?.bono_semestral?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Días Vacaciones:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo === "APR" ||
                    empleado?.estado?.codigo === "ING")
                }
                options={[
                  { value: 14, label: "14 Días" },
                  { value: 21, label: "21 Días" },
                  { value: 28, label: "28 Días" },
                  { value: 35, label: "35 Días" },
                ]}
                style={{ marginTop: 5 }}
                value={
                  empleado.dias_vacaciones
                    ? {
                        label: empleado?.dias_vacaciones + " Dias",
                        value: empleado.dias_vacaciones,
                      }
                    : {}
                }
                onChange={(e) => {
                  setEmpleado({ ...empleado, dias_vacaciones: e?.value });
                }}
              />
              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.dias_vacaciones?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>Reporta a:</Label>
              <Select
                className="React"
                classNamePrefix="select"
                isSearchable={true}
                isClearable={true}
                isDisabled={
                  user?.rol?.codigo === "GTE" ||
                  user?.rol?.codigo === "GTEF" ||
                  (empleado?.estado?.codigo &&
                    (empleado?.estado?.codigo === "APR" ||
                      empleado?.estado?.codigo === "ING"))
                }
                options={padres}
                style={{ marginTop: 5 }}
                value={
                  padres.find((e) => e.value == empleado?.padre_id) ?? {
                    label: empleado?.padre?.nombre_apellido,
                    value: empleado?.padre?.id,
                    obj: {},
                  }
                }
                onChange={(e) => {
                  setEmpleado({
                    ...empleado,
                    padre_id: e?.value,
                    padre: e?.obj ?? [],
                  });
                }}
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.padre_id?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label style={{ fontWeight: "bold" }}>
                Consultora (En caso de que se haya utilizado una):
              </Label>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                disabled={
                  empleado?.estado?.codigo &&
                  (empleado?.estado?.codigo === "APR" ||
                    empleado?.estado?.codigo === "ING")
                }
                value={empleado.consultora}
                onChange={(e) =>
                  setEmpleado({ ...empleado, consultora: e.target.value })
                }
              />

              <span style={{ color: COLORS.ERROR }}>
                {" "}
                {errores?.consultora?.[0]}{" "}
              </span>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Input
              type="file"
              required
              onChange={(event) => handleFileChange(event)}
            />
            <br />
          </Col>
          <Col md={8}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 17,
                color: COLORS.SECONDARY,
              }}
            >
              {" "}
              Archivos de Respaldo{" "}
            </span>

            {empleado?.archivos?.map((e, i) => {
              return (
                <Row>
                  <Col md={12}>
                    <a href={e.path} target="_blank">
                      {e.nombre}
                    </a>
                  </Col>
                </Row>
              );
            })}

            {files.map((e, i) => {
              return (
                <Row>
                  <Col md={12}>
                    <span>{e.name}</span>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter>
        {!(
          empleado?.estado?.codigo &&
          (empleado?.estado?.codigo === "APR" ||
            empleado?.estado?.codigo === "ING")
        ) && (
          <Button
            color="primary"
            onClick={() => {
              save();
            }}
            disabled={loading}
          >
            Guardar
          </Button>
        )}

        {empleado?.estado?.codigo === "APR" &&
          ["RRHH", "SU"].includes(user?.rol?.codigo) && (
            <div>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}>
                      Llave Distriucion:
                    </Label>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      isSearchable={true}
                      isClearable={true}
                      options={llaves}
                      style={{ marginTop: 5 }}
                      onChange={(e) =>
                        setEmpleado({
                          ...empleado,
                          llave_distribucion_id: e.value,
                        })
                      }
                    />
                    <span style={{ color: COLORS.ERROR }}>
                      {" "}
                      {errores?.sector_id?.[0]}{" "}
                    </span>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label style={{ fontWeight: "bold" }}># BEJERMAN:</Label>
                    <Input
                      type="text"
                      placeholder={"Legajo Bejerman"}
                      style={{ marginTop: 5 }}
                      onChange={(e) =>
                        setEmpleado({
                          ...empleado,
                          legajo_bejerman: e.target.value,
                        })
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
                      placeholder={"Legajo Sun"}
                      style={{ marginTop: 5 }}
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
              </Row>
              <Row>
                <Col md={3}>
                  <Label style={{ fontWeight: "bold" }}>SUBSEGMENTO:</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    options={subsegmentos}
                    style={{ marginTop: 5 }}
                    value={{
                      label: empleado?.subsegmento?.codigo,
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
                </Col>
                <Col md={3}>
                  <Label style={{ fontWeight: "bold" }}>ES COMERCIAL?:</Label>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={20} />}
                    defaultChecked={empleado?.es_comercial}
                    label={empleado?.es_comercial ? "Si" : "No"}
                    size="lg"
                    onChange={(e) => {
                      setEmpleado({
                        ...empleado,
                        es_comercial: e.target.checked,
                      });
                    }}
                  />
                </Col>
                <Col md={3}>
                  <br />
                  <Button
                    color="warning"
                    onClick={() => {
                      pasarANomina();
                    }}
                    disabled={loading}
                  >
                    Pasar a Nomina
                  </Button>
                </Col>
              </Row>
            </div>
          )}

        {empleado?.estado?.codigo == "PEN" &&
          (user?.rol?.codigo == "APR" || user?.rol?.codigo == "RRHH") && (
            <div>
              <Button
                style={{ margin: 2 }}
                color="success"
                onClick={() => {
                  setLoading(true);
                  API.aprobarRechazarAlta({
                    id: empleado.id,
                    estado: true,
                  }).then((response) => {
                    setLoading(false);
                    props.setShow(!props.show);
                    props.callbackAltas(response.data.altas);
                  });
                }}
                disabled={loading}
              >
                Aprobar
              </Button>

              <Button
                style={{ margin: 2 }}
                color="danger"
                onClick={() => {
                  setLoading(true);
                  API.aprobarRechazarAlta({
                    id: empleado.id,
                    estado: false,
                  }).then((response) => {
                    setLoading(false);
                    props.setShow(!props.show);
                    props.callbackAltas(response.data.altas);
                  });
                }}
                disabled={loading}
              >
                Rechazar
              </Button>
            </div>
          )}
      </ModalFooter>
    </Modal>
  );
};

export default ModalAlta;
