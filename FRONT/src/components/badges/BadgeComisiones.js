import React, {useEffect} from "react"
import {useDispatch, useSelector} from 'react-redux'
import API from "../../api";
import {setAltas} from "../../redux/actions/novedades";

const BadgeComisiones = (props)=>{
    const comisiones = useSelector(state => state.novedadesReducer.comisiones);
    const dispatch = useDispatch();

    useEffect(()=>{

    });


    return (comisiones!=0 ? comisiones : '');
}

export default BadgeComisiones