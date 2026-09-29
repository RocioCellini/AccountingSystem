export interface Rol {
  id: number;
  descripcion: string | null;
  codigo: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Puesto {
  id: number;
  descripcion: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Empresa {
  id: number;
  descripcion: string | null;
  codigo: string | null;
  created_at: string | null;
  updated_at: string | null;
  conexion: string | null;
}

export interface Sector {
  id: number;
  descripcion: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Padre {
  id: number;
  nombre_apellido: string | null;
  fecha_nacimiento: string | null;
  documento: string | null;
  plan_osde: string | null;
  titulo_puesto: string | null;
  fecha_ingreso: string | null;
  fecha_baja: string | null;
  sueldo_bruto: string | null;
  dias_vacaciones: string | null;
  bono_semestral: string | null;
  puesto_id: string | null;
  empresa_id: string | null;
  sector_id: string | null;
  padre_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  es_comercial: string | null;
  email: string | null;
  subsegmento_id: string | null;
  repite_bono_semestral: string | null;
  nunca_liquido_bonus: string | null;
  llave_distribucion_id: string | null;
  meses_reconocidos: string | null;
  tipo_empleado: string | null;
  ant_reconocida: string | null;
  legajo_bejerman: string | null;
  legajo_sun: string | null;
  fecha_ingreso_formatted: string | null;
  fecha_baja_string: string | null;
  fecha_ingreso_string: string | null;
  fecha_nacimiento_string: string | null;
  ultimo_sueldo: string | null;
  es_baja: boolean;
  es_favorito: boolean;
  edad: number | null;
}

export interface Estado {
  id: number;
  descripcion: string | null;
  codigo: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Archivo {
  id: number;
  nombre: string | null;
  ruta: string | null;
  alta_id: string | null;
  empleado_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  path: string | null;
}

export interface Alta {
  id: number;
  nombre: string | null;
  fecha_nacimiento: string | null;
  documento: string | null;
  plan_osde: string | null;
  titulo_puesto: string | null;
  fecha_ingreso: string | null;
  sueldo_bruto: string | null;
  dias_vacaciones: string | null;
  bono_semestral: string | null;
  puesto_id: string | null;
  empresa_id: string | null;
  sector_id: string | null;
  padre_id: string | null;
  user_id: string | null;
  estado_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  aprobador_id: number | null;
  apellido: string | null;
  created_by: string | null;
  updated_by: string | null;
  subsegmento_id: string | null;
  consultora: string | null;
  updated_at_formatted: string | null;
  fecha_ingreso_formatted: string | null;
  fecha_ingreso_string: string | null;
  fecha_nacimiento_string: string | null;
  puesto: Puesto | null;
  empresa: Empresa | null;
  sector: Sector | null;
  padre: Padre | null;
  estado: Estado | null;
  subsegmento: any | null;
  archivos: Archivo[] | null;
  nombre_apellido?: string;
  obj?: string;
}

export interface Empleado extends Padre {}

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  rol_id: string | null;
  empleado_id: string | null;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  active: string | null;
  updated_at_formatted: string | null;
  rol: Rol | null;
  empleado: Empleado | null;
}

export interface DataTableColumn {
  name: string;
  selector?: string;
  width?: string;
  cell?: (row: Alta) => JSX.Element;
}

export interface AltasProps {
  getAltas: () => void;
  getInfo: () => void;
  altas: Alta[];
  user: User | null;
}