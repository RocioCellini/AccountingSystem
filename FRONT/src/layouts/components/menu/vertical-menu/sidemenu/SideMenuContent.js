import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import navigationConfig from "../../../../../configs/navigationConfig";
import { Badge } from "reactstrap";
import { ChevronRight } from "react-feather";
import { history } from "../../../../../history";
import Cookies from "js-cookie"; 

class SideMenuContent extends React.Component {
  constructor(props) {
    super(props);
    this.parentArr = [];
    this.collapsedPath = null;
    this.state = {
      flag: true,
      isHovered: false,
      activeGroups: [],
      currentActiveGroup: [],
      tempArr: [],
    };
  }

  handleGroupClick = (id, parent = null, type = "") => {
    let open_group = this.state.activeGroups;
    let active_group = this.state.currentActiveGroup;
    let temp_arr = this.state.tempArr;

    if (type === "item") {
      open_group = active_group.slice(0);
    }

    this.setState({
      activeGroups: open_group,
      tempArr: temp_arr,
      currentActiveGroup: active_group,
    });
  };

  initRender = (parentArr) => {
    this.setState({
      activeGroups: parentArr.slice(0),
      currentActiveGroup: parentArr.slice(0),
      flag: false,
    });
  };

  componentDidMount() {
    this.initRender(this.parentArr[0] ? this.parentArr[0] : []);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activePath !== this.props.activePath) {
      this.initRender(
        this.parentArr[0] ? this.parentArr[this.parentArr.length - 1] : []
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.activePath !== this.props.activePath ||
      nextState.activeGroups !== this.state.activeGroups ||
      nextState.currentActiveGroup !== this.state.currentActiveGroup
    );
  }

  render() {
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : {}; 
    const currentRol = user?.rol?.codigo; 

    const menuItems = navigationConfig.map((item) => {
      const CustomAnchorTag = item.type === "external-link" ? `a` : Link;

      if (item.type === "groupHeader") {
        return (
          <li className="navigation-header" key={`group-header-${item.groupTitle}`}>
            <span>{item.groupTitle}</span>
          </li>
        );
      }

      if (
        currentRol &&
        item.type === "item" &&
        item.navLink === this.props.activePath &&
        item.permissions &&
        !item.permissions.includes(currentRol)
      ) {
        history.push("/misc/not-authorized");
        return null;
      }

      return (
        <li
          className={classnames("nav-item", {
            "has-sub": item.type === "collapse",
            open: this.state.activeGroups.includes(item.id),
            "sidebar-group-active": this.state.currentActiveGroup.includes(item.id),
            hover: this.props.hoverIndex === item.id,
            active:
              (this.props.activeItemState === item.navLink && item.type === "item") ||
              (item.parentOf && item.parentOf.includes(this.props.activeItemState)),
            disabled: item.disabled,
          })}
          key={item.id}
          onClick={(e) => {
            e.stopPropagation();
            if (item.type === "item") {
              this.props.handleActiveItem(item.navLink);
              this.handleGroupClick(item.id, null, item.type);
              if (this.props.deviceWidth <= 1200 && item.type === "item") {
                this.props.toggleMenu();
              }
            } else if (item.type === "collapse") {
              const isOpen = this.state.activeGroups.includes(item.id);
              this.setState({
                activeGroups: isOpen
                  ? this.state.activeGroups.filter((groupId) => groupId !== item.id)
                  : [...this.state.activeGroups, item.id],
              });
            }
          }}
        >
          <CustomAnchorTag
            to={item.filterBase ? item.filterBase : item.navLink && item.type === "item" ? item.navLink : ""}
            href={item.type === "external-link" ? item.navLink : ""}
            className={`d-flex ${item.badgeText ? "justify-content-between" : "justify-content-start"}`}
            onMouseEnter={() => this.props.handleSidebarMouseEnter(item.id)}
            onMouseLeave={() => this.props.handleSidebarMouseEnter(item.id)}
            onClick={(e) => (item.type === "collapse" ? e.preventDefault() : "")}
            target={item.newTab ? "_blank" : undefined}
          >
            <div className="menu-text">
              {item.icon}
              <span className="menu-item menu-title">{item.title}</span>
            </div>
            {item.badge ? (
              <div className="menu-badge">
                <Badge color={item.badge} className="mr-1" pill>
                  {item.badgeText}
                </Badge>
              </div>
            ) : (
              ""
            )}
            {item.type === "collapse" ? <ChevronRight className="menu-toggle-icon" size={13} /> : ""}
          </CustomAnchorTag>
          {item.type === "collapse" && item.children ? (
            <ul className="menu-content">
              {item.children.map((child) => (
                <li key={child.id}>
                  <Link
                    to={child.navLink}
                    className="d-flex align-items-center"
                  >
                    {child.icon && <span className="menu-icon">{child.icon}</span>}
                    <span className="menu-item menu-title">{child.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      );
    });

    return <React.Fragment>{menuItems}</React.Fragment>;
  }
}

export default SideMenuContent;

