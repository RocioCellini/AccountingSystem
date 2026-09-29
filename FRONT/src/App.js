import React from "react"
import Router from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"
import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./assets/scss/plugins/extensions/toastr.scss"
import "./assets/scss/plugins/extensions/sweet-alerts.scss"


const App = props => {

  return (
      <div>
        <ToastContainer />
        <Router />
      </div>
  );
}

export default App
