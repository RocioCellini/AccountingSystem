import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons/faChartLine";
import {
  faBell,
  faCodeBranch,
  faDollarSign,
  faHome,
  faKey,
  faLightbulb,
  faList,
  faMoneyBillAlt,
  faMoneyCheck,
  faPercent,
  faTools,
  faUserPlus,
  faUsers,
  
} from "@fortawesome/free-solid-svg-icons";

import { faUserFriends } from "@fortawesome/free-solid-svg-icons/faUserFriends";
import BadgeNovedades from "../components/badges/BadgeNovedades";
import BadgeAltas from "../components/badges/BadgeAltas";


const navigationConfig = [
  {
    id: "home",
    title: "Home",
    type: "item",
    icon: <FontAwesomeIcon icon={faHome} />,
    permissions: ["ADM", "RRHH", "GTE", "APR", "SU","GTEF"],
    navLink: "/home",
  },
  {
    id: "altas",
    title: "Altas",
    type: "item",
    badge: "primary",
    badgeText: <BadgeAltas />,
    icon: <FontAwesomeIcon icon={faUserPlus} />,
    permissions: ["RRHH", "GTE", "APR", "SU","GTEF"],
    navLink: "/altas",
  },

  {
    id: "empleados",
    title: "Empleados",
    type: "item",
    icon: <FontAwesomeIcon icon={faList} />,
    permissions: ["RRHH", "GTE", "APR", "SU","GTEF"],
    navLink: "/empleados",
  },
  

  {
    id: "incrementos",
    title: "Incrementos",
    type: "item",
    icon: <FontAwesomeIcon icon={faChartLine} />,
    permissions: ["RRHH", "GTE", "APR", "SU","GTEF"],
    navLink: "/incrementos-masivos",
  },

  {
    id: "gratificacion_especial",
    title: "Gratificacion Especial",
    type: "item",
    icon: <FontAwesomeIcon icon={faMoneyBillAlt} />,
    permissions: ["RRHH", "GTE", "SU","GTEF"],
    navLink: "/gratificacion_especial",
  },
  {
    id: "bono_trimestral_rrhh",
    title: "RRHH: Bono trimestral",
    type: "item",
    icon: <FontAwesomeIcon icon={faMoneyBillAlt} />,
    permissions: ["RRHH", "SU"],
    navLink: "/bono_trimestral_rrhh",
  },
  {
    id: "bono_trimestral",
    title: "Bono Trimestral",
    type: "item",
    icon: <FontAwesomeIcon icon={faMoneyBillAlt} />,
    permissions: ["RRHH", "GTE", "SU","GTEF"],
    navLink: "/bono_trimestral",
  },
  {
    id: "bono_semestral",
    title: "Bono Semestral",
    type: "item",
    icon: <FontAwesomeIcon icon={faMoneyBillAlt} />,
    permissions: ["RRHH", "GTE", "SU","GTEF"],
    navLink: "/bono_semestral",
  },
  {
    id: "comisiones",
    title: "comisiones",
    type: "item",
    icon: <FontAwesomeIcon icon={faDollarSign} />,
    permissions: ["RRHH", "GTE", "SU","GTEF"],
    navLink: "/comisiones",
  },
  {
    id: "novedades",
    title: "Novedades",
    type: "item",
    badge: "primary",
    badgeText: <BadgeNovedades />,
    icon: <FontAwesomeIcon icon={faBell} />,
    permissions: ["RRHH", "APR", "GTE", "SU","GTEF"],
    navLink: "/novedades",
  },

  {
    id: "revision",
    title: "Evolutivo",
    type: "item",
    icon: <FontAwesomeIcon icon={faChartLine} />,
    permissions: ["RRHH", "SU", "GTE", "APR","GTEF"],
    navLink: "/revision",
  },

  {
    id: "comparaciones",
    title: "Comparar Empleados",
    type: "item",
    icon: <FontAwesomeIcon icon={faUserFriends} />,
    permissions: ["RRHH", "SU", "GTE","GTEF"],
    navLink: "/comparaciones",
  },

  {
    id: "usuario",
    title: "Usuarios",
    type: "item",
    icon: <FontAwesomeIcon icon={faUsers} />,
    permissions: ["ADM", "SU", "RRHH"],
    navLink: "/usuarios",
  },

  {
    id: "llaves",
    title: "Llaves Distribucion",
    type: "item",
    icon: <FontAwesomeIcon icon={faKey} />,
    permissions: ["RRHH", "SU"],
    navLink: "/llaves",
  },
  {
    id: "Centro de Costos",
    title: "Centro de Costos",
    type: "item",
    icon: <FontAwesomeIcon icon={  faMoneyCheck} />,
    permissions: ["RRHH","SU"],
    navLink: "/centro-costos",
  },


  {
    id: "cuentascontables",
    title: "Cuentas Contables",
    type: "item",
    icon: <FontAwesomeIcon icon={faList} />,
    permissions: ["RRHH", "SU"],
    navLink: "/cuentas-contables",
  },

  {
    id: "configuracion",
    title: "Configuracion",
    type: "item",
    icon: <FontAwesomeIcon icon={faTools} />,
    permissions: ["RRHH", "SU"],
    navLink: "/configuraciones",
  },

  {
    id: "configuracion_comisiones",
    title: "Comisiones",
    type: "collapse",
    icon: <FontAwesomeIcon icon={faPercent} />,
    permissions: ["RRHH", "SU"],
    children: [
      {
        id: "configuracion_cuotapartistas",
        title: "Cuotapartistas",
        type: "item",
        icon: <FontAwesomeIcon icon={faCodeBranch} />,
        permissions: ["RRHH", "SU"],
        navLink: "/configuracion-comisiones/cuotapartistas",
      },
    ],
  },

  {
    id: "ayuda",
    title: "Ayuda",
    type: "item",
    icon: <FontAwesomeIcon icon={faLightbulb} />,
    permissions: ["RRHH", "SU", "GTE", "APR","GTEF"],
    navLink: "/ayuda",
  },
];

export default navigationConfig;
