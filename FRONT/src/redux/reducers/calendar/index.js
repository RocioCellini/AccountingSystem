const initialState = {
  events: [],
  sidebar: false,
  selectedEvent: null
}

const calenderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_EVENTS":
      return { ...state, events: action.events, totales: action.totales }
    case "HANDLE_SIDEBAR":
      return { ...state, sidebar: action.status }
    case "HANDLE_SELECTED_EVENT":
      return { ...state, selectedEvent: action.event }
    default:
      return state
  }
}

export default calenderReducer
