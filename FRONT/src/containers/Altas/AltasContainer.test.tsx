import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import AltasContainer from "./AltasContainer";
import { AltasProps } from "../../types/altas/altasTypes";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const initialState = {
  altas: {
    data: [
      {
        id: 11,
        nombre: "LEONELH",
        fecha_nacimiento: "1990-04-27",
        documento: "35147771",
        plan_osde: "Osde 310",
        titulo_puesto: "Sistemas",
        fecha_ingreso: "2024-03-01",
        sueldo_bruto: "10000",
        dias_vacaciones: "21",
        bono_semestral: "3",
        puesto_id: "20",
        empresa_id: "2",
        sector_id: "1",
        padre_id: null,
        user_id: "31",
        estado_id: "2",
        created_at: "2022-02-19T18:55:36.357000Z",
        updated_at: "2024-11-21T19:18:22.930000Z",
        aprobador_id: 31,
        apellido: "HJ",
        created_by: "1",
        updated_by: "31",
        subsegmento_id: null,
        consultora: "",
        updated_at_formatted: "21/11/2024 16:18:22",
        fecha_ingreso_formatted: "01/03/2024",
        fecha_ingreso_string: "01032024",
        fecha_nacimiento_string: "27041990",
        puesto: {
          id: 20,
          descripcion: "Assistant",
          created_at: "2021-06-10T21:23:55.250000Z",
          updated_at: "2021-06-10T21:23:55.250000Z",
        },
        empresa: {
          id: 2,
          descripcion: "INTL Capital",
          codigo: "GAA",
          created_at: "2021-06-10T21:23:54.207000Z",
          updated_at: "2022-12-10T18:47:14.920000Z",
          conexion: "CAPITAL",
        },
        sector: {
          id: 1,
          descripcion: "Back Office Fondos",
          created_at: "2021-06-10T21:23:56.503000Z",
          updated_at: "2021-06-10T21:23:56.503000Z",
        },
        padre: null,
        estado: {
          id: 2,
          descripcion: "Rechazado",
          codigo: "REC",
          created_at: "2021-06-10T21:23:53.953000Z",
          updated_at: "2021-06-10T21:23:53.953000Z",
        },
        subsegmento: null,
        archivos: [],
      },
      {
        id: 2059,
        nombre: "JOSE",
        fecha_nacimiento: "1990-10-08",
        documento: "17650449",
        plan_osde: "Osde 310",
        titulo_puesto: "DEVELOPER",
        fecha_ingreso: "2024-10-08",
        sueldo_bruto: "2",
        dias_vacaciones: "35",
        bono_semestral: "2",
        puesto_id: "2",
        empresa_id: "2",
        sector_id: "1",
        padre_id: "441",
        user_id: "1090",
        estado_id: "1",
        created_at: "2024-10-08T12:25:33.060000Z",
        updated_at: "2024-10-08T12:25:33.060000Z",
        aprobador_id: null,
        apellido: "GOMEZ",
        created_by: "1090",
        updated_by: null,
        subsegmento_id: null,
        consultora: "",
        updated_at_formatted: "08/10/2024 09:25:33",
        fecha_ingreso_formatted: "08/10/2024",
        fecha_ingreso_string: "08102024",
        fecha_nacimiento_string: "08101990",
        puesto: {
          id: 2,
          descripcion: "Head Portfolio Mutual Funds",
          created_at: "2021-06-10T21:23:54.330000Z",
          updated_at: "2021-06-10T21:23:54.330000Z",
        },
        empresa: {
          id: 2,
          descripcion: "INTL Capital",
          codigo: "GAA",
          created_at: "2021-06-10T21:23:54.207000Z",
          updated_at: "2022-12-10T18:47:14.920000Z",
          conexion: "CAPITAL",
        },
        sector: {
          id: 1,
          descripcion: "Back Office Fondos",
          created_at: "2021-06-10T21:23:56.503000Z",
          updated_at: "2021-06-10T21:23:56.503000Z",
        },
        padre: {
          id: 441,
          nombre_apellido: "ANTONIO PEPE",
          fecha_nacimiento: "2000-04-27",
          documento: "43554111",
          plan_osde: "Osde 310",
          titulo_puesto: "Analista",
          fecha_ingreso: "2022-11-04",
          fecha_baja: null,
          sueldo_bruto: "10000",
          dias_vacaciones: "14",
          bono_semestral: "2",
          puesto_id: "20",
          empresa_id: "4",
          sector_id: "7",
          padre_id: "434",
          created_at: "2022-11-16T21:40:51.390000Z",
          updated_at: "2022-11-16T21:40:51.390000Z",
          created_by: "2",
          updated_by: null,
          es_comercial: "1",
          email: null,
          subsegmento_id: null,
          repite_bono_semestral: "0",
          nunca_liquido_bonus: "1",
          llave_distribucion_id: null,
          meses_reconocidos: "0",
          tipo_empleado: null,
          ant_reconocida: null,
          legajo_bejerman: "33333",
          legajo_sun: "33333",
          fecha_ingreso_formatted: "04/11/2022",
          fecha_baja_string: "24072025",
          fecha_ingreso_string: "04112022",
          fecha_nacimiento_string: "27042000",
          ultimo_sueldo: "10000",
          es_baja: false,
          es_favorito: false,
          edad: 25,
        },
        estado: {
          id: 1,
          descripcion: "Pendiente",
          codigo: "PEN",
          created_at: "2021-06-10T21:23:53.900000Z",
          updated_at: "2021-06-10T21:23:53.900000Z",
        },
        subsegmento: null,
        archivos: [],
      },
    ],
    error: null,
  },
  user: {
    user: {
      data: {
        id: 1136,
        name: "Pablo Carnota",
        email: "pablo.carnota@gmail.com",
        email_verified_at: null,
        crated_at: "2025-07-08T12:36:57.000000Z",
        updated_at: "2025-07-08T12:36:57.000000Z",
        rol_id: "6",
        empleado_id: null,
        deleted_at: null,
        created_by: null,
        updated_by: null,
        active: "1",
        updated_at_formatted: "08/07/2025 09:36:57",
        rol: {
          id: 6,
          descripcion: "Super User",
          codigo: "SU",
          created_at: "2021-07-16T02:10:25.150000Z",
          updated_at: "2021-07-16T02:10:25.150000Z",
        },
        empleado: null,
      },
      email: "pablo.carnota@gmail.com",
      role: "Super User",
      name: "Pablo Carnota",
    },
    info: {
      stateToken: "",
      factorId: "",
      token: "",
      statusAccess: true,
      mfa: false,
    },
    loading: false,
    message: "",
  },
};

