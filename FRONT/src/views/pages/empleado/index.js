import React, { useEffect, useState } from "react";
import API from "./../../../api";
import {
  Row,
  Col,
} from "reactstrap";

import DatosPersonales from "./DatosPersonales";
import Estimaciones from "./Estimaciones";
import Historial from "./Historial";
import OficialCuenta from "./OficialCuenta";
import { Flip, toast } from "react-toastify";

const Index = (props) => {
  const [empleado, setEmpleado] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    API.getInfo().then((response) => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    API.getEmpleado(props.match.params.id).then((response) => {
      setEmpleado(response.data);
    });
  }, [props]);

  const attachOficial = (oficialId, porcentaje, porcentajeBaseCalculo) => {
    toast.warn("Procesando..., aguarde!", {
      transition: Flip,
      autoClose: false,
    });
    API.attachOficial({
      empleado_id: empleado.id,
      oficial_id: oficialId,
      porcentaje_base_calculo: porcentaje,
      porcentaje: porcentajeBaseCalculo,
    }).then((response) => {
      toast.dismiss();
      toast.success("Listo!", { transition: Flip });
      setEmpleado(response.data);
    });
  };

  const syncOficial = (empleadoOrigenId) => {
    toast.warn("Procesando..., aguarde!", {
      transition: Flip,
      autoClose: false,
    });
    API.syncOficial({
      empleado_hasta_id: empleado.id,
      empleado_desde_id: empleadoOrigenId,
    }).then((response) => {
      toast.dismiss();
      toast.success("Listo!", { transition: Flip });
      setEmpleado(response);
    });
  };

  const dettachOficial = (oficialId) => {
    toast.warn("Procesando..., aguarde!", {
      transition: Flip,
      autoClose: false,
    });
    API.dettachOficial({
      empleado_id: empleado.id,
      oficial_id: oficialId,
    }).then((response) => {
      toast.dismiss();
      toast.success("Listo!", { transition: Flip });
      setEmpleado(response);
    });
  };

  const attachFondo = (fondoId, porcentaje) => {
    API.attachFondo({
      empleado_id: empleado.id,
      fondo_id: fondoId,
      porcentaje: porcentaje,
    }).then((response) => {
      setEmpleado(response);
    });
  };

  const dettachFondo = (fondoId) => {
    API.dettachFondo({
      empleado_id: empleado.id,
      fondo_id: fondoId,
    }).then((response) => {
      setEmpleado(response);
    });
  };

  const attachCuotapartista = (cuotapartistaId, porcentaje) => {
    API.attachCuotapartista({
      empleado_id: empleado.id,
      cuotapartista_id: cuotapartistaId,
      porcentaje: porcentaje,
    }).then((response) => {
      setEmpleado(response);
    });
  };

  const dettachCuotapartista = (cuotapartistaId) => {
    API.dettachCuotapartista({
      empleado_id: empleado.id,
      cuotapartista_id: cuotapartistaId,
    }).then((response) => {
      setEmpleado(response);
    });
  };

  return (
    <div>
      <Row>
        <Col md={12}>
          <DatosPersonales empleado={empleado} />
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {empleado.id && user?.rol?.codigo != "GTEF" && empleado.id && (
            <Estimaciones empleado={empleado} />
          )}
        </Col>
      </Row>

      {parseInt(empleado?.es_comercial ?? 0) == 1 && empleado.id && (
        <Row>
          <Col md={12}>
            <OficialCuenta
              oficiales={empleado.oficiales ?? []}
              syncOficial={syncOficial}
              attachOficial={attachOficial}
              dettachOficial={dettachOficial}
            />
          </Col>
        </Row>
      )}

      {empleado.id && (
        <Row>
          <Col md={12}>
            <Historial empleado={empleado} />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Index;
