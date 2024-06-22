import React, { useMemo } from "react";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";

import {
  tankpic,
  hum_pic,
  temp_pic,
  battery_pic,
  battery_pic_no,
} from "../../../assets/images";

export const FeedInfo = ({
  tankCapacity,
  feedPerSecond,
  currentFeederId,
  feederData,
  isExpired,
  lastDate,
  lastTime,
  feedLevel,
  setSchedulesPerformed,
  schedulesPerformed,
}) => {
  const { btyVolt, btyCur, temp1, hum1 } = feederData;

  const feederInfo = useMemo(() => {
    const showBatteryLevel = (batteryVolt) => {
      if (batteryVolt < 11.5) {
        return "0%";
      } else if (batteryVolt >= 11.5 && batteryVolt < 12) {
        return "10%";
      } else if (batteryVolt >= 12 && batteryVolt < 13) {
        return "60%";
      } else {
        return "100%";
      }
    };

    return [
      {
        title: "Feeder Temperature",
        value: <>{Math.floor(temp1)} &deg;c</>,
        image: <img src={temp_pic} width="40" height="40" />,
      },
      {
        title: "Feeder Humidity",
        value: `${Math.floor(hum1)} %`,
        image: <img src={hum_pic} width="40" height="40" />,
      },
      {
        title: "Battery Charging",
        value: showBatteryLevel(btyVolt),
        image: (
          <img
            src={btyCur < 0 ? battery_pic : battery_pic_no}
            width="25"
            height="40"
          />
        ),
      },
    ];
  }, [temp1, hum1, btyVolt, btyCur]);

  //   const feedLevel = useMemo(() => {
  //     const tankCapacityRemaining = (feedPerSecond / 1000) * schedulesActive;
  //     return ((tankCapacity - tankCapacityRemaining) / tankCapacity) * 100;
  //   }, [tankCapacity, feedPerSecond, schedulesActive]);


  return (
    <Row>
      <Col lg={4}>
        <Card>
          <CardHeader>
            <h5 className="card-title mb-0">Feed Level</h5>
          </CardHeader>
          <CardBody>
            <div className="d-flex align-items-center justify-content-center mt-1 ">
              <div className="tank bg-white position-relative d-flex justify-content-center align-items-center">
                <div
                  className={
                    "feed w-100 position-absolute bottom-0 " +
                    (feedLevel <= 40 && feedLevel >= 20
                      ? "bg-yellow"
                      : feedLevel < 20
                      ? "bg-red"
                      : "bg-green")
                  }
                  style={{ height: feedLevel + "%" }} // Use feedLevel for height
                ></div>
                <p className="percent fs-1" id="percent">
                  {Math.max(0, feedLevel.toFixed(0))}%
                </p>
              </div>
              <div className="position-absolute">
                <img src={tankpic} width="220px" height="270px" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={8}>
        <Row>
          {feederInfo.map(({ title, value, image }) => (
            <Col key={title} xl={4} md={4}>
              <Card style={{ padding: "0" }}>
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase mb-2">{title}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="align-items-center">
                      <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                        <span
                          className="counter-value align-items-center"
                          data-target="100"
                        >
                          {value}
                        </span>
                      </h6>
                    </div>
                    <div>{image}</div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <Col xl={6} md={6}>
            <Card className="last-feed text-white p-md-2">
              <CardBody>
                <p style={{ fontSize: "19px", fontWeight: "500" }}>Last Feed</p>
                <h2
                  className={
                    "mt-4 ff-secondary fw-semibold text-white text-center"
                  }
                >
                  <span className="counter-value text-center">{lastTime}</span>
                </h2>
                <div style={{ width: "94%" }}>
                  <h4
                    className="d-flex justify-content-end text-white"
                    style={{ fontSize: "14px" }}
                  >
                    {lastDate}
                  </h4>
                </div>
                <div
                  className="sun-rise d-flex align-items-center justify-content-end my-2"
                  style={{ width: "94%" }}
                >
                  <br></br>
                  <br></br>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl={6} md={6}>
            <Card className={"next-feed text-white p-md-2"}>
              <CardBody>
                <p style={{ fontSize: "19px", fontWeight: "500" }}>Next Feed</p>

                {isExpired ? (
                  <div id="countDown" className="d-flex" key={currentFeederId}>
                    EXPIRED
                  </div>
                ) : (
                  <div id="countDown" className="d-flex" key={currentFeederId}>
                    {["Days", "Hours", "Minutes", "Seconds"].map((tim) => (
                      <div
                        key={tim}
                        className="d-flex flex-column gap-2 align-items-stretch"
                      >
                        <span
                          className="countdown-item"
                          id={`${tim.toLowerCase()}`}
                        >
                          00
                        </span>
                        <span
                          className="countdown-label"
                          id={`${tim.toLowerCase()}-label`}
                        >
                          {tim}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
