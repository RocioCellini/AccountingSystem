import React from "react";
import DataTable from "react-data-table-component";
import { COLORS } from "../../../utility/utils";
import {
    Input,
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import { CircularProgress } from "@mui/material";


const EmpleadosList = (props: any) => {
    const { data, columns, buscador, setBuscador, getEmpleadosAction, soloActivos, setSoloActivos, customStyles, isLoading } = props;



    return (
        <div>
            <Row style={{ marginTop: 30 }}>
                <Col md={12} style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>

                    <span style={{ fontSize: 30, color: COLORS.SECONDARY, fontWeight: 'bold' }}>Empleados</span>

                    <Input
                        type="text"
                        placeholder="Buscador"
                        style={{ width: 300, borderRadius: 10, marginLeft: 30, marginRight: 30 }}
                        value={buscador}
                        onChange={e => setBuscador(e.target.value)}
                    />

                    <Checkbox
                        color="primary"
                        icon={<Check className="vx-icon" size={20} />}
                        defaultChecked={true}
                        label={soloActivos ? 'Solo Empleados Activos' : 'Todos los empleados'}
                        size="md"
                        onChange={(e: any) => {
                            getEmpleadosAction(false, !soloActivos);
                            setSoloActivos(!soloActivos);
                        }}
                    />
                </Col>
            </Row>

            <Card style={{ marginTop: 30 }}>
                <CardBody>
                    <DataTable
                        data={ data}
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
}

export default EmpleadosList;
