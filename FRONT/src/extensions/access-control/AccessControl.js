import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  UncontrolledCollapse
} from "reactstrap";
import ExtensionsHeader from "../extensionsHeader";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { changeRole } from "../../redux/actions/auth/loginActions";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import { ChevronDown } from "react-feather";
import Cookies from "js-cookie";

class AccessControl extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : {};
    const role = user?.rol?.codigo;

    if (role && role !== state.role) {
      return {
        role
      };
    }
    return null;
  }

  state = {
    role: this.getRoleFromCookies()
  };

  getRoleFromCookies() {
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : {};
    return user?.rol?.codigo;
  }

  render() {
    return (
      <React.Fragment>
        <ExtensionsHeader
          title="Access Control"
          subTitle="Add route protection using Vuexy's Access Control"
        />
        <Card>
          <CardBody className="pt-2">
            Your current role is: <strong>{this.state.role}</strong>
            <div className="d-flex justify-content-start flex-wrap align-items-center mt-1">
              <Radio
                name="role-radio"
                label="Editor"
                className="mr-1"
                defaultChecked={this.state.role === "editor"}
                onClick={() => this.props.changeRole("editor")}
              />
              <Radio
                name="role-radio"
                label="Admin"
                defaultChecked={this.state.role === "admin"}
                onClick={() => this.props.changeRole("admin")}
              />
            </div>
            <Card className="border mt-3">
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardBody>
                <Button color="primary">Editor & Admin</Button>
                {this.state.role === "admin" && (
                  <Button className="ml-2" color="primary">
                    Admin Only
                  </Button>
                )}
              </CardBody>
            </Card>
            <Card className="border mt-3">
              <CardHeader>
                <CardTitle>Collapse</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="vx-collapse collapse-bordered">
                  <Card>
                    <CardHeader id="item-1">
                      <CardTitle className="lead collapse-title collapsed">
                        Article 1
                      </CardTitle>
                      <ChevronDown size={15} className="collapse-icon" />
                    </CardHeader>
                    <UncontrolledCollapse toggler="#item-1">
                      <CardBody>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Quisque rhoncus eros tortor, non fringilla lectus cursus
                        et. Fusce vel nisi ante. Aliquam sit amet lectus
                        pharetra, luctus mi sed, aliquet felis. Mauris a tortor
                        viverra, ornare tellus in, consectetur leo.
                      </CardBody>
                    </UncontrolledCollapse>
                  </Card>
                  <Card>
                    <CardHeader id="item-2">
                      <CardTitle className="lead collapse-title collapsed">
                        Article 2
                      </CardTitle>
                      <ChevronDown size={15} className="collapse-icon" />
                    </CardHeader>
                    <UncontrolledCollapse toggler="#item-2">
                      <CardBody>
                        Nunc auctor et leo vitae suscipit. Nullam aliquet purus
                        scelerisque enim hendrerit tristique.
                      </CardBody>
                    </UncontrolledCollapse>
                  </Card>
                  {this.state.role === "admin" && (
                    <Card>
                      <CardHeader id="item-3">
                        <CardTitle className="lead collapse-title collapsed">
                          Article 3 - Admin Only
                        </CardTitle>
                        <ChevronDown size={15} className="collapse-icon" />
                      </CardHeader>
                      <UncontrolledCollapse toggler="#item-3">
                        <CardBody>
                          Suspendisse aliquet condimentum diam, sed aliquam nisl
                          dapibus et. Aliquam euismod ullamcorper dolor eu
                        </CardBody>
                      </UncontrolledCollapse>
                    </Card>
                  )}
                  <Card>
                    <CardHeader id="item-4">
                      <CardTitle className="lead collapse-title collapsed">
                        Article 4
                      </CardTitle>
                      <ChevronDown size={15} className="collapse-icon" />
                    </CardHeader>
                    <UncontrolledCollapse toggler="#item-4">
                      <CardBody>
                        Suspendisse aliquet condimentum diam, sed aliquam nisl
                        dapibus et. Aliquam euismod ullamcorper dolor eu
                        imperdiet.
                      </CardBody>
                    </UncontrolledCollapse>
                  </Card>
                </div>
              </CardBody>
            </Card>
            <Card className="border mt-3">
              <CardHeader>
                <CardTitle>Route Protection</CardTitle>
              </CardHeader>
              <CardBody>
                <p>
                  You can add route protection using file{" "}
                  <strong>navigationConfig</strong>. Only admin can visit
                  eCommerce Dashboard.
                </p>
                <Button
                  color={this.state.role === "admin" ? "primary" : "danger"}>
                  <Link to="/ecommerce-dashboard" className="text-white">
                    Visit
                  </Link>
                </Button>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default connect(null, { changeRole })(AccessControl);
