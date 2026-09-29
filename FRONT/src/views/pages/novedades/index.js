import React, { useEffect, useState } from "react";
import API from "./../../../api";
import {
  Card,
  CardBody,
} from "reactstrap";
import NovedadesHorasExtras from "../../../components/novedades/NovedadesHorasExtras";
import NovedadesIncrementos from "../../../components/novedades/NovedadesIncrementos";
import NovedadesComisiones from "../../../components/novedades/NovedadesComisiones";
import NovedadesBonos from "../../../components/novedades/NovedadesBonos";
import NovedadesBonosTrimestrales from "../../../components/novedades/NovedadesBonosTrimestrales";
import NovedadesGratificaciones from "../../../components/novedades/NovedadesGratificaciones";

const Index = props => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    API.getInfo().then(response => {
      setUser(response.data);
    });
  }, []);

  return (
    <Card>
      <CardBody>
        {["RRHH", "APR", "SU", "GTEF"].includes(user?.rol?.codigo) && (
          <div>
            <NovedadesIncrementos />

            <NovedadesHorasExtras />

            <NovedadesBonos />

            <NovedadesBonosTrimestrales />

            <NovedadesGratificaciones />
          </div>
        )}

        {["RRHH", "GTE", "SU", "GTEF", "APR"].includes(user?.rol?.codigo) && (
          <div>
            <NovedadesComisiones />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Index;
