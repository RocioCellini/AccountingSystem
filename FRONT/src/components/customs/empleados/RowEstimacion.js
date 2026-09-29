import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Tooltip,
} from "reactstrap";
import { COLORS } from "../../../utility/utils";
import Select from "react-select";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input";
import React, { useEffect, useState } from "react";
import { NumberFormat } from "../../../helpers/numberFormat";
import API from "../../../api";

class RowEstimacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      estimacion: [],
      tooltipOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      id: this.props.id,
      estimacion: this.props.estimacion,
    });
  }

  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  handleMouseEnter = () => {
    this.setState({ tooltipOpen: true });
  };

  handleMouseLeave = () => {
    this.setState({ tooltipOpen: false });
  };

  render() {
    const { editable } = this.props;
    // const tooltipStyles = {
    //   backgroundColor: "rgba(128, 128, 128, 0.8)",
    //   color: "white",
    //   fontSize: "12px",
    //   borderRadius: "4px",
    //   padding: "5px",
    // };

    // const tooltipArrowStyles = {
    //   borderTopColor: "rgba(128, 128, 128, 0.8)",
    // };

    return (
      <Row style={{ marginTop: 5 }}>
        <Col md={3}>
          <span>{this.state.estimacion.periodo}</span>
        </Col>
        <Col md={2}>
          <span>
            <CurrencyInput
              style={{
                textAlign: "right",
                backgroundColor:
                  this.state.estimacion.novedad?.estado?.codigo === "APR"
                    ? COLORS.SUCCESS_LIGHT
                    : this.state.estimacion.novedad?.estado?.codigo === "REC"
                    ? COLORS.ERROR
                    : !editable
                    ? "#f0f0f0"
                    : COLORS.WARNING_LIGHT,
              }}
              className="form-control"
              precision={1}
              disabled={true}
              decimalSeparator={","}
              thousandSeparator={"."}
              value={this.props.variacion}
            />
          </span>
        </Col>
        <Col md={3}>
          <span>
            <CurrencyInput
              style={{
                textAlign: "right",
                backgroundColor: !editable
                  ? "#f0f0f0"
                  : this.state.estimacion.novedad?.estado?.codigo === "APR"
                  ? COLORS.SUCCESS_LIGHT
                  : this.state.estimacion.novedad?.estado?.codigo === "REC"
                  ? COLORS.ERROR
                  : (parseInt(this.state.estimacion.novedad?.variacion) ??
                      0) === 0
                  ? COLORS.WHITE
                  : COLORS.WARNING_LIGHT,
              }}
              className="form-control"
              precision={0}
              decimalSeparator={","}
              thousandSeparator={"."}
              value={
                parseInt(this.state.estimacion.novedad?.sueldo_bruto) ??
                this.props.ultimoSueldo
              }
              disabled={!editable}
              name={"currency-input-" + this.state.id}
              onChange={(e, name) => {
                let sueldo = e
                  .replaceAll("$", "")
                  .replaceAll(".", "")
                  .replaceAll(",", ".");
                let ultimoSueldo = this.props.ultimoSueldo;
                let variacion = (sueldo / ultimoSueldo - 1) * 100;
                this.props.callback(this.state.id, {
                  ...this.state.estimacion,
                  novedad: {
                    ...this.state.estimacion.novedad,
                    sueldo_bruto: sueldo,
                    variacion: variacion,
                  },
                });
                this.setState({
                  estimacion: {
                    ...this.state.estimacion,
                    novedad: {
                      ...this.state.estimacion.novedad,
                      sueldo_bruto: sueldo,
                    },
                  },
                });
              }}
              id={`tooltip-${this.state.id}`}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            />
            {/* {!editable && (
              <Tooltip
                placement="top"
                isOpen={this.state.tooltipOpen}
                target={`tooltip-${this.state.id}`}
                toggle={this.toggleTooltip}
                className="custom-tooltip"
                style={tooltipStyles}
                arrowClassName="custom-tooltip-arrow"
                arrowStyle={tooltipArrowStyles}
              >
                No es posible editar valores previos al periodo actual
              </Tooltip>
            )} */}
          </span>
        </Col>
        {this.state.id == 0 && (
          <Col md={2}>
            <span>
              <CurrencyInput
                style={{
                  textAlign: "right",
                  backgroundColor:
                    this.state.estimacion.novedad?.estado_horas_extras
                      ?.codigo == "APR"
                      ? COLORS.SUCCESS_LIGHT
                      : this.state.estimacion.novedad?.estado_horas_extras
                          ?.codigo == "REC"
                      ? COLORS.ERROR
                      : COLORS.WHITE,
                }}
                className="form-control"
                precision={1}
                decimalSeparator={","}
                thousandSeparator={"."}
                value={this.state.estimacion.novedad?.horas_extras_50 ?? 0}
                onChange={(e) => {
                  this.props.callback(this.state.id, {
                    ...this.state.estimacion,
                    novedad: {
                      ...this.state.estimacion.novedad,
                      horas_extras_50: e,
                    },
                  });
                  this.setState({
                    estimacion: {
                      ...this.state.estimacion,
                      novedad: {
                        ...this.state.estimacion.novedad,
                        horas_extras_50: e,
                      },
                    },
                  });
                }}
              />
            </span>
          </Col>
        )}

        {this.state.id == 0 && (
          <Col md={2}>
            <span>
              <CurrencyInput
                style={{
                  textAlign: "right",
                  backgroundColor:
                    this.state.estimacion.novedad?.estado_horas_extras
                      ?.codigo == "APR"
                      ? COLORS.SUCCESS_LIGHT
                      : this.state.estimacion.novedad?.estado_horas_extras
                          ?.codigo == "REC"
                      ? COLORS.ERROR
                      : COLORS.WHITE,
                }}
                className="form-control"
                precision={1}
                selectAllOnFocus={true}
                decimalSeparator={","}
                thousandSeparator={"."}
                value={this.state.estimacion.novedad?.horas_extras_100 ?? 0}
                onChange={(e) => {
                  this.props.callback(this.state.id, {
                    ...this.state.estimacion,
                    novedad: {
                      ...this.state.estimacion.novedad,
                      horas_extras_100: e,
                    },
                  });
                  this.setState({
                    estimacion: {
                      ...this.state.estimacion,
                      novedad: {
                        ...this.state.estimacion.novedad,
                        horas_extras_100: e,
                      },
                    },
                  });
                }}
              />
            </span>
          </Col>
        )}
      </Row>
    );
  }
}

export default RowEstimacion;
