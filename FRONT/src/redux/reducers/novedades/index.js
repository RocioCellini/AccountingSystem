const initialState =  {
  novedades:0,
  horasExtras:0,
  altas:0,
  comsiones:0,
  bonos:0
}

const novedadesReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'setNovedades':
      return {
        ...state,
        novedades: action.payload
      }

    case 'setHorasExtras':
      return {
        ...state,
        horasExtras: action.payload
      }

    case 'setAltas':
      return {
        ...state,
        altas: action.payload
      }

    case 'setComisiones':
      return {
        ...state,
        comisiones: action.payload
      }

    case 'setBonos':
      return {
        ...state,
        bonos: action.payload
      }


    default:
      return state
  }
}

export default novedadesReducer;
