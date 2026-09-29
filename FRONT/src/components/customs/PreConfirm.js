import React, {useEffect, useState} from "react";
import SweetAlert from 'react-bootstrap-sweetalert';

const PreConfirm = (props)=>{
    const [preShow, setPreShow] = useState(props.show);
    const [texto, setTexto] = useState(props.texto);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);


    return (
          <div>
              <SweetAlert title={texto}
                          warning
                          show={preShow}
                          showCancel
                          reverseButtons
                          cancelBtnBsStyle="danger"
                          confirmBtnText="Si"
                          cancelBtnText="No"
                          onConfirm={() => {
                              setPreShow(false);
                              props.fnSuccess();
                              setShowSuccess(true);
                          }}
                          onCancel={() => {
                              setPreShow(false);
                              setShowError(true);
                          }}
              >
              </SweetAlert>

              <SweetAlert success title="Exito!"
                          confirmBtnBsStyle="success"
                          show={showSuccess}
                          onConfirm={() => {
                              setShowSuccess(false);
                          }}
              >
              </SweetAlert>

              <SweetAlert error title="Cancelado"
                          confirmBtnBsStyle="danger"
                          show={showError}
                          onConfirm={() =>{
                              setShowError(false);
                          }}
              >
              </SweetAlert>
          </div>
    );
}

export default PreConfirm;