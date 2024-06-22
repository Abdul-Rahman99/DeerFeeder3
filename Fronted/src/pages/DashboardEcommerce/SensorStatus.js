import { Card, CardBody, CardHeader, Col, Row, Container } from "reactstrap";
import CountUp from "react-countup";
import React from "react";

const SensorItem = ({
  separator = "",
  decimals = 2,
  suffix,
  title,
  value,
  isIrDist = true,
}) => (
  <Col xl={3} md={3}>
    <Card className="card-animate">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-uppercase d-flex align-items-center justify-content-center">
              {title}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-1">
          <h4 className="fs-22 fw-semibold ff-secondary mb-1">
            {isIrDist && value === 255 ? (
              "-1"
            ) : (
              <span className="counter-value" data-target="559.25">
                <CountUp
                  start={0}
                  prefix={""}
                  end={value}
                  duration={2}
                  suffix={suffix}
                  decimals={decimals}
                  separator={separator}
                />
              </span>
            )}
          </h4>
        </div>
      </CardBody>
    </Card>
  </Col>
);

const SensorStatus = ({
  solarVolt,
  pingDist,
  solarCur,
  motorCur,
  btyVolt,
  irDist,
  vlDist,
  btyCur,
  temp1,
  temp2,
  hum1,
  hum2,
}) => (
  <Container fluid>
    <Row>
      <Col lg={12}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Sensor Health</h4>
          </CardHeader>
          <div className="card-body">
            <Row>
              <SensorItem title={"Feed Level"} value={pingDist} suffix={"cm"} />
              <SensorItem
                title={"Feed Percentage"}
                value={irDist}
                suffix={"%"}
                isIrDist={true}
              />
              <SensorItem title={"Feed Level"} value={vlDist} suffix={"cm"} />
              <SensorItem
                title={"Battery Status"}
                value={btyVolt}
                suffix={"V"}
              />
            </Row>
            <Row>
              <SensorItem
                title={"Solar Status"}
                value={solarVolt}
                suffix={"V"}
              />
              <SensorItem
                title={"Battery Current"}
                value={btyCur}
                suffix={"mA"}
              />
              <SensorItem
                title={"Solar Current"}
                value={solarCur}
                suffix={"mA"}
              />
              <SensorItem
                title={"Motor Current"}
                value={motorCur}
                suffix={"mA"}
              />
            </Row>
            <Row>
              <SensorItem
                title={"Temperature 1"}
                value={temp1}
                suffix={" &#176;c"}
                separator={" "}
                decimals={0}
              />
              <SensorItem
                title={"Temperature 2"}
                value={temp2}
                suffix={" &#176;c"}
                separator={" "}
                decimals={0}
              />
              <SensorItem
                title={"Humidity 1"}
                value={hum1}
                suffix={"%"}
                separator={" "}
              />
              <SensorItem
                title={"Humidity 2"}
                value={hum2}
                suffix={"%"}
                separator={" "}
              />
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default SensorStatus;
