import React from 'react';
import { Col, Row } from 'reactstrap';
// import NotificationDropdown from './NotificationDropdown';
import NotificationDropdown from '../Notifications/NotificationDropdown';

import axios from "axios";
import Flatpickr from "react-flatpickr";
import { useEffect, useState } from 'react';

const Section = (props) => {

    const getDayStatus = () => {
        let now = new Date();
        let hournow = now.getHours();
        if (hournow < 12) {
            return "Morning";
        } else if (hournow >= 12 && hournow <= 15) {
            return "Afternoon";
        } else {
            return "Evening"
        }
    }
    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column mb-3">
                        <div className="flex-grow-1">
                            <h4 className="fs-16 mb-1">Good {getDayStatus()}</h4>
                        </div>
                        <div className="mt-lg-0">
                            <form action="#">
                                <Row className="g-3 mb-0 align-items-center">

                                    {/* <div className="col-auto">
                                        <button type="button" className="btn btn-primary"><span className="badge badge-warning">{props.heartbeat}</span>HeartBeat <i className="ri-pulse-line align-middle me-1"></i></button>
                                    </div> */}
                                    <div className="col-auto">
                                        {/* <NotificationDropdown notificationsData={props.notificationsData} /> */}
                                        {/* <NotificationDropdown notificationsData={props.notificationsData} /> */}
                                    </div>
                                </Row>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;