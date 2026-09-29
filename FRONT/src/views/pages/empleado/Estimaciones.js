import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import { COLORS } from "../../../utility/utils";
import React from "react";
import API from "../../../api";
import { NumberFormat } from "../../../helpers/numberFormat";
import RowEstimacion from "../../../components/customs/empleados/RowEstimacion";
import { toast, Flip } from "react-toastify";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Estimaciones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      empleado: [],
      estimaciones: [],
      rechazos: [],
      loading: false,
    };

    this.cambiarEstimacionPorId = this.cambiarEstimacionPorId.bind(this);
  }

  componentDidMount() {
    this.setState({
      empleado: {
        ...this.props.empleado,
        fecha_ingreso: this.props.empleado.fecha_ingreso_string,
        fecha_nacimiento: this.props.empleado.fecha_nacimiento_string,
      },
    });

    API.getEstimaciones(this.props.empleado.id).then((response) => {
      this.setState({ estimaciones: response.data.novedades });
      this.setState({ rechazos: response.data.rechazos });
    });
  }

  async cambiarEstimacionPorId(id, estimacion) {
    let arr = this.state.estimaciones;
    let ultimoSueldo = this.state.empleado.ultimo_sueldo;
    let sueldoBruto = this.state.empleado.ultimo_sueldo;
    arr.map((e, i) => {
      sueldoBruto =
        this.state.estimaciones[i]?.novedad?.sueldo_bruto ?? sueldoBruto;
      let variacion = (sueldoBruto / ultimoSueldo - 1) * 100;

      if (i >= id) {
        sueldoBruto = estimacion.novedad.sueldo_bruto;
        variacion = (sueldoBruto / ultimoSueldo - 1) * 100;
        arr[i].novedad = {
          ...estimacion.novedad,
          variacion: variacion,
          sueldo_bruto: sueldoBruto,
          horas_extras_50: id == i ? estimacion.novedad.horas_extras_50 : 0,
          horas_extras_100: id == i ? estimacion.novedad.horas_extras_100 : 0,
          estado: [],
        };
      }
      ultimoSueldo = sueldoBruto;
    });
    this.setState({ estimaciones: arr });
  }

  async save() {
    let validacion = true;
    this.setState({ loading: true });

    let arr = this.state.estimaciones;
    let sueldoBruto = this.state.empleado.ultimo_sueldo;
    let maxSueldo = this.state.empleado.ultimo_sueldo;
    arr.forEach((e, i) => {
      sueldoBruto =
        this.state.estimaciones[i]?.novedad?.sueldo_bruto ?? sueldoBruto;

      if (parseInt(sueldoBruto) < parseInt(maxSueldo)) {
        validacion = false;
      } else {
        maxSueldo = sueldoBruto;
      }
    });

    if (!validacion) {
      toast.error("No puede guardar un sueldo menor al actual!", {
        transition: Flip,
      });
      this.setState({ loading: false });
    } else {
      API.saveNovedades(this.state).then((response) => {
        if (response.status) {
          toast.success("Se guardaron las novedades correctamente!", {
            transition: Flip,
          });
          this.setState({ loading: false });
        }
      });
    }
  }

  render() {
    const totalEstimaciones = this.state.estimaciones.length;
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
              Proyección
            </span>
          </Col>
        </Row>

        <Card style={{ marginTop: 30 }}>
          <CardBody>
            <Row style={{ marginTop: 15 }}>
              <Col md={12}>
                <span style={{ fontWeight: "bold", color: COLORS.SECONDARY }}>
                  Ultimo Sueldo:{" "}
                </span>
                <span>
                  {NumberFormat(
                    this.state.empleado.ultimo_sueldo ?? 0,
                    0,
                    ",",
                    "."
                  )}
                </span>
              </Col>
            </Row>

            <Row style={{ marginTop: 15 }}>
              <Col md={3}>
                {" "}
                <span style={{ fontWeight: "bold", color: COLORS.SECONDARY }}>
                  Periodo Actual
                </span>{" "}
              </Col>
              <Col md={2}>
                {" "}
                <span style={{ fontWeight: "bold", color: COLORS.SECONDARY }}>
                  %
                </span>{" "}
              </Col>
              <Col md={3}>
                {" "}
                <span style={{ fontWeight: "bold", color: COLORS.SECONDARY }}>
                  Sueldo Bruto
                </span>{" "}
              </Col>
              <Col md={2}>
                {" "}
                <span style={{ fontWeight: "bold", color: COLORS.SECONDARY }}>
                  Hs Extras 50%
                </span>
                <FontAwesomeIcon
                  style={{ marginLeft: 10 }}
                  id="hs-extras-50"
                  icon={faInfoCircle}
                  color={COLORS.MODERN_BLUE}
                />
                <UncontrolledTooltip placement="left" target="hs-extras-50">
                  Lunes hasta el sábado a las 13 hs
                </UncontrolledTooltip>
              </Col>
              <Col md={2}>
                {" "}
                <span style={{ fontWeight: "bold", color: COLORS.SECONDARY }}>
                  Hs Extras 100%
                </span>
                <FontAwesomeIcon
                  style={{ marginLeft: 10 }}
                  id="hs-extras-100"
                  icon={faInfoCircle}
                  color={COLORS.MODERN_BLUE}
                />
                <UncontrolledTooltip placement="left" target="hs-extras-100">
                  Sábados después de las 13hs, domingos y feriados
                </UncontrolledTooltip>
              </Col>
            </Row>
            {this.state.estimaciones.map((e, i) => {
              var ultimoSueldo = 0;
              var variacion = 0.0;
              e = {
                ...e,
                novedad: {
                  ...e.novedad,
                  horas_extras_100: (e?.novedad?.horas_extras_100 ?? 0)
                    .toString()
                    .replace(".", ","),
                  horas_extras_50: (e?.novedad?.horas_extras_50 ?? 0)
                    .toString()
                    .replace(".", ","),
                },
              };
              if (i == 0) {
                ultimoSueldo = this.state.empleado.ultimo_sueldo;
                variacion =
                  (parseFloat(
                    this.state.estimaciones[i]?.novedad?.sueldo_bruto
                  ) /
                    parseFloat(ultimoSueldo) -
                    1) *
                  100;
              } else if (
                this.state.estimaciones[i - 1]?.novedad?.sueldo_bruto &&
                this.state.estimaciones[i - 1]?.novedad?.sueldo_bruto != 0
              ) {
                ultimoSueldo =
                  this.state.estimaciones[i - 1]?.novedad?.sueldo_bruto;
                variacion =
                  (parseFloat(
                    this.state.estimaciones[i]?.novedad?.sueldo_bruto
                  ) /
                    parseFloat(ultimoSueldo) -
                    1) *
                  100;
              }

              return (
                <RowEstimacion
                  key={i}
                  id={i}
                  estimacion={e}
                  ultimoSueldo={ultimoSueldo}
                  variacion={
                    (parseFloat(
                      this.state.estimaciones[i]?.novedad?.sueldo_bruto
                    ) /
                      parseFloat(ultimoSueldo) -
                      1) *
                    100
                  }
                  callback={this.cambiarEstimacionPorId}
                  editable={i === 0} 
                />
              );
            })}
            <Row style={{ marginTop: 20 }}>
              <Col md={12}>
                {/*this.state.rechazos.map((e,i)=>{
                                return (
                                    <Row>
                                        <Col md={12}>
                                            <span>El empleado tenia cargado un incremento para {e.periodo} de {NumberFormat(e.variacion,2,",",".")} % (Sueldo Bruto: {NumberFormat(e.sueldo_bruto,2,",",".")} ) y fue rechazado</span>
                                        </Col>
                                    </Row>
                                )
                            })*/}
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col md={12}>
                {!this.state.loading && (
                  <Button
                    color="primary"
                    onClick={() => {
                      this.save();
                    }}
                    style={{ float: "right" }}
                  >
                    Guardar
                  </Button>
                )}

                {this.state.loading && (
                  <Button
                    color="primary"
                    disabled={true}
                    style={{ float: "right" }}
                  >
                    Guardando...
                  </Button>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Estimaciones;