const renderComponent = (props: Partial<AltasProps> = {}) => {
  const store = mockStore({
    altas: initialState.altas,
    user: initialState.user,
  });

  render(
    <Provider store={store}>
      <AltasContainer
        getAltas={() => {}}
        getInfo={() => {}}
        altas={initialState.altas.data}
        user={initialState.user.user.data}
        {...props}
      />
    </Provider>
  );
};

describe("AltasContainer", () => {
  it("should render the component with the correct title", () => {
    renderComponent();

    expect(screen.getByText("Nuevas Altas")).toBeInTheDocument();
  });

  it("should render the new button", () => {
    renderComponent();

    const newButton = screen.getByRole("button", { name: "Nueva Alta" });

    expect(newButton).toBeInTheDocument();
  });

  it("should render the table with the correct columns", () => {
    renderComponent();

    const expectedColumns = [
      "Id",
      "Gerencia",
      "Nombre",
      "Apellido",
      "Sector",
      "Sueldo Bruto",
      "Estado",
      "Fecha Ingreso",
      "ACCIÓN",
    ];

    expectedColumns.forEach((columnName) => {
      expect(screen.getByText(columnName)).toBeInTheDocument();
    });
  });

  it("should render the component with data", () => {
    renderComponent();

    expect(screen.getByText("LEONELH")).toBeInTheDocument();
    expect(screen.getByText("JOSE")).toBeInTheDocument();
  });
});
