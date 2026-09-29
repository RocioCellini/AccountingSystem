import React from "react";
import {
  FormGroup,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { connect } from "react-redux";
import * as Icon from "react-feather";
import { history } from "../../../history";
import { logout } from "../../../redux/actions/user/user.actions"; 
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import API from "./../../../api";
import Cookies from "js-cookie";

class NavbarUser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      navbarSearch: false,
      suggestions: [],
      modal: false,
    };

    this.changePassword = this.changePassword.bind(this);
  }

  handleNavbarSearch = () => {
    this.setState({
      navbarSearch: !this.state.navbarSearch,
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  async changePassword() {
    API.changePassword(this.state.password).then(response => {
      this.setState({ modal: false });
    });
  }

  handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("api_token")
    localStorage.removeItem("rol");

    this.props.logout();

    history.push("/login");
  };

  render() {
    const user = JSON.parse(Cookies.get("user") || "{}");
    return (
      <div>
        <ToastContainer />

        <ul className="nav navbar-nav navbar-nav-user float-right">
          {user !== undefined && (
            <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
              <DropdownToggle tag="a" className="nav-link dropdown-user-link">
                <div className="user-nav d-sm-flex d-none">
                  <span className="user-name text-bold-600 text-uppercase text-primary">
                    {user?.name}
                  </span>
                </div>
              </DropdownToggle>

              <DropdownMenu right>
                <DropdownItem
                  tag="a"
                  href="#"
                  onClick={() => {
                    this.setState({ modal: true });
                  }}
                >
                  <Icon.Key size={14} className="mr-50" />
                  <span className="align-middle">Cambiar Clave</span>
                </DropdownItem>

                <DropdownItem tag="a" href="#" onClick={this.handleLogout}>
                  <Icon.Power size={14} className="mr-50" />
                  <span className="align-middle">Cerrar Sesion</span>
                </DropdownItem>
              </DropdownMenu>

              <Modal
                isOpen={this.state.modal}
                toggle={this.toggleModal}
                className="modal-dialog-centered"
              >
                <ModalHeader toggle={this.toggleModal} className="bg-primary">
                  Cambiar Clave
                </ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="password">Nueva Password:</Label>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Nueva Password"
                      onChange={e => {
                        this.setState({ password: e.target.value });
                      }}
                    />
                  </FormGroup>
                </ModalBody>

                <ModalFooter>
                  <Button color="primary" onClick={this.changePassword}>
                    Cambiar
                  </Button>
                </ModalFooter>
              </Modal>
            </UncontrolledDropdown>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  solicitudes: state?.solicitudes,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarUser);
