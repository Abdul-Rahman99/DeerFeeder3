import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./DashboardEcommerceCharts";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { getRevenueChartsData } from "../../store/dashboardEcommerce/action";
import { createSelector } from "reselect";

const Revenue = (props) => {
  const dispatch = useDispatch();

  const [chartData, setchartData] = useState([]);

  const selectDashboardData = createSelector(
    (state) => state.DashboardEcommerce.revenueData,
    (revenueData) => revenueData
  );

  // Inside your component
  const revenueData = useSelector(selectDashboardData);


  useEffect(() => {
    setchartData(revenueData);
  }, [revenueData]);

  const onChangeChartPeriod = pType => {
    dispatch(getRevenueChartsData(pType));
  };

  useEffect(() => {
    dispatch(getRevenueChartsData("all"));
  }, [dispatch]);
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Bird Feeding Performance</h4>
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={6} sm={6}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp start={0} end={7585} duration={3} separator="," />
                </h5>
                <p className="text-muted mb-0">Battery Voltage</p>
              </div>
            </Col>
            <Col xs={6} sm={6}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp
                    suffix="k"
                    prefix="$"
                    start={0}
                    decimals={2}
                    end={22.89}
                    duration={3}
                  />
                </h5>
                <p className="text-muted mb-0">Solar Voltage</p>
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts series={chartData} dataColors='["--vz-secondary", "--vz-primary", "--vz-primary-rgb, 0.50"]' />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
