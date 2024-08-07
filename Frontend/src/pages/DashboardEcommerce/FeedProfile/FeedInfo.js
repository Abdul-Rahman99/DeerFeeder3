import React, { useMemo } from "react";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";

import {
  tankpic,
  hum_pic,
  temp_pic,
  battery_pic,
  battery_pic_no,
} from "../../../assets/images";


const DoughnutChart = ({ dataColors='["--vz-success","--vz-primary"]',hasTray,
  tray1,
  tray2,
  tray3,
  tray4,
  tankLevel2,
 }) => {
  var chartDoughnutColors = ["#399918","#387F39","#F6E96B","#BEDC74","#B43F3F"];
  var optionWithTrays = {
    tooltip: {
      show: false
    },
    legend: {
      show: false
    },
    color: chartDoughnutColors,
    series: [
      {
        name: 'Feed Level',
        type: 'pie',
        radius: [0, '45.5%'],
        label: {
          position: 'center',
          fontSize: 19
        },
        labelLine: {
          show: false
        },
        data: [
          { value: tankLevel2, name: tankLevel2 + " kg", selected: true }
        ]
      },
      {
        name: 'Feed Level',
        type: 'pie',
        radius: ['45%', '70%'],
        padAngle: 8,
        itemStyle: {
          borderRadius: 10
        },
        color: chartDoughnutColors,
        labelLine: {
          length: 30
        },
        label: {
          formatter: '{b|{b}：}{c} kg',
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
              align: 'center'
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        data: [
          { value: tray1, name: 'Tray 1' },
          { value: tray2, name: 'Tray 2' },
          { value: tray3, name: 'Tray 3' },
          { value: tray4, name: 'Tray 4' },
        ]
      }
    ]
  };

var option = {
  tooltip: {
      trigger: 'item',
      show: false
  },
  legend: {
      top: '5%',
      left: 'center',
      show:false,
      textStyle: { //The style of the legend text
          color: '#858d98',
      },
  },
  color: chartDoughnutColors,
  series: [{
      name: 'Feed Quantity',
      type: 'pie',
      radius: ['40%', '70%'],
      // avoidLabelOverlap: false,
      label: {
          show: true,
          position: 'center',
          fontSize: 17
      },
      emphasis: {
          label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
          }
      },
      labelLine: {
          show: true
      },
      data: [{
          value: tankLevel2,
          name: 'Feed Quantity \n\n' + tankLevel2 + " kg"
      },
      ]
  }],
  textStyle: {
      fontFamily: 'Poppins, sans-serif'
  },
};

  return (
      <React.Fragment>
          <ReactEcharts style={{ height: "350px" }} option={hasTray ? optionWithTrays : option} />
      </React.Fragment>
  )
}

const FeedLevelData = ({has_capacity,feedLevel,hasTray,
  tray1,
  tray2,
  tray3,
  tray4,
  tankLevel2,
 }) => {

  return has_capacity ? (
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
                <img src={tankpic} width="220px" alt="tank" height="270px" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
  ) : (
    <Col lg={6}>
        <Card>
          <CardHeader>
            <h5 className="card-title mb-0">Feed Quantity</h5>
          </CardHeader>
          <CardBody>
            <DoughnutChart
            hasTray={hasTray}
            tray1={tray1}
            tray2={tray2}
            tray3={tray3}
            tray4={tray4}
            tankLevel2={tankLevel2}
            />
          </CardBody>
        </Card>
      </Col>
  )
}

export const FeedInfo = ({
  currentFeederId,
  feederData,
  isExpired,
  lastDate,
  lastTime,
  feedLevel,
  has_capacity,
  hasTray,
  tray1,
  tray2,
  tray3,
  tray4,
  tankLevel2,

}) => {
  const { btyVolt, btyCur, temp1, hum1, temp2, hum2 } = feederData;

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
    let temp = temp1 != 0 ? Math.floor(temp1) : temp2 - 2;
    let hum = hum1 != 0 ? Math.floor(hum1) : hum2 - 2;
    return [
      {
        title: "Feeder Temperature",
        value: <>{temp} &deg;c</>,
        image: <img src={temp_pic} width="40" alt="temp" height="40" />,
      },
      {
        title: "Feeder Humidity",
        value: `${Math.floor(hum)} %`,
        image: <img src={hum_pic} width="40" alt="hum" height="40" />,
      },
      {
        title: "Battery Charging",
        value: showBatteryLevel(btyVolt),
        image: (
          <img
            src={btyCur < 0 ? battery_pic : battery_pic_no}
            width="25"
            height="40"
            alt="battery"
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
      <FeedLevelData 
      has_capacity={has_capacity}
      feedLevel={feedLevel}
      hasTray={hasTray}
      tray1={tray1}
      tray2={tray2}
      tray3={tray3}
      tray4={tray4}
      tankLevel2={tankLevel2}
      />
      <Col lg={6}>
        <Row>
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
