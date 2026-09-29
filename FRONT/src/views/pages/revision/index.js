import React, { useEffect, useState } from "react";
import { COLORS } from "../../../utility/utils";
import API from "../../../api";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import {toast } from "react-toastify";
import Flatpickr from "react-flatpickr";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "flatpickr/dist/themes/light.css";
import { Check } from "react-feather";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import Select from "react-select";

const Index = () => {
  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [fechaHasta, setFechaHasta] = useState(new Date());
  const [detalleAprobadores, setDetalleAprobadores] = useState(false);
  const [empleadosActivos, setEmpleadosActivos] = useState(true);
  const [empleadosMultinomina, setEmpleadosMultinomina] = useState(true);
  const [empleados, setEmpleados] = useState([]);
  const [empleado, setEmpleado] = useState([]);

  useEffect(() => {
    API.getEmpleados(false).then((response) => {
      setEmpleados(
        response.data.empleados.map((e, i) => ({
          label: e.nombre_apellido,
          value: e.id,
          obj: e,
        }))
      );
    });
  }, []);

  const handleExportar = () => {
    toast.warn(
      "Estamos generando el reporte, le avisaremos apenas esté disponible!"
    );

    let fechaDesdeApi = new Date(fechaDesde);
    let anoDesde = fechaDesdeApi.getFullYear().toString();
    let mesDesde = (fechaDesdeApi.getMonth() + 1).toString();
    mesDesde = mesDesde.length === 1 ? "0" + mesDesde : mesDesde;
    let diaDesde = fechaDesdeApi.getDate().toString();
    diaDesde = diaDesde.length === 1 ? "0" + diaDesde : diaDesde;

    let fechaHastaApi = new Date(fechaHasta);
    let anoHasta = fechaHastaApi.getFullYear().toString();
    let mesHasta = (fechaHastaApi.getMonth() + 1).toString();
    mesHasta = mesHasta.length === 1 ? "0" + mesHasta : mesHasta;
    let diaHasta = fechaHastaApi.getDate().toString();
    diaHasta = diaHasta.length === 1 ? "0" + diaHasta : diaHasta;

    API.getEvolutivos(
      anoDesde + mesDesde + diaDesde,
      anoHasta + mesHasta + diaHasta,
      empleado,
      detalleAprobadores,
      empleadosActivos
    )
      .then((response) => {
        var link = document.createElement("a");
        link.download = "Evolutivo.xls";
        link.href = response.data.ruta;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Listo!");
      })
      .catch(({ response }) => {
        const errorMessage = response?.error;
        setTimeout(() => {
          toast.error(errorMessage);
        }, 4000); 
      });
  };


  
  return (
    <Card>
      <CardBody>
        <h1 style={{ color: COLORS.SECONDARY }}>
          Exportar Evolutivo de Empleados
        </h1>
        <Row>
          <Col md={4} style={{ marginTop: 50 }}>
            <span>Fecha Desde</span>
            <Flatpickr
              className="form-control"
              value={fechaDesde}
              onChange={(date) => setFechaDesde(date)}
            />
          </Col>

          <Col md={4} style={{ marginTop: 50 }}>
            <span>Fecha Hasta</span>
            <Flatpickr
              className="form-control"
              value={fechaHasta}
              onChange={(date) => setFechaHasta(date)}
            />
          </Col>

          <Col md={4} style={{ marginTop: 50 }}>
            <span>Incluir Detalle de aprobadores</span>
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={20} />}
              defaultChecked={detalleAprobadores}
              label={detalleAprobadores ? "Si" : "No"}
              size="lg"
              onChange={(e) => setDetalleAprobadores(e.target.checked)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={8} style={{ marginTop: 50 }}>
            <span>Empleado</span>
            <Select
              className="React"
              classNamePrefix="select"
              isSearchable={true}
              isClearable={true}
              options={empleados}
              placeholder={"Todos...."}
              onChange={(e) => setEmpleado({ empleado: e?.obj ?? [] })}
            />
          </Col>

          <Col md={4} style={{ marginTop: 50 }}>
            <span>Incluir Solo Empleados Activos</span>
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={20} />}
              defaultChecked={empleadosActivos}
              label={setEmpleadosActivos ? "Si" : "No"}
              size="lg"
              onChange={(e) => setEmpleadosActivos(e.target.checked)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4} style={{ marginTop: 50 }}>
            <span>Consolidar Empleados multi nomina</span>
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={20} />}
              defaultChecked={empleadosMultinomina}
              label={setEmpleadosMultinomina ? "Si" : "No"}
              size="lg"
              onChange={(e) => setEmpleadosMultinomina(e.target.checked)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <br />
            <Button
              color="success"
              outline={true}
              style={{ marginTop: 50 }}
              onClick={handleExportar}
            >
              Exportar XLS
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Index;
