import { Col, Row } from 'reactstrap';
import React from "react";

export const EnvInfo = ({deviceDetail, weatherInfo}) => {
    const KelvinToCelsius = (temp) => {
        return Math.floor(temp - 273.15);
    }

    return (
        <Row className="mb-3 pb-1" id="topprofile">
            <Col xs={12}>
                <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                    <div className="flex-grow-1">
                        <h4 className="fs-16 mb-1">{deviceDetail?.title}</h4>
                    </div>
                    <div className="mt-3 mt-lg-0">
                        <form action="#">
                            <Row className="g-3 mb-0 align-items-center">
                                <div className="col-auto">
                                    <p className="btn mybtn mybtn-1" ><i className="ri-map-pin-fill align-middle me-1"></i> {deviceDetail?.location}</p>
                                    <p className="btn mybtn mybtn-2" ><i className="ri-temp-hot-line align-middle me-1"></i>{KelvinToCelsius(weatherInfo?.main?.temp)}&deg;c &nbsp;&nbsp;&nbsp;<i className="ri-water-flash-fill align-middle me-1"></i>{weatherInfo?.main?.humidity}%</p>
                                </div>
                            </Row>
                        </form>
                    </div>
                </div>
            </Col>
        </Row>
    );
};