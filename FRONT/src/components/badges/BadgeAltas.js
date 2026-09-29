import { useEffect } from "react";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import API from "../../api";
import { setAltas } from "../../redux/actions/novedades";

const BadgeAltas = (props) => {
    const { altas, setAltas } = props; 

    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : {}; 
    const rolCodigo = user?.rol?.codigo; 


    useEffect(() => {
        API.getAltas().then((response) => {
            let total = 0;
            response.data.altas.forEach((e) => {
                if ((rolCodigo === "APR" || rolCodigo === "SU") && e?.estado?.codigo === "PEN") {
                    total += 1;
                } else if ((rolCodigo === "RRHH" || rolCodigo === "SU") && e?.estado?.codigo === "APR") {
                    total += 1;
                }
            });
            setAltas(total); 
        });
    }, [rolCodigo, setAltas]);

    return altas !== 0 ? altas : '';
};

const mapStateToProps = (state) => ({
    altas: state.novedadesReducer.altas,
});


const mapDispatchToProps = (dispatch) => ({
    setAltas: (total) => dispatch(setAltas(total)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BadgeAltas);

