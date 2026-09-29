import React from "react"
import {COLORS} from "../../../utility/utils";
import API from './../../../api';
import {
    Card,
    CardBody,
} from "reactstrap";
import TablaDistribucionBonosTrimestrales from "../../../components/bono_trimestral/TablaDistribucionBonosTrimestrales";
import TablaDistribucionBonosTrimestralesAprobados
    from "../../../components/bono_trimestral/TablaDistribucionBonosTrimestralesAprobados";

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            data:[],
            dataFull:[],
            user:[],
            roles:[],
            columns:[]
        }

    }

    componentDidMount(){
        API.getInfo().then((response)=>{
            this.setState({user:response.data});
        });
    }



    render(){
        return (
            <Card>
                <CardBody>

                    <h1 style={{color:COLORS.SECONDARY}}>Carga de Bono Trimestral</h1>

                    <div>
                        {this.state.user.id &&
                        <TablaDistribucionBonosTrimestrales user={this.state.user}/>
                        }

                        {this.state.user.id &&
                        <TablaDistribucionBonosTrimestralesAprobados user={this.state.user}/>
                        }
                    </div>

                </CardBody>
            </Card>
        )
    }
}

export default Index
