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
  import React, { useContext, useState, useEffect } from "react";
  import Flatpickr from "react-flatpickr";
  import moment from "moment/moment";
  
  import { LinewithDataLabelsSecond } from "../../LineCharts";
  import { ChartsContext } from "./ChartsProvider";
  
  export const FeedConsumption = () => {
    const {
      filterType,
      myGraphLoader,
      setFilterType,
      setDateRangeNew,
      feedConsumptionData,
      setUpDefaultDateRange,
      getFeedConsumptionData,
    } = useContext(ChartsContext);
    const [showDataLabels, updateGraphLabels] = useState(true);
  
    useEffect(() => {
      setUpDefaultDateRange();
    }, []);
  
    const updateDateRangeNew = (selectedDates) => {
      if (selectedDates.length === 2) {
        setDateRangeNew([selectedDates[0], selectedDates[1]]);
      }
    };
  
    return (
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader>
              <Row>
                <Col lg={4}>
                  <h5 className="card-title mb-0">Feed Consumption</h5>
                </Col>
                <Col lg={8} style={{ float: "right" }}>
                  <Row>
                    <Col xl={6}>
                      <div className="input-group">
                        <Flatpickr
                          options={{
                            mode: "range",
                            dateFormat: "Y-m-d",
                            defaultDate: [
                              moment().subtract(7, "days").format("YYYY-MM-DD"),
                              moment().format("YYYY-MM-DD"),
                            ],
                          }}
                          className="form-control dash-filter-picker"
                          onChange={(selectedDates) =>
                            updateDateRangeNew(selectedDates)
                          }
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
                          <option value={"Daily"}>Days</option>
                          <option value={"Weekly"}>Weekly</option>
                          <option value={"Monthly"}>Monthly</option>
                          <option value={"Yearly"}>Yearly</option>
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
                          onClick={() => getFeedConsumptionData()}
                        >
                          {" "}
                          <i className="ri-filter-line" />
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <LinewithDataLabelsSecond
                dataColors='["#020202"]'
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
                <Col xl={6}>
                  <div
                    className="form-check form-switch form-switch-sm float-start"
                    dir="ltr"
                  >
                    <strong>
                      Total Feed Consumed: {feedConsumptionData?.max * 2} Kgs
                    </strong>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };
  