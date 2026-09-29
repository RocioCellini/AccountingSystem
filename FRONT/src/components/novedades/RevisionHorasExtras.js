import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NumberFormat } from "../../helpers/numberFormat";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import API from "../../api";
import { Flip, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../../utility/utils";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";

const RevisionHorasExtras = props => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { name: "Id", selector: "id", width: "5%" },
      {
        name: "Empleado",
        width: "20%",
        cell: row => (
          <Link to={"/empleados/getone/" + row.empleado.id}>
            {" "}
            {row.empleado.nombre_apellido}{" "}
          </Link>
        ),
      },
      {
        name: "Cantidad",
        width: "10%",
        cell: row => (
          <span style={{ width: "80%", textAlign: "right" }}>
            {NumberFormat(
              parseFloat(row.horas_extras_50) +
                parseFloat(row.horas_extras_100),
              0,
              ",",
              "."
            )}{" "}
          </span>
        ),
      },
      {
        name: "Estado",
        selector: "estado_horas_extras.descripcion",
        width: "12%",
      },
      { name: "Propuesto Por", selector: "propuesto_por.name", width: "18%" },
      {
        name: "Aprobado Por",
        selector: "horas_extras_aprobado_por.name",
        width: "18%",
      },
      {
        name: "Aprobado El",
        selector: "horas_extras_fecha_aprobacion_formatted",
        width: "17%",
      },
    ]);
  }, []);

  useEffect(() => {
    setData(props.data);
  }, [props]);

  const customStyles = {
    rows: {},
    headCells: {
      style: {
        backgroundColor: COLORS.SECONDARY,
        color: COLORS.WHITE,
        textAlign: "center",
      },
    },
    cells: {},
  };

  return (
    <div>
      {data.length > 0 && (
        <Row style={{ marginTop: 40 }}>
          <Col md={12}>
            <h3 style={{ color: COLORS.SECONDARY }}>Horas Extras</h3>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={12}>
          <DataTable
            data={data}
            columns={columns}
            pagination
            striped={true}
            noDataComponent={""}
            customStyles={customStyles}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RevisionHorasExtras;
