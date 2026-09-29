import React from "react";
import { Card, Row, Col, CardBody } from "reactstrap";
import loginImg from "../../../../assets/img/logo/LogoAccounting.png";
import "../../../../assets/scss/pages/authentication.scss";
import CodeAccess from "./auxiliars/CodeAccess/CodeAcess";
import UserPassword from "./auxiliars/UserPassword/UserPassword";

type LoginProps = {
    setLogin: Function;
    email: string;
    password: string;
    setUserEmail: Function;
    setUserPassword: Function;
    codeAccess: any;
    mfa: boolean; 
    message: string;
    loading: boolean;
    setPassCode: Function;
    prelogin: Function;
    setUser: Function;
};

const Login = ({
    setLogin,
    email,
    password,
    setUserEmail,
    setUserPassword,
    setUser,
    codeAccess,
    mfa,  
    message,
    loading,
    setPassCode,
    prelogin,
}: LoginProps) => {
    return (
        <Row className="m-0 justify-content-end" style={{ height: "100vh" }}>
            <Col
                lg="3"
                md="4"
                sm="12"
                className="d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <img src={loginImg} alt="Logo" style={{ width: 200, marginBottom: 30 }} />
                <Card className="w-100" style={{ border: "none" }}>
                    <CardBody>
                        <span style={{ fontSize: "13px", fontWeight: "bold", textAlign: "center", display: "block" }}>
                            Ingrese con sus credenciales OKTA de Windows:
                        </span>
                        {!mfa ? (
                            <UserPassword
                                setLogin={setLogin}
                                setUser={setUser}
                                email={email}
                                password={password}
                                setUserEmail={setUserEmail}
                                setUserPassword={setUserPassword}
                                loading={loading}
                            />
                        ) : (
                            <CodeAccess
                                loading={loading}
                                setPassCode={setPassCode}
                                prelogin={prelogin}
                            />
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
