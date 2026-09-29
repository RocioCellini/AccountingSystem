import React from 'react';
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { Mail, Lock } from "react-feather";
import "../../../../../../assets/scss/pages/authentication.scss";

type UserPasswordProps = {
    setLogin: Function;
    setUser: Function;
    email: string;
    password: string;
    setUserEmail: Function;
    setUserPassword: Function;
    loading: boolean;
};

const UserPassword = ({
    setLogin,
    email,
    password,
    setUserEmail,
    setUserPassword,
    loading
}: UserPasswordProps) => {

    return (
        <Form onSubmit={(e: any) => e.preventDefault()}>
            <FormGroup className="form-label-group position-relative has-icon-left">
                <Input
                    type="email"
                    placeholder="Usuario"
                    value={email}
                    onChange={(e: any) => {
                        setUserEmail(e.target.value);
                    }}
                />
                <div className="form-control-position">
                    <Mail size={15} />
                </div>
                <Label>Email</Label>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left">
                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e: any) => {
                        setUserPassword(e.target.value);
                    }}
                />
                <div className="form-control-position">
                    <Lock size={15} />
                </div>
                <Label>Contraseña</Label>
            </FormGroup>
            <div className="d-flex justify-content-between">
                <Button
                    color="primary"
                    type="submit"
                    onClick={() => setLogin()}
                    style={{ width: "100%" }}
                >
                    {!loading ? "INGRESAR" : "Cargando..."}
                </Button>
            </div>
        </Form>
    );
}

export default UserPassword;
