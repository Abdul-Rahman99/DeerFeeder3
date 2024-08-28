import React, { useState, useEffect } from "react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { createSelector } from "reselect";
// actions
import { apiError, logoutUser } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
const ProfileDropdown = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const selectDashboardData = createSelector(
    (state) => state.Profile.user,
    (user) => user
  );

  // Inside your component
  const user = useSelector(selectDashboardData);

  const [userName, setUserName] = useState("Admin");
  const [userType, setuserType] = useState("NoRole");

  const [userprofile_picture, setUserprofile_picture] = useState("");

  const signOut = () => {
    dispatch(logoutUser(navigate));
  };

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      setUserprofile_picture(obj?.data?.avatar || "");
    }

    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      setUserName(
        process.env.REACT_APP_DEFAULTAUTH === "fake"
          ? obj.username === undefined
            ? user.first_name
              ? user.first_name
              : obj.data.first_name
            : "Admin" || "Admin"
          : process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? obj.providerData[0].email
          : "Admin"
      );
      setuserType(obj?.userType?.title);
    }
  }, [userName, user]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={userprofile_picture || avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {userType}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userName}!</h6>
          <DropdownItem href={process.env.PUBLIC_URL + "/profile"}>
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Profile</span>
          </DropdownItem>

          <div className="dropdown-divider"></div>

          <DropdownItem onClick={() => signOut({})}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
