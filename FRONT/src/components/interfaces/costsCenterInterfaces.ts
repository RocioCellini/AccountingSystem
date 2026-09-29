
export interface CostCenter {
  data: {
      id?: number | undefined;
      descripcion: string;
      tipo: string;
  };
}

export interface CostsCenterProps {
  getAllCenterAction: () => void;
  deleteCenterAction: (id: number, meta: { resolve: (value?: any) => void; reject: (reason?: any) => void; }) => void;
  updateCenterAction: (data: CostCenter, meta: { resolve: (value?: any) => void; reject: (reason?: any) => void; }) => void;
  createCenterAction: (data: CostCenter, meta: { resolve: (value?: any) => void; reject: (reason?: any) => void; }) => void;
  data: CostCenter[];
  isLoading: boolean;
}

export interface EditData {
  [key: number]: CostCenter;
}

export interface UpdateResponse {
  code: number;
  status: string;
  data: {
      id: number;
      descripcion: string;
      tipo: string;
      created_by: string;
      updated_by: number;
      created_at: string;
      updated_at: string;
  };
}
