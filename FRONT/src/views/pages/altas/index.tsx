import React from "react";
import { Alta } from "../../../types/altas/altasTypes";
import { Button, Col, Row } from "reactstrap";
import ModalAlta from "./modal";
import CustomTable from "../../../components/Table/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../../../utility/utils";
import altasColumns from "../../../components/columns/altasColumns";

type TransformedData = {
  id: number | string;
  gerencia: string;
  nombre: string;
  apellido: string;
  sector: string;
  sueldoBruto: number;
  estado: string;
  fechaIngreso: Date | null;
  fechaIngresoExcel: string;
  action: JSX.Element;
};

const Index: React.FC<{
  altas: Alta[];
  newAlta: Partial<Alta>;
  permiteAlta: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onClickNuevaAlta: () => void;
  updateFilteredAltas: (altas: Alta[]) => void;
  handleEditAlta: (row: Alta) => void;
}> = ({
  altas,
  newAlta,
  permiteAlta,
  showModal,
  setShowModal,
  onClickNuevaAlta,
  updateFilteredAltas,
  handleEditAlta,
}) => {
  // Transforma los datos para que funcionen con CustomTable
  const transformedData: TransformedData[] = altas.map((alta) => ({
    id: alta?.id || "",
    gerencia: alta?.padre?.nombre_apellido || "",
    nombre: alta?.nombre || "",
    apellido: alta?.apellido || "",
    sector: alta?.sector?.descripcion || "",
    sueldoBruto: parseFloat(alta?.sueldo_bruto || "0") || 0,
    estado: alta?.estado?.descripcion || "",
    fechaIngreso: alta?.fecha_ingreso ? new Date(alta.fecha_ingreso + 'T00:00:00') : null, // Para que funcione el ordenamiento en la tabla
    fechaIngresoExcel: alta?.fecha_ingreso_formatted || "", // Para la descarga del Excel (DD/MM/YYYY)
    action: (
      <Button
        size="sm"
        style={{ margin: 3 }}
        onClick={() => handleEditAlta(alta)}
        color="primary"
      >
        <FontAwesomeIcon icon={faEdit} />
      </Button>
    )
  }));

  return (
    <div>
      <Row>
        <Col
          md={12}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: "2rem",
          }}
        >
          <span
            style={{
              fontSize: 30,
              color: COLORS.SECONDARY,
              fontWeight: "bold",
            }}
          >
            Nuevas Altas
          </span>

          {permiteAlta && (
            <Button
              size="sm"
              outline={true}
              color="primary"
              onClick={onClickNuevaAlta}
            >
              <FontAwesomeIcon icon={faPlusCircle} size={"2x"} /> Nueva Alta
            </Button>
          )}
        </Col>
      </Row>
      <CustomTable
        data={transformedData}
        columns={altasColumns}
        hideAddButton
        nameFile="altas.csv"
        customActions={(row: any, rowIndex: number) => row.action}
      />

      {showModal && (
        <ModalAlta
          callbackAltas={updateFilteredAltas}
          setShow={setShowModal}
          show={showModal}
          empleado={newAlta}
        />
      )}
    </div>
  );
};

export default Index;
