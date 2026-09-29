//export const API_URL = process.env.REACT_APP_API_ENDPOINT;
export const API_URL = "http://localhost:8000/api/";
export default { API_URL };

export const ApiConfig = {
    //LOGIN: `${API_URL}loginOKTA`,   
    //LOGIN_VERIFY_OKTA: `${API_URL}verifyOKTA`,
    LOGIN: `${API_URL}login`,       //editado para sacar OKTA
  };