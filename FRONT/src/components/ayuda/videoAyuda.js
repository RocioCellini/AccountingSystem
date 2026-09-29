import React from "react"
import {
    Collapse,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    TabContent,
    TabPane,
    Row, Col
} from "reactstrap"
import classnames from "classnames"
import {  ChevronDown } from "react-feather"
import { accordion } from "./../../components/collapse/CollapseSourceCode"
import ReactPlayer from "react-player";
import loginImg from "../../assets/img/logo/LogoAccounting.png";

const collapseItems = [
    {
        id: 1,
        title: "Carga de Nueva alta",
        source:"videos/Altas.mp4",
    },
    {
        id: 2,
        title: "Carga de Incrementos y Horas Extras",
        source:"videos/Incrementos.mp4",
    },
    {
        id: 3,
        title: "Carga de Comisiones",
        source:"videos/Comisiones.mp4",
    },
    {
        id: 4,
        title: "Carga de Bono Semestral",
        source:"videos/Bono Semestral.mp4",
    },
    {
        id: 5,
        title: "Carga de Bono Trimestral",
        source:"videos/Bono Trimestral.mp4",
    },
    {
        id: 6,
        title: "Carga de Gratificaciones Especiales",
        source:"videos/Gratificacion Especial.mp4",
    },
]

class VideoAyuda extends React.Component {
    state = {
        activeTab: "1",
        collapseID: "",
        status: "Closed"
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab })
        }
    }

    toggleCollapse = collapseID => {
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }))
    }
    onEntered = id => {
        if (id === this.state.collapseID) this.setState({ status: "Opened" })
    }
    onEntering = id => {
        if (id === this.state.collapseID) this.setState({ status: "Opening..." })
    }

    onExited = id => {
        if (id === this.state.collapseID) this.setState({ status: "Closed" })
    }

    onExiting = id => {
        if (id === this.state.collapseID) this.setState({ status: "Closing..." })
    }

    render() {
        const accordionItems = collapseItems.map(collapseItem => {
            return (
                <Card
                    key={collapseItem.id}
                    onClick={() => this.toggleCollapse(collapseItem.id)}
                    className={classnames({
                        "collapse-collapsed":
                            this.state.status === "Closed" &&
                            this.state.collapseID === collapseItem.id,
                        "collapse-shown":
                            this.state.status === "Opened" &&
                            this.state.collapseID === collapseItem.id,
                        closing:
                            this.state.status === "Closing..." &&
                            this.state.collapseID === collapseItem.id,
                        opening:
                            this.state.status === "Opening..." &&
                            this.state.collapseID === collapseItem.id
                    })}
                >
                    <CardHeader>
                        <CardTitle className="lead collapse-title collapsed">
                            {collapseItem.title}
                        </CardTitle>
                        <ChevronDown size={15} className="collapse-icon" />
                    </CardHeader>
                    <Collapse
                        isOpen={collapseItem.id === this.state.collapseID}
                        onEntering={() => this.onEntering(collapseItem.id)}
                        onEntered={() => this.onEntered(collapseItem.id)}
                        onExiting={() => this.onExiting(collapseItem.id)}
                        onExited={() => this.onExited(collapseItem.id)}
                    >
                        <CardBody>
                            {/*collapseItem.content*/}
                            <Row style={{marginTop:30}}>
                                <Col md={12}>
                                    <div className='player-wrapper'>
                                        <ReactPlayer
                                            className='react-player'
                                            url= {collapseItem.source}
                                            width='50%'
                                            height='50%'
                                            controls = {true}

                                        />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Collapse>
                </Card>
            )
        })

        return (
            <React.Fragment>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <span>
                                Necesitas Ayuda con Accounting System?
                            </span>
                            <img src={loginImg} style={{position:'absolute',right:0, height:50, width:200, objectFit:'contain'}} />
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <p>
                            Elegi el item que necesitas!
                        </p>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <div className="vx-collapse collapse-bordered">
                                    {accordionItems}
                                </div>
                            </TabPane>
                            <TabPane className="component-code" tabId="2">
                                {accordion}
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}
export default VideoAyuda
