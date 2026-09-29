import React, { useState, FC} from "react";

import { COLORS } from "../../../utility/utils";
import {
    Button,
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress'; 
import EmpleadosContainer from "../../../containers/Empleados/EmpleadosContainer";
import OficialesCuentaContainer from "../../../containers/OficialesCuenta/OficialesCuentaContainer";






const Index: FC = () => {
    const [showOficiales, setShowOficiales] = useState<boolean>(false);
    const [isSwitching, setIsSwitching] = useState<boolean>(false);

    const handleButtonClick = (show: boolean) => {
        setIsSwitching(true);  
        setTimeout(() => {
            setShowOficiales(show);
            setIsSwitching(false); 
        }, 500);  
    };

    return (
        <div>
            <Row>
                <Col md={3}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md={12}>
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                        <div style={{ width: '100%', height: '100%', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                            <Button
                                                size='md' 
                                                color={'primary'} 
                                                outline={showOficiales}  
                                                onClick={() => handleButtonClick(false)}
                                            >
                                                <span style={{ color: (showOficiales) ? COLORS.SECONDARY : COLORS.WHITE }}> Empleados </span>
                                            </Button>
                                        </div>

                                        <div style={{ width: '100%', height: '100%', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                            <Button
                                                size='md' 
                                                color={'primary'} 
                                                outline={!showOficiales}  
                                                onClick={() => handleButtonClick(true)}
                                            >
                                                <span style={{ color: (!showOficiales) ? COLORS.SECONDARY : COLORS.WHITE }}> Oficiales de Cuenta </span>
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    {isSwitching ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , height:'35vh'}}>
                            <CircularProgress sx={{  color: "darkblue" }} />
                        </div>
                    ) : (
                        <>
                            <div className={showOficiales ? "d-none" : ""}>
                                <EmpleadosContainer />
                            </div>

                            <div className={!showOficiales ? "d-none" : ""}>
                                <OficialesCuentaContainer />
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};


export default Index;
