import React, { useState } from 'react';
import { Button, Badge, Col, Dropdown, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

//import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import bell from "../../assets/images/svg/bell.svg";
import { Icon } from '@iconify/react';
//SimpleBar
import SimpleBar from "simplebar-react";

const NotificationDropdown = (props) => {
    //Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };

    //Tab 
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    const getIcon = (value) => {
        if (value.search("battery")) {
            return <Icon icon="ri:battery-2-charge-line" color="#c22" width="20" height="20" />;
        } else if (value.search("feedingdone")) {
            return <Icon icon="ri:alarm-line" color="#2c2" width="20" height="20" />;
        } else if (value.search("motor")) {
            return <Icon icon="ri:alert-line" color="#c22" width="20" height="20" />;
        }
    }
    const getTime = (createdAt) => {
        var t1 = new Date(createdAt);
        var t2 = new Date();
        var dif = t1.getTime() - t2.getTime();

        var Seconds_from_T1_to_T2 = dif / 1000;
        var Seconds_Between_Dates = Math.round(Math.abs(Seconds_from_T1_to_T2));

        if (Seconds_Between_Dates < 60) {
            if (Seconds_Between_Dates == 0) {
                return "just now";
            } else {
                return Seconds_Between_Dates + " seconds";
            }

        } else {
            return (Seconds_Between_Dates / 60) + " minutes";
        }
    }
    return (
        <React.Fragment>
            <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle type="button" tag="button" className="btn btn-topbar btn-light ">
                    Notifications
                    <span className="position-absolute top-0 start-100 translate-middle badge border border-light bg-danger p-1">
                        {Object.keys(props.notificationsData).length}
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0 mt-3">
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                                </Col>
                                {/* <div className="col-auto dropdown-tabs">
                                    <span className="badge bg-light-subtle text-bodyfs-13"> 4 New</span>
                                </div> */}
                            </Row>
                        </div>

                    </div>

                    <TabContent activeTab={activeTab}>
                        {
                            Object.keys(props.notificationsData).length > 0 ?
                                (
                                    <TabPane tabId="1" className="py-2 ps-2">
                                        <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">

                                            {
                                                props.notificationsData.map((val, i) => {
                                                    return <div key={i} className="text-reset notification-item d-block dropdown-item position-relative">
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1">
                                                                <Link to="#" className="stretched-link">
                                                                    <h6 className="mt-0 mb-2 lh-base">{val.message_text}</h6>
                                                                </Link>
                                                                <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                    <span><i className="mdi mdi-clock-outline"></i> {getTime(val.createdAt)} ago</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                })
                                            }

                                        </SimpleBar>

                                    </TabPane>

                                ) : (
                                    <TabPane tabId="1" className="p-4">
                                        <div className="w-25 w-sm-50 pt-3 mx-auto">
                                            <img src={bell} className="img-fluid" alt="user-pic" />
                                        </div>
                                        <div className="text-center pb-5 mt-2">
                                            <h6 className="fs-18 fw-semibold lh-base">Hey! You have no any notifications </h6>
                                        </div>
                                    </TabPane>
                                )
                        }


                    </TabContent>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default NotificationDropdown;