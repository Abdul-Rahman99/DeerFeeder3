import React from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Icon } from '@iconify/react';
import "../../assets/scss/tank.css";
import { ecomWidgets } from "../../common/data";

const SensorWorking = (props) => {
    /*
                        dht1={dht1}
                    dht2={dht2}
                    pingW={pingW}
                    irw={irw}
                    vl53={vl53}
                    btyCurW={btyCurW}
                    solarCurW={solarCurW}
                    motorCurW={motorCurW}
                    btyVoltW={btyVoltW}
                    sVoltW={sVoltW}
                    imuW={imuW}

    */
    const getIconbyStatus = (workingstatus) => {
        if (workingstatus == "W") {

            return <Icon icon="ri:checkbox-circle-fill" color="#0b0" width="50" height="50" />
        } else if (workingstatus == "N") {
            return <Icon icon="ri:close-circle-fill" color="#a00" width="50" height="50" />
        } else {
            return <Icon icon="ri:loop-right-fill" color="#ccc" width="50" height="50" />
        }
    }
    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h4 className="card-title mb-0">Sensor Working</h4>
                </CardHeader>
                <div className="card-body">
                    <Row>
                        <Col xl={3} md={3} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">DHT1</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.dht1)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={2} md={2} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">DHT2</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.dht2)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={2} md={2} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">Ping</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.pingW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={2} md={2} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">IR</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.irw)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3} md={3} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">Battery Cur.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.btyCurW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>


                        <Col xl={3} md={3} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">Solar Cur.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.solarCurW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={2} md={2} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">Motor Cur.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.motorCurW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={2} md={2} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">Battery Volt</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.btyVoltW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={2} md={2} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">Solar Volt</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.sVoltW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={3} md={3} >
                            <Card className="card-animate nopadding">
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase d-flex align-items-center justify-content-center">IMU</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                            <span className="counter-value" data-target="559.25">
                                                {getIconbyStatus(props.imuW)}
                                            </span>
                                        </h4>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>

        </React.Fragment>
    );
};

export default SensorWorking;