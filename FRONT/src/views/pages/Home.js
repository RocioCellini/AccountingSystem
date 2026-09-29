import React from "react";
import { Col, Row, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadCry, faSmile, faUser } from "@fortawesome/free-solid-svg-icons";
import API from "./../../api";
import { COLORS } from "../../utility/utils";
import { NumberFormat } from "../../helpers/numberFormat";
import StaticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard";



class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    API.getStatics().then(response => {
      this.setState({
        data: response.info,
      });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col md="12" sm="12">
            <h1 className="text-uppercase text-primary">
              Bienvenido a Accounting System!
            </h1>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={4}>
            <StaticsCard
              hideChart
              iconBg="primary"
              icon={<FontAwesomeIcon icon={faUser} size={"2x"} />}
              stat={this?.state?.data?.empleadosActivos?.length ?? 0}
              statTitle={"Empleados Activos"}
            />
          </Col>

          <Col md={4}>
            <StaticsCard
              hideChart
              iconBg="success"
              icon={<FontAwesomeIcon icon={faSmile} size={"2x"} />}
              stat={this?.state?.data?.ultimasAltas?.length ?? 0}
              statTitle={"Altas Ult. 30 dias"}
            />
          </Col>

          <Col md={4}>
            <StaticsCard
              hideChart
              iconBg="danger"
              icon={<FontAwesomeIcon icon={faSadCry} size={"2x"} />}
              stat={this?.state?.data?.ultimasBajas?.length ?? 0}
              statTitle={"Bajas Ult. 30 dias"}
            />
          </Col>
        </Row>

        {(this?.state?.data?.ultimasAltas ?? []).length > 0 && (
          <Row style={{ marginTop: 20 }}>
            <Col md={12}>
              <h3 className="text-uppercase text-primary">
                Altas Últimos 30 dias
              </h3>
            </Col>
          </Row>
        )}

        <Row>
          {(this?.state?.data?.ultimasAltas ?? []).map((e, i) => {
            return (
              <Col md={4} key={i}>
                <Card>
                  <CardHeader className={"bg-primary text-white"}>
                    <CardTitle style={{ color: COLORS.WHITE }}>
                      {e.nombre.toUpperCase()} {e.apellido.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Gerente</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {e?.padre?.nombre_apellido}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Sector</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {e?.sector?.descripcion}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Puesto</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {e?.titulo_puesto}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Sueldo Bruto</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {NumberFormat(e?.sueldo_bruto ?? 0, 0, ",", ".")}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>

        {(this?.state?.data?.ultimasBajas ?? []).length > 0 && (
          <Row style={{ marginTop: 20 }}>
            <Col md={12}>
              <h3 className="text-uppercase text-primary">
                Bajas Últimos 30 dias
              </h3>
            </Col>
          </Row>
        )}
        <Row>
          {(this?.state?.data?.ultimasBajas ?? []).map((e, i) => {
            return (
              <Col md={4} key={i}>
                <Card>
                  <CardHeader className={"bg-danger text-white"}>
                    <CardTitle style={{ color: COLORS.WHITE }}>
                      {e?.nombre_apellido?.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Gerente</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {e?.padre?.nombre_apellido}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Sector</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {e?.sector?.descripcion}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Puesto</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {e?.titulo_puesto}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Sueldo Bruto</td>
                          <td
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ width: "100%", textAlign: "right" }}>
                              {NumberFormat(e.ultimo_sueldo ?? 0, 0, ",", ".")}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default Home;
