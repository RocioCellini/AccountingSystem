import React from "react"
import { Navbar } from "reactstrap"
import classnames from "classnames"
import NavbarUser from "./NavbarUser"
import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg"



const ThemeNavbar = props => {
  const navbarTypes = ["floating" , "static" , "sticky" , "hidden"]
  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg  ",
          { "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) || (!navbarTypes.includes(props.navbarType) && !props.horizontal),
          }
        )}

      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div id="navbar-mobile">

              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName="John Doe"
                userImg={ userImg }
              />
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  )
}


export default ThemeNavbar
