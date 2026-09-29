import React from "react";
import { Badge } from "reactstrap";
import { NumberFormat } from "../../helpers/numberFormat";

interface AltasColumn {
  name: string;
  label: string;
  options: {
    filter: boolean;
    sort: boolean;
    download?: boolean;
    print?: boolean;
    display?: boolean;
    viewColumns?: boolean;
    customBodyRender?: (value: any, tableMeta?: any) => any;
  };
}

const altasColumns: AltasColumn[] = [
  {
    name: "id",
    label: "Id",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "gerencia",
    label: "Gerencia",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "nombre",
    label: "Nombre",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "apellido",
    label: "Apellido",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "sector",
    label: "Sector",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "sueldoBruto",
    label: "Sueldo Bruto",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <span>{NumberFormat(value, 0, ",", ".")}</span>
      ),
    },
  },
  {
    name: "estado",
    label: "Estado",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => {
        let color = "light-success";

        if (value === "Ingresado") {
          color = "light-primary";
        } else if (value === "Pendiente") {
          color = "light-warning";
        } else if (value === "Rechazado") {
          color = "light-danger";
        }

        return (
          <Badge color={color} className="badge-sm">
            {value}
          </Badge>
        );
      },
    },
  },
  {
    name: "fechaIngreso", // Para mostrar en la tabla
    label: "Fecha Ingreso",
    options: {
      filter: true,
      sort: true,
      download: false, // No incluir en descarga, se usa fechaIngresoExcel
      customBodyRender: (value) => {
        // Mostrar la fecha formateada (DD/MM/YYYY)
        if (value instanceof Date && !isNaN(value.getTime())) {
          return value.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
        return "Fecha inválida";
      },
    },
  },
  {
    name: "fechaIngresoExcel", // Para mostrar solo en descarga
    label: "Fecha Ingreso",
    options: {
      filter: false,
      sort: false,
      display: false, // Para no mostrar en la tabla
      viewColumns: false, // Para no mostrar en menú "Ver columnas"
      download: true, 
      print: false,
    },
  },
  {
    name: "action",
    label: "Acción",
    options: {
      filter: false,
      sort: true, // Para que tenga los mismos estilos que las demás
      print: false,
    },
  },
];

export default altasColumns;
