import {useEffect, useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import API from "../../api";
import {setHorasExtras, setNovedades, setComisiones, setBonos} from "../../redux/actions/novedades";

const BadgeNovedades = ()=>{
    const novedades = useSelector(state => state.novedadesReducer.novedades);
    const bonos = useSelector(state => state.novedadesReducer.bonos);
    const horasExtras = useSelector(state => state.novedadesReducer.horasExtras);
    const comisiones = useSelector(state => state.novedadesReducer.comisiones);
    const [total,setTotal] = useState(0);
    const dispatch = useDispatch();
    const [user,setUser]=useState([]);


    useEffect(()=>{
        API.getInfo().then((response)=>{
            setUser(response.data);
        })

        API.getNovedadesPendientesAprobacion().then((response)=>{
            dispatch(setNovedades(response?.data.novedades?.length || 0));
        });

        API.getBonosPendientesDeAprobacion().then((response)=>{
            dispatch(setBonos(response?.data.bonos?.length || 0));
        });

        API.getHorasExtrasPendientesAprobacion().then((response)=>{
            dispatch(setHorasExtras(response?.data.novedades?.length || 0));
        });

        API.getComisionesPendientes().then((response)=>{
            dispatch(setComisiones(response?.data.comisiones?.length || 0));
        });
    },[]);

    useEffect(()=>{
        let temp = 0;
        if(["RRHH","GTE","SU","GTEF"].includes(user?.rol?.codigo)){
            temp += Number(comisiones) || 0;
        }

        if(["RRHH","APR","SU","GTEF"].includes(user?.rol?.codigo)){
            temp += Number(novedades) || 0;
            temp += Number(horasExtras) || 0;
            temp += Number(bonos) || 0;
        }
        setTotal(temp);
    },[novedades,horasExtras,comisiones,user,bonos]);

    return (total !== 0 ? total : '');
}

export default BadgeNovedades;
