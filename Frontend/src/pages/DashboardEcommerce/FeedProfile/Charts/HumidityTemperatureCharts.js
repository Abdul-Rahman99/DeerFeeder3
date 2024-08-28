import {
  Col,
  Row,
  Card,
  Input,
  Button,
  Spinner,
  CardBody,
  CardHeader,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import moment from "moment/moment";
import axios from "axios";
import { DoubleLineChart } from "../../LineCharts";
import { useFeeder, useFeedProfileMainInfo } from "../hooks";

export const HumidityTemperatureCharts = () => {
  const [filterType, setFilterType] = useState("Daily");
  const [date, setDate] = useState(moment().toDate());
  const [showDataLabels, updateGraphLabels] = useState(true);
  const [myGraphLoader, setMyGraphLoader] = useState(false);
  const [feederData, setFeederData] = useState([]);
  const { currentFeederId } = useFeedProfileMainInfo();

  const fetchSensorData = async () => {
    setMyGraphLoader(true);

    try {
      const selectedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `/api/getSensorDataForChart/${currentFeederId}/${selectedDate}/${filterType}`
      );

      setFeederData(response);
    } catch (error) {
      setMyGraphLoader(false);

      console.error("Error fetching sensor data", error);
    } finally {
      setMyGraphLoader(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, [filterType, date]);

  const updateDate = (selectedDate) => {
    if (selectedDate.length === 1) {
      setDate(selectedDate[0]);
    }
  };

  const getChartData = (dataKeyTemp, dataKeyHum) => {
    const sensorData = feederData?.data || {};
    const labels = feederData?.labels || [];
    const temperatures = sensorData[dataKeyTemp] || [];
    const humidities = sensorData[dataKeyHum] || [];
    const length = Math.min(
      labels.length,
      temperatures.length,
      humidities.length
    );

    const chartData = labels.slice(0, length).map((label, index) => ({
      timestamp: moment(label, "YYYY-MM-DD HH:00").format("HH:00"),
      temperature: temperatures[index] || 0,
      humidity: humidities[index] || 0,
    }));

    return chartData;
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <Row>
              <Col lg={4}>
                <h5 className="card-title mb-0">Location Heat Index</h5>
              </Col>
              <Col
                lg={8}
                className="d-flex justify-content-end"
                style={{ float: "right" }}
              >
                <Row>
                  <Col xl={6}>
                    <div className="input-group">
                      <Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: "Y-m-d",
                          defaultDate: [moment().format("YYYY-MM-DD")],
                        }}
                        onChange={(selectedDate) => updateDate(selectedDate)}
                      />
                      <div className="input-group-text bg-dark border-dark text-white">
                        <i className="ri-calendar-2-line"></i>
                      </div>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <div className="input-group">
                      <select
                        className="form-select"
                        onChange={({ target: { value } }) =>
                          setFilterType(value)
                        }
                      >
                        <option value={"Daily"}>Daily</option>
                        {/* <option value={"Weekly"}>Weekly</option>
                        <option value={"Monthly"}>Monthly</option>
                        <option value={"Yearly"}>Yearly</option> */}
                      </select>
                    </div>
                  </Col>
                  <Col xl={1}>
                    {myGraphLoader ? (
                      <Spinner color="light"></Spinner>
                    ) : (
                      <Button
                        color="primary"
                        className="btn-icon"
                        onClick={fetchSensorData}
                      >
                        <i className="ri-filter-line" />
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <DoubleLineChart
              dataColors='["#ff0000", "#0000ff"]'
              myChartData={getChartData("temp1", "hum1")}
              filterType={filterType}
              showDataLabels={showDataLabels}
            />
            <Row>
              <Col xl={6}>
                <div
                  className="form-check form-switch form-switch-sm float-start"
                  dir="ltr"
                >
                  <label htmlFor={"show_datalabels"}>Show Labels</label>
                  <Input
                    type="checkbox"
                    id="show_datalabels"
                    className="form-check-input"
                    defaultChecked={showDataLabels}
                    onChange={(e) => updateGraphLabels(e.target.checked)}
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <Row>
              <Col lg={4}>
                <h5 className="card-title mb-0">Feed Heat Index</h5>
              </Col>
              <Col lg={8} className="d-flex justify-content-end">
                <Row>
                  <Col xl={6}>
                    <div className="input-group">
                      <Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: "Y-m-d",
                          defaultDate: [moment().format("YYYY-MM-DD")],
                        }}
                        onChange={(selectedDate) => updateDate(selectedDate)}
                      />
                      <div className="input-group-text bg-dark border-dark text-white">
                        <i className="ri-calendar-2-line"></i>
                      </div>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <div className="input-group">
                      <select
                        className="form-select"
                        onChange={({ target: { value } }) =>
                          setFilterType(value)
                        }
                      >
                        <option value={"Daily"}>Daily</option>
                        {/* <option value={"Weekly"}>Weekly</option>
                        <option value={"Monthly"}>Monthly</option>
                        <option value={"Yearly"}>Yearly</option> */}
                      </select>
                    </div>
                  </Col>
                  <Col xl={2}>
                    {myGraphLoader ? (
                      <Spinner size="sm" color="light"></Spinner>
                    ) : (
                      <Button
                        color="primary"
                        className="btn-icon"
                        onClick={fetchSensorData}
                      >
                        <i className="ri-filter-line" />
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <DoubleLineChart
              dataColors='["#ff0000", "#0000ff"]'
              myChartData={getChartData("temp2", "hum2")}
              filterType={filterType}
              showDataLabels={showDataLabels}
            />
            <Row>
              <Col xl={6}>
                <div
                  className="form-check form-switch form-switch-sm float-start"
                  dir="ltr"
                >
                  <label htmlFor={"show_datalabels"}>Show Labels</label>
                  <Input
                    type="checkbox"
                    id="show_datalabels"
                    className="form-check-input"
                    defaultChecked={showDataLabels}
                    onChange={(e) => updateGraphLabels(e.target.checked)}
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
