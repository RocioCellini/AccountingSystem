import React from 'react';
import { Button, Form, FormGroup } from "reactstrap";
import "../../../../../../assets/scss/pages/authentication.scss";
import ReactInputVerificationCode from 'react-input-verification-code';

type CodeAccessProps = {
    loading: boolean;
    setPassCode: Function;
    prelogin: Function;
};

const CodeAccess = ({ loading, setPassCode, prelogin }: CodeAccessProps) => {
    return (
        <Form onSubmit={(e: any) => e.preventDefault()}>
            <FormGroup className="form-label-group position-relative has-icon-left">
                <ReactInputVerificationCode
                    length={6}
                    placeholder={'*'}
                    autoFocus={true}
                    onChange={(val) => setPassCode(val)}
                />
                <a style={{ color: "blue" }} onClick={() => window.location.reload()}>Cambiar usuario</a>
            </FormGroup>
            <div className="d-flex justify-content-between">
                <Button color="primary" type="submit" onClick={() => prelogin()}>
                    {loading ? "Cargando..." : "Aceptar"}
                </Button>
            </div>
        </Form>
    );
};

export default CodeAccess;
