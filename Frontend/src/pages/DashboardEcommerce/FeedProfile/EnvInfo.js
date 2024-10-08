import { Col, Row } from "reactstrap";
import React from "react";
import { useFeeder, useFeedProfileMainInfo, useSocket } from "./hooks";
import {
  solarChargingpic,
  solarFailedpic,
  solarDonepic,
  emptyBattery,
  battery,
  fullChargingBattery,
  fullBattery,
  halfBattery,
  lowBattery,
} from "../../../assets/images";

export const EnvInfo = ({ deviceDetail, weatherInfo, feederData }) => {
  const btyVoltPer = (((feederData?.btyVolt - 11) / 3.8) * 100)?.toFixed(0);

  const KelvinToCelsius = (temp) => {
    return Math.floor(temp - 273.15);
  };

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
                  <p className="btn mybtn mybtn-1">
                    <i className="ri-map-pin-fill align-middle me-1"></i>{" "}
                    Location
                  </p>
                  <p className="btn mybtn mybtn-2">
                    <i className="ri-temp-hot-line align-middle me-1"></i>
                    {/* {KelvinToCelsius(weatherInfo?.main?.temp)}&deg;c */}
                    {/* &nbsp;&nbsp;&nbsp; */}
                    {feederData?.temp1}&deg;c &nbsp;&nbsp;&nbsp;
                    <i className="ri-water-flash-fill align-middle me-1"></i>
                    {/* {weatherInfo?.main?.humidity}% */}
                    {feederData?.hum1}%
                  </p>
                </div>
                <div className="col-auto">
                  <p className="btn mybtn mybtn-1">
                    <i className="ri-map-pin-fill align-middle me-1"></i> Feed
                  </p>
                  <p className="btn mybtn mybtn-2">
                    <i className="ri-temp-hot-line align-middle me-1"></i>
                    {/* {KelvinToCelsius(weatherInfo?.main?.temp)}&deg;c
                    &nbsp;&nbsp;&nbsp; */}
                    {feederData.temp2}&deg;c &nbsp;&nbsp;&nbsp;
                    <i className="ri-water-flash-fill align-middle me-1"></i>
                    {/* {weatherInfo?.main?.humidity}% */}
                    {feederData.hum2}%
                  </p>
                </div>
                <div className="col-auto">
                  <p className="btn mybtn mybtn-1">
                    {btyVoltPer > 100 ? (
                      <span>Charging</span>
                    ) : btyVoltPer > 80 && btyVoltPer <= 100 ? (
                      <img
                        src={fullBattery}
                        alt="fullBattery"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : btyVoltPer > 50 && btyVoltPer <= 80 ? (
                      <img
                        src={halfBattery}
                        alt="halfBattery"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : btyVoltPer > 20 && btyVoltPer <= 50 ? (
                      <img
                        src={lowBattery}
                        alt="lowBattery"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <img
                        src={emptyBattery}
                        alt="emptyBattery"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    &nbsp;&nbsp;&nbsp;
                    {/* {btyVoltPer <= 0 ? 0 : btyVoltPer} % */}
                    {btyVoltPer > 100
                      ? "100"
                      : btyVoltPer <= 0
                      ? 0
                      : btyVoltPer}{" "}
                    %
                  </p>
                </div>
                <div className="col-auto">
                  <p className="btn mybtn mybtn-1">
                    {btyVoltPer > 100 ? (
                      <img
                        src={solarDonepic}
                        alt="solarDonepic"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : btyVoltPer > 30 && btyVoltPer <= 100 ? (
                      <img
                        src={solarChargingpic}
                        alt="solarChargingpic"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <img
                        src={solarFailedpic}
                        alt="solarFailedpic"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                  </p>
                </div>
              </Row>
            </form>
          </div>
        </div>
      </Col>
    </Row>
  );
};
