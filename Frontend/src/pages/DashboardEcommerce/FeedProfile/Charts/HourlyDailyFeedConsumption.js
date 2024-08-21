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
import moment from "moment";
import axios from "axios";
import { LinewithDataLabelsSecond2 } from "../../LineCharts";
import { useFeedProfileMainInfo } from "../hooks";

export const HourlyDailyFeedConsumption = () => {
  const [filterType, setFilterType] = useState("Hourly"); // Default to Hourly
  const [dateRange, setDateRange] = useState([moment(), moment()]);
  const [showDataLabels, updateGraphLabels] = useState(true);
  const [myGraphLoader, setMyGraphLoader] = useState(false);
  const [feedConsumptionData, setFeedConsumptionData] = useState({
    data: [],
    labels: [],
  });
  const { currentFeederId } = useFeedProfileMainInfo();

  const updateDateRangeBasedOnFilter = (filter) => {
    switch (filter) {
      case "Hourly":
        setDateRange([moment(), moment()]); // Last 24 hours
        break;
      case "Daily":
        setDateRange([moment(), moment()]); // Current day
        break;
      default:
        break;
    }
  };

  const fetchFeedConsumptionData = async () => {
    setMyGraphLoader(true);
    try {
      const [datefrom, dateto] = dateRange.map((date) =>
        moment(date).format("YYYY-MM-DD")
      );

      // If the selected range is just one day, send only the current day in the params
      const isSingleDay = moment(datefrom).isSame(dateto, "day");
      const dateToSend = isSingleDay ? datefrom : dateto;

      let response;
      if (filterType === "Hourly") {
        response = await axios.get(
          `/api/feed-consumption/hourly/${currentFeederId}/${datefrom}/${dateToSend}`
        );
      } else if (filterType === "Daily") {
        response = await axios.get(
          `/api/feed-consumption/daily/${currentFeederId}/${datefrom}/${dateToSend}`
        );
      }

      setFeedConsumptionData({
        data: response.data || [],
        labels: response.labels || [],
      });
    } catch (error) {
      console.error("Error fetching feed consumption data", error);
    } finally {
      setMyGraphLoader(false);
    }
  };

  // useEffect(() => {
  //   updateDateRangeBasedOnFilter(filterType);
  // }, [filterType]);

  useEffect(() => {
    fetchFeedConsumptionData();
  }, [filterType, dateRange, currentFeederId]);

  const updateDateRange = (selectedDates) => {
    if (selectedDates.length === 2) {
      setDateRange(selectedDates);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <Row>
              <Col lg={4}>
                <h5 className="card-title mb-0">Feed Consumed By Deers</h5>
              </Col>
              <Col lg={8} className="d-flex justify-content-end">
                <Row>
                  <Col xl={6}>
                    <div className="input-group">
                      <Flatpickr
                        className="form-control"
                        options={{
                          mode: "range",
                          dateFormat: "Y-m-d",
                          defaultDate: dateRange.map((date) =>
                            moment(date).format("YYYY-MM-DD")
                          ),
                        }}
                        onChange={(selectedDates) => {
                          updateDateRange(selectedDates);
                          if (
                            selectedDates.length === 1 ||
                            moment(selectedDates[0]).isSame(
                              moment(selectedDates[1]),
                              "day"
                            )
                          ) {
                            setFilterType("Hourly");
                          } else {
                            setFilterType("Daily");
                          }
                        }}
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
                        value={filterType}
                      >
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                        {/* <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option> */}
                      </select>
                    </div>
                  </Col>
                  <Col xl={2}>
                    {myGraphLoader ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      <Button
                        color="primary"
                        className="btn-icon"
                        onClick={fetchFeedConsumptionData}
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
            <LinewithDataLabelsSecond2
              dataColors='["#3b8132"]'
              myChartData={feedConsumptionData || []}
              filterType={filterType}
              showDataLabels={showDataLabels}
            />
            <Row>
              <Col xl={6}>
                <div
                  className="form-check form-switch form-switch-sm float-start"
                  dir="ltr"
                >
                  <label htmlFor="show_datalabels">Show Labels</label>
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
