import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { ShowAlert } from "../../components/@vuexy/showAlert/ShowAlert";
import Login from "../../views/pages/authentication/login/Login";
//import { login, loginOKTA } from "../../redux/actions/user/user.actions";
import { login } from "../../redux/actions/user/user.actions"; //editado para sacar OKTA

interface IUser {
    email: string;
    password: string;
}

const LoginContainer = (props: any) => {
    const { loginAction, loginOKTAAction, loading, statusAccess, message, mfa } = props;    
    const [userData, setUser] = useState<IUser>({ email: "", password: "" });
    const [passCode, setPassCode] = useState<string>("");

    useEffect(() => {
        if (statusAccess) {
            props.history.push('/home');
        }
    }, [statusAccess, props.history]);

    const setLogin = async () => {
        const { email, password } = userData;
        if (!email || !password) {
            ShowAlert.error("Por favor revise que estén todos los campos completos.");
        } else {
            const datas = {
                //username: email,
                //password: password,
                email,  //editado para sacar OKTA
                password,
            };
            loginAction(datas);
        }
    };

    const prelogin = async () => {
        if (passCode.includes("*")) {
            ShowAlert.error("Por favor complete el código.");
        } else {
            const datas = {
                factorId: props.user.factorId,
                stateToken: props.user.stateToken,
                passCode: passCode
            };
            loginOKTAAction(datas);
        }
    };  //editado para sacar OKTA

    return (
        <Login
            setLogin={setLogin}
            setUser={setUser}
            email={userData.email}
            password={userData.password}
            setUserEmail={(email: string) => setUser({ ...userData, email })}
            setUserPassword={(password: string) => setUser({ ...userData, password })}
            codeAccess={props.user.codeAccess}
            mfa={mfa}
            message={message}
            loading={loading}
            setPassCode={setPassCode}
            prelogin={prelogin}
        />
    );
};

const mapStateToProps = (state: { user: { loading: any; info: any, message: any, user: any } }) => ({
    loading: state.user.loading,
    statusAccess: state.user.info.statusAccess,  
    user: state.user.info,
    mfa: state.user.info.mfa,  
    message: state.user.message,
});

const mapDispatchToProps = (dispatch: any) => ({
    loginAction: bindActionCreators(login, dispatch),
   // loginOKTAAction: bindActionCreators(loginOKTA, dispatch),  //editado para sacar OKTA
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
