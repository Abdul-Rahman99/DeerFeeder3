import React, { useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import moment from "moment/moment";
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
    const [isNotificationRead, setIsNotificationRead] = useState(false);
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

    return (
        <React.Fragment>
            <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1">
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">

                    <Icon icon="ri:alarm-warning-line" color="#a00" width="70" height="70" />

                    {
                        // isNotificationRead ? (
                        //     <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">0
                        //         <span className="visually-hidden">unseen alarms</span>
                        //     </span>
                        // ) : (
                        //     <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger" >{Object.keys(props.alarmNotificationsData).length}
                        //         <span className="visually-hidden">unseen alarms</span>
                        //     </span>
                        // )
                    }

                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                                </Col>
                            </Row>
                        </div>

                    </div>

                    <TabContent activeTab={activeTab}>
                        {(Object.keys(props.alarmNotificationsData).length > 0) ? (
                            <TabPane tabId="1" className="py-2 ps-2">
                                <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">

                                    {

                                        props.alarmNotificationsData.map((elem) => {
                                            return <div className="text-reset notification-item d-block dropdown-item position-relative" key={elem.id}>
                                                <div className="d-flex">
                                                    <div className="avatar-xs me-3">
                                                        <span className="avatar-title bg-info-subtle text-info rounded-circle fs-16">
                                                            <Icon icon="ri:alarm-warning-line" color="#a00" width="70" height="70" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <Link to="#" className="stretched-link">
                                                            <h6 className="mt-0 mb-2 lh-base">
                                                                {
                                                                    elem.client_topic == "alarmtilt" ? 'Alarm Tilt ' :
                                                                        elem.client_topic == "alarmmotor" ? 'Alarm Motor ' : 'Alarm Vibration '
                                                                }
                                                                Notification</h6>
                                                        </Link>

                                                        <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                            <span>
                                                                {/* <i className="mdi mdi-clock-outline "></i> */}
                                                                {moment(elem.createdAt).format('YYYY-MM-DD h:mm:ss a')}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        })

                                    }

                                </SimpleBar>

                            </TabPane>
                        ) : (

                            <TabPane tabId="1" className="py-2 ps-2">
                                <div className="w-25 w-sm-50 pt-3 mx-auto">
                                    <img src={bell} className="img-fluid" alt="user-pic" />
                                </div>
                                <div className="text-center pb-5 mt-2">
                                    <h6 className="fs-18 fw-semibold lh-base">Hey! You have no any alarm notifications </h6>
                                </div>
                            </TabPane>
                        )}
                    </TabContent>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment >
    );
};

export default NotificationDropdown;