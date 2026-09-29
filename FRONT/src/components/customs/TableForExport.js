import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExcel} from "@fortawesome/free-solid-svg-icons";
import {Button} from "reactstrap";
import React, {useEffect, useState} from "react";

const TableForExport = (props) =>{
    const [ignore, setIgnore] = useState([])
    const [data, setData] = useState([]);

    useEffect(()=>{
        setData(props.data);
        if(props.ignore!=undefined){
            setIgnore(props.ignore);
        }

    },[props])

    return (
        <div>
            <Button.Ripple outline={true} color="success" style={{marginLeft:30}} id="buttonForExportXLS" size='sm' onClick={()=>{
                var elem = document.getElementById("buttonForExportXLS");
                var table = document.getElementById("tableForExportXLS");
                var html = table.outerHTML;
                var url = 'data:application/vnd.ms-excel,' + escape(html);
                elem.setAttribute("href", url);
                elem.setAttribute("download", "export.xls");
                window.open(url, '_blank');
            }}>
                <FontAwesomeIcon icon={faFileExcel}  size={'2x'} style={{marginRight:10}}/>   Exportar Excel
            </Button.Ripple>
            <table style={{display:'none'}} id={'tableForExportXLS'} >
                <thead>
                {data.length>0 &&
                <tr>
                    {Object.keys(data[0]).map((e, i) => {
                        if(!ignore.includes(e.toLowerCase())){
                            return (
                                <td>{e.toUpperCase()}</td>
                            );
                        }
                    })}
                </tr>}
                </thead>
                <tbody>
                {data.map((row)=>{
                    return (
                        <tr>
                            {Object.keys(row).map((e, i) => {
                                if(!(ignore.includes(e.toLowerCase()))){
                                    return (
                                        <td>{row[e]}</td>
                                    );
                                }
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default TableForExport;