import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddButton from '../buttons/AddButton';
import CustomButton from '../buttons/CustomButton';
import { FaEdit, FaTimesCircle } from 'react-icons/fa';
import { exportToExcel } from '../../helpers/exportExcel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GetAppIcon from '@mui/icons-material/GetApp';

const CustomTable = (props) => {

  //se llaman a las props para darle informacíon específica a la tabla
  const {
    data,
    columns,
    title,
    editData = {},
    editRowIndices = new Set(),
    handleEditChange = () => {},
    startEdit = () => {},
    cancelEdit = () => {},
    saveEdit = () => {},
    handleDelete = () => {},
    handleAddClick = () => {},
    addButtonTooltip,
    pagination = true,
    search = true,
    download = true,
    viewColumns = true,
    hideAddButton = false,
    disableEdit = false,
    disableDelete = false,
    nameFile = "data.csv",
    messageEmpty = "Lo sentimos, no se encuentran datos disponibles en este momento.",
  } = props;

  //función de material UI para definirle estilos a la tabla en el header y sus celdas
  const getMuiTheme = () => createTheme({
      components: {
        MUIDataTableHeadCell: {
          styleOverrides:{
            root: {
              backgroundColor: "#013A58",
              color: "white !important",
            },
            data: {
              fontSize: "15px",
              textTransform: "none",
              marginLeft: "20px",
              color: "white",
            },
          }
        },
        MUIDataTableBodyCell: {
          styleOverrides:{
            root: {
              textAlign: "left",
              marginLeft: "25px",
              fontSize: "13px"
            }
          }
        },
        MUIDataTable: {
          styleOverrides:{
            responsiveScrollFullHeight: {
              overflowX: "auto",
            },
          }
        },
      }
    });

  //bandera para diferenciar si la fila esta en modo edición
  const isRowInEditMode = (rowIndex) => {
    if (!editRowIndices || !(editRowIndices instanceof Set)) {
      return false;
    }

    if (rowIndex === undefined || rowIndex === null) {
      return false;
    }

    return editRowIndices.has(rowIndex);
  };

  //funcion para renderizar las columnas aclarando que si se le pasa una columna de tipo acción se rendericen los botones como celdas dentro de la misma
  const renderColumns = columns.map((col) => ({
    ...col,
    options: {
      ...col.options,
      customBodyRender: (value, tableMeta) => {
        const rowIndex = tableMeta.rowIndex;
        const row = data[rowIndex];

        // Si la columna ya tiene un customBodyRender, usarlo
        if (col.options?.customBodyRender && col.name !== 'action') {
          return col.options.customBodyRender(value, tableMeta);
        }

        if (col.name === 'action') {
          // Botones por Props
          if (typeof props.customActions === 'function') {
            return props.customActions(row, rowIndex);
          }
          // Botones por defecto
          return renderActionButtons(rowIndex);
        } else if (col.name === 'id') {
          return value;
        } else if (isRowInEditMode(rowIndex)) {
          return renderEditableField(value, rowIndex, col.name);
        } else {
          return value;
        }
      }
    }
  }));

  //botones de acción para las celdas
  const renderActionButtons = (rowIndex) => {
    const row = data[rowIndex];
    if (!row) {
      console.error(
        "Error: La fila es undefined o no válida para rowIndex:",
        rowIndex
      );
      return null;
    }

    return (
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'left' }}>
        {!disableEdit && (
          <CustomButton
            title={isRowInEditMode(rowIndex) ? "Guardar" : "Modificar"}
            backgroundColor='#013A58'
            onClick={() => isRowInEditMode(rowIndex) ? saveEdit(rowIndex) : startEdit(rowIndex)}
            icon={!isRowInEditMode(rowIndex) ? <FaEdit style={{ fontSize: '12px' }} /> : null}
            text={isRowInEditMode(rowIndex) ? <span style={{ fontSize: '12px' }}>Guardar</span> : null}
          />
        )}
        {!disableDelete && (
          <CustomButton
            title={isRowInEditMode(rowIndex) ? "Cancelar" : "Eliminar"}
            backgroundColor='#ea5455'
            onClick={() => {
              if (isRowInEditMode(rowIndex)) {
                cancelEdit(rowIndex);
              } else {
                if (typeof handleDelete === "function") {
                  if (handleDelete.length > 1) {
                    handleDelete(row.empresa_id, row.modulo_id);
                  } else {
                    handleDelete(row);
                  }
                } else {
                  console.error(
                    "Error: handleDelete no es una función válida."
                  );
                }
              }
            }}
            icon={!isRowInEditMode(rowIndex) ? <FaTimesCircle style={{ fontSize: '12px' }} /> : null}
            text={isRowInEditMode(rowIndex) ? <span style={{ fontSize: '12px' }}>Cancelar</span> : null}
          />
        )}
      </div>
    );
  };

  //funcion para renderizar un input en caso de edición, se agrega lógica para manejar el ancho de los inputs según el valor inicial del campo para evitar por ej que valores de un solo caractér tengan inputs muy grandes
  const renderEditableField = (value, rowIndex, fieldName) => {
    const minWidth = 50;
    const width = Math.max(String(value).length * 10, minWidth);

    return (
      <input
        type="text"
        value={editData[rowIndex][fieldName] || ''}
        onChange={(e) => handleEditChange(e.target.value, rowIndex, fieldName)}
        style={{
          width: `${width}px`,
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '12px',
          color: '#333',
          backgroundColor: '#fff',
        }}
      />
    );
  };

  const maxHeight = props.maxHeight === undefined ? "500px" : props.maxHeight;
  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    pagination,
    search,
    filter: false,
    print: true,
    columns: false,
    download: false,
    selectableRows: 'none',
    fixedHeader: props.fixedHeader === undefined ? false : props.fixedHeader, // activa la cabecera fija
    tableBodyMaxHeight: props.fixedHeader ? maxHeight : undefined, // para que funcione el scroll con la cabecera fija
    downloadOptions: {
      filename: nameFile,
      separator: ",",
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      }
    },
    viewColumns,
    searchPlaceholder: "Buscar...",
    showResponsive: true,
    rowsPerPageOptions: [50, 100, 150],
    rowsPerPage: 50,
    textLabels: {
      body: {
        noMatch: messageEmpty,
        toolTip: "Ordenar",
        columnHeaderTooltip: column => `Ordenar por ${column.label}`
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver columnas",
        filterTable: "Filtrar",
      },
      viewColumns: {
        title: "Ver columnas",
        titleAria: "Mostrar/Ocultar",
      },
      filter: {
        all: "Todos",
        title: "FILTROS",
        reset: "RESETEAR",
      },
    },
    customToolbar: () => (
      <>
        {download && (
          <Tooltip title="Descargar Excel">
            <IconButton
              onClick={() => 
                exportToExcel(data, columns, nameFile.replace(".csv", ".xls"))
              }
            >
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        )}
        {!hideAddButton && addButtonTooltip && (
          <AddButton tooltip={addButtonTooltip} handleOpen={handleAddClick} />
        )}
      </>
    ),
  };

  return (
    <div>
      <div style={{ marginTop: "25px" }}>
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={title}
            data={data}
            columns={renderColumns}
            options={options}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default CustomTable;
