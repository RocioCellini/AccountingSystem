import React, { FC, ChangeEvent } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { COLORS } from "../../../utility/utils";
import {
    Input,
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';


interface OficialesCuentaListsProps {
    buscador: string;
    setBuscador: (value: string) => void;
    data: any[];
    columns: IDataTableColumn<any>[];
    customStyles?: any;
    isLoading: boolean;
}

const OficialesCuentaLists: FC<OficialesCuentaListsProps> = (props) => {
    const { buscador, setBuscador, data, columns, customStyles, isLoading } = props;

  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBuscador(e.target.value);
    };

    return (
        <div>
            <Row style={{ marginTop: 30 }}>
                <Col md={12} style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: 30, color: COLORS.SECONDARY, fontWeight: 'bold' }}>Oficiales de Cuenta</span>

                    <Input
                        type="text"
                        placeholder="Buscador"
                        style={{ width: 300, borderRadius: 10, marginLeft: 30, marginRight: 30 }}
                        value={buscador}
                        onChange={handleInputChange}
                    />
                </Col>
            </Row>

            <Card style={{ marginTop: 30 }}>
                <CardBody>
                    <DataTable
                        data={!isLoading ? data : []}
                        columns={columns}
                        pagination
                        striped={true}
                        noDataComponent={isLoading ? <CircularProgress sx={{  color: "darkblue" }} /> : 'Lo sentimos, no se encuentran datos disponibles en este momento.'}
                        customStyles={customStyles}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default OficialesCuentaLists;
