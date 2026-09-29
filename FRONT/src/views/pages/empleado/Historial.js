import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardBody, Row, Col } from "reactstrap";
import API from "../../../api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../../../utility/utils";
import "../../../assets/scss/plugins/extensions/recharts.scss";

const Historial = (props) => {
  const [evolucion, setEvolucion] = useState([]);

  useEffect(() => {
    API.getHistorial(props.empleado.id).then((response) => {
      let arr = [];
      response.data.map((e, i) => {
        arr.push({
          name: e.periodo_formatted,
          sueldo_bruto: parseInt(e.sueldo_bruto),
          comisiones: parseInt(e.comisiones),
          horas_extras: parseInt(e.horas_extras),
          bono_semestral: parseInt(e.bono_semestral),
          bono_trimestral: parseInt(e.bono_trimestral),
          gratificacion_especial: parseInt(e.gratificacion_especial),
        });
      });

      setEvolucion(arr);
    });
  }, [props.empleado.id]);

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
            Evolución
          </span>
        </Col>
      </Row>

      <Card style={{ marginTop: 30 }}>
        <CardBody>
          <div className="recharts-wrapper">
            <ResponsiveContainer>
              <AreaChart
                width={400}
                height={800}
                data={evolucion}
                margin={{
                  top: 10,
                  right: 30,
                  left: 30,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="Sueldo Bruto"
                  dataKey="sueldo_bruto"
                  stackId="1"
                  stroke={COLORS.SECONDARY}
                  fill={COLORS.SECONDARY}
                />

                <Area
                  type="Horas Extras"
                  dataKey="horas_extras"
                  stackId="1"
                  stroke={COLORS.MODERN_GREEN}
                  fill={COLORS.MODERN_GREEN}
                />
                <Area
                  type="Comisiones"
                  dataKey="comisiones"
                  stackId="1"
                  stroke={COLORS.MODERN_ORANGE}
                  fill={COLORS.MODERN_ORANGE}
                />
                <Area
                  type="Bono Semestral"
                  dataKey="bono_semestral"
                  stackId="1"
                  stroke={COLORS.MODERN_BLUE}
                  fill={COLORS.MODERN_BLUE}
                />
                <Area
                  type="Bono Trimestral"
                  dataKey="bono_trimestral"
                  stackId="1"
                  stroke={COLORS.MODERN_RED}
                  fill={COLORS.MODERN_RED}
                />
                <Area
                  type="Gratificacion Especial"
                  dataKey="gratificacion_especial"
                  stackId="1"
                  stroke={COLORS.GRAY}
                  fill={COLORS.GRAY}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default Historial;
