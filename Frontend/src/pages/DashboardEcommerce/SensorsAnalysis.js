import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
// import Widget from "./Widgets";

// import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
// import RecentOrders from "./RecentOrders";
// import Revenue from "./Revenue";
import FeedDevices from "./FeedDevices";
// import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
// import { Icon } from '@iconify/react';
import CountUp from "react-countup";
import axios from "axios";
// import StoreVisits from "./StoreVisits";
// import TopSellers from "./TopSellers";
import 'react-notifications/lib/notifications.css';
import { api } from "../../config";
import { io } from 'socket.io-client';
import tankpic from "../../assets/images/1.svg";
import { SortingTable } from './ReactTable'
import {
    StepLineChart
} from './ECharts'
import { Icon } from '@iconify/react';
import SensorWorking from "./SensorWorking";
import SensorStatus from "./SensorStatus";
import "../../assets/scss/tank.css";

var socket = io.connect(api.SOCKET_API_URL)

const mapStyles = {
    width: '100%',
    height: '100%',
};
const LoadingContainer = () => <div>Loading...</div>
const DashboardEcommerce = (props) => {
    document.title = "Dashboard";

    const DubaiCoordinates = { lat: 25.207964, lng: 55.265867 };
    const DubaiCoordinates_1 = { lat: 25.207653, lng: 55.290286 };
    const DubaiCoordinates_2 = { lat: 25.181131, lng: 55.252864 };


    const [heartbeat, setheartbeat] = useState(0)

    const [tankLevel, setTankLevel] = useState([])

    const [temp1, setTempOne] = useState(0)
    const [hum1, setHum1] = useState(0)
    const [temp2, setTemp2] = useState(0)
    const [hum2, setHum2] = useState(0)
    const [pingDist, setPingDis] = useState(0)
    const [irDist, setIrDist] = useState(0)
    const [vlDist, setVlDist] = useState(0)
    const [btyVolt, setBtyVolt] = useState(0)
    const [solarVolt, setSolarVolt] = useState(0)
    const [btyCur, setBtyCur] = useState(0)
    const [solarCur, setSolarCur] = useState(0)
    const [motorCur, setMotorCur] = useState(0)
    const [pitch, setPitch] = useState(0)
    const [roll, setRoll] = useState(0)
    const [imuVibX, setImuVibX] = useState(0)
    const [imuVibY, setImuVibY] = useState(0)
    const [imuVibZ, setImuVibZ] = useState(0)
    const [imuVibG, setImuVibG] = useState(0)
    const [peakRes, setPeakRes] = useState(0)

    /*
    DHT1=W,
  DHT2=W,
  Ping=W,
  IR=W,
  VL53=N,
  BtyCurrent=W,
  SolarCurrent=W,
  MotorCurrent=W,
  BtyVoltage=W,
  SolarVoltage=N,
  IMU=W
  
    */
    const [dht1, setDht1] = useState(0)
    const [dht2, setDht2] = useState(0)
    const [pingW, setPingW] = useState(0)
    const [irw, setIRW] = useState(0)
    const [vl53, setVL53] = useState(0)
    const [btyCurW, setBtyCurW] = useState(0)
    const [solarCurW, setSolarCurW] = useState(0)
    const [motorCurW, setMotorCurW] = useState(0)
    const [btyVoltW, setBtyVoltW] = useState(0)
    const [sVoltW, setSolarVoltW] = useState(0)
    const [imuW, setImuW] = useState(0)
    const [camPic, setPicture] = useState(0)
    const [camPic2, setPicture2] = useState(0)
    const [camPicChunks, setPictureChunks] = useState([])
    const [camPicChunks2, setPictureChunks2] = useState([])
    const [alarmMotor, setAlarmMotor] = useState([])
    const [alarmTilt, setAlarmTilt] = useState([])
    const [alarmVib, setAlarmVib] = useState([])


    /*
    temp1, 1<25.80>1
  hum1, 2<43.90>2,
  temp2, 3<26.00>3,
  hum2, 4<43.30>4,
  ping_dist, 5<61.53>5,
  ir_dist, 6<85>6,
  vl_dist, 7<6553>7,
  bty_volt_f, 8<11.49>8,
  solar_volt_f, 9<0.13>9,
  bty_current_ma, 10<-50>10,
  solar_current_ma, 12<-275>12,
  motor_current_ma, 13<-450>13,
  pitch, 14<-50.20>14,
  roll, 15<-18.01>15,
  imu_vib_x, 16<0.00,0.00,0.00>16,
  imu_vib_y, 16<0.00,0.00,0.00>16,
  imu_vib_z, 16<0.00,0.00,0.00>16,
  imu_vib_g, 17<0.00>17,
  peak_res, 18<0.37>18,
  
    */
    useEffect(() => {
        socket = io.connect(api.SOCKET_API_URL)
        getSensorData();
        mySocketSystem();
        console.log("Use Effect")

        return () => {
            socket.off(`custom-event`)
            socket.off("connect")
            socket.disconnect()
         }
    }, [])
    const getSensorData = () => {
        axios.get(api.API_URL + "/api/getSensorData")
            .then(result => {
                updateSensorData(JSON.parse(result.data.client_message));
                // console.log("Result:\n" + result)
            })
            .catch(err => console.log("Error:\n\n" + err))
    }
    const updateSensorData = (message) => {
        getTankCapacity(message["5"])
        setTempOne(message["1"])
        setHum1(message["2"])
        setTemp2(message["3"])
        setHum2(message["4"])
        setPingDis(message["5"])
        setIrDist(message["6"])
        setVlDist(message["7"])
        setBtyVolt(message["8"])
        setSolarVolt(message["9"])
        setBtyCur(message["10"])
        setSolarCur(message["12"])
        setMotorCur(message["13"])
        setPitch(message["14"])
        setRoll(message["15"])
        setImuVibX(message["16"])
        setImuVibY(message["16"])
        setImuVibZ(message["16"])
        setImuVibG(message["17"])
        setPeakRes(message["18"])

    }
    const getTankCapacity = (ping_dist) => {
        let total_cm = 70;
        if (ping_dist > total_cm) {
            ping_dist = 70;
        }
        setTankCapacity(Math.round((total_cm - ping_dist) * 100 / total_cm));
    }
    const [tankCapacity, setTankCapacity] = useState();

    const mySocketSystem = () => {

        socket.on("connect", () => {
            var chunks = { 'capture1': [], 'capture2': [], 'Processed1': [], 'Processed2': [] };
            socket.on("cam-event", (topic, stream) => {
                console.log("received camera message: ", topic);
                // chunks[topic].push(stream);
                if (topic == "capture1") {
                    chunks.capture1.push(stream);
                    setPicture(chunks.capture1)
                } else if (topic == "capture2") {
                    chunks.capture2.push(stream);
                    setPicture2(chunks.capture2)
                } else if (topic == "Processed1") {
                    chunks.Processed1.push(stream);
                    setPicture(chunks.Processed1)
                } else if (topic == "Processed2") {
                    chunks.Processed2.push(stream);
                    setPicture2(chunks.Processed2)
                }
            });

            socket.on("custom-event", (topic, message) => {

                console.log("received socket message: ", topic, message)
                if (topic == "HB") {
                    setheartbeat(message.key)
                } else if (topic == "sensorstatus") {
                    updateSensorData(message);
                } else if (topic == "sensorworking") {
                    setDht1(message["DHT1"])
                    setDht2(message["DHT2"])
                    setPingW(message["Ping"])
                    setIRW(message["IR"])
                    setVL53(message["VL53"])
                    setBtyCurW(message["BtyCurrent"])
                    setSolarCurW(message["SolarCurrent"])
                    setMotorCurW(message["MotorCurrent"])
                    setBtyVoltW(message["BtyVoltage"])
                    setSolarVoltW(message["SolarVoltage"])
                    setImuW(message["IMU"])
                    //} else if (topic == "alarmmotor" || topic == "alarmtilt") {

                } else if (topic == "capture1") {
                    if (message !== null)
                        setPicture(message["key"])
                } else if (topic == "capture2") {
                    if (message !== null)
                        setPicture2(message["key"])
                } else if (topic == "Processed1") {
                    if (message !== null)
                        setPicture(message["key"])
                } else if (topic == "Processed2") {
                    if (message !== null)
                        setPicture2(message["key"])
                }
            })
        })

    }
    const [rightColumn, setRightColumn] = useState(false);
    const toggleRightColumn = () => {
        setRightColumn(!rightColumn);
    };
    //var [img_id, setImgId] = useState(0);
    const imgShow = (type) => {
        if (type == 0) {
            if (camPic == 0) {

                return <div className="d-flex justify-content-center"><Icon icon="ri:loop-right-fill" color="#ccc" width="50" height="50" /></div>
            } else {

                //let img = JSON.parse(camPic);
                //let base64ImageString = Buffer.from(camPic, 'binary').toString('base64')
                //let base64ImageString = Buffer.from(camPic, 'base64');
                // return <div className="d-flex justify-content-center">Image Loading...</div>
                // return <img src={'data:image/png;base64,' + camPic} width={"350"} height={"280"} />
                //setImgId(img_id++)
                return <img src={api.API_URL + '/' + camPic} className={"card-img-top"} style={{ width: "100%" }} />
                // return <img src={'data:image/jpeg;base64,' + window.btoa(camPic)} style={{ width: "100%" }} />

            }
        } else {
            if (camPic2 == 0) {
                return <div className="d-flex justify-content-center"><Icon icon="ri:loop-right-fill" color="#ccc" width="50" height="50" /></div>
            } else {

                //let img = JSON.parse(camPic);
                //let base64ImageString = Buffer.from(camPic, 'binary').toString('base64')
                //let base64ImageString = Buffer.from(camPic, 'base64');
                // return <div className="d-flex justify-content-center">Image Loading...</div>
                // return <img src={'data:image/png;base64,' + camPic} width={"350"} height={"280"} />
                //setImgId(img_id++)
                return <img src={api.API_URL + '/' + camPic2} className={"card-img-top"} style={{ width: "100%" }} />
                // return <img src={'data:image/jpeg;base64,' + window.btoa(camPic2)} style={{ width: "100%" }} />

            }
        }
    };
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row>

                                    <Col xl={6}>
                                        <Card>
                                            <CardHeader>
                                                <h4 className="card-title mb-0">Cam 1</h4>
                                            </CardHeader>
                                            <CardBody>
                                                {imgShow(0)}
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xl={6}>
                                        <Card>
                                            <CardHeader>
                                                <h4 className="card-title mb-0">Cam 2</h4>
                                            </CardHeader>
                                            <CardBody>
                                                {imgShow(1)}
                                            </CardBody>
                                        </Card>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col xl={6}>
                                        <Row>
                                            <Col xl={6}>

                                                <Card className="card-animate">
                                                    <CardBody>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <p className="text-uppercase d-flex align-items-center justify-content-center">Temperature 1</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center mt-1">
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                                                <span className="counter-value" data-target="559.25">
                                                                    <CountUp
                                                                        start={0}
                                                                        prefix={""}
                                                                        suffix={" &#176;c"}
                                                                        separator={" "}
                                                                        end={temp1}
                                                                        decimals={""}
                                                                        duration={0.2}
                                                                    />
                                                                </span>
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>

                                            </Col>

                                            <Col xl={6}>

                                                <Card className="card-animate">
                                                    <CardBody>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <p className="text-uppercase d-flex align-items-center justify-content-center">Temperature 2</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center mt-1">
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                                                <span className="counter-value" data-target="559.25">
                                                                    <CountUp
                                                                        start={0}
                                                                        prefix={""}
                                                                        suffix={" &#176;c"}
                                                                        separator={" "}
                                                                        end={temp2}
                                                                        decimals={""}
                                                                        duration={0.2}
                                                                    />
                                                                </span>
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl={6}>

                                                <Card className="card-animate">
                                                    <CardBody>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <p className="text-uppercase d-flex align-items-center justify-content-center">Humidity 1</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center mt-1">
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                                                <span className="counter-value" data-target="559.25">
                                                                    <CountUp
                                                                        start={0}
                                                                        prefix={""}
                                                                        suffix={"%"}
                                                                        separator={" "}
                                                                        end={hum1}
                                                                        decimals={""}
                                                                        duration={0.2}
                                                                    />
                                                                </span>
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>

                                            </Col>
                                            <Col xl={6}>

                                                <Card className="card-animate">
                                                    <CardBody>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <p className="text-uppercase d-flex align-items-center justify-content-center">Humidity 2</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center mt-1">
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-1">
                                                                <span className="counter-value" data-target="559.25">
                                                                    <CountUp
                                                                        start={0}
                                                                        prefix={""}
                                                                        suffix={"%"}
                                                                        separator={" "}
                                                                        end={hum2}
                                                                        decimals={""}
                                                                        duration={0.2}
                                                                    />
                                                                </span>
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>

                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col xl={6} style={{ marginBottom: "20px" }}>
                                        <Card className="myCards">
                                            <CardHeader>
                                                <h5 className="card-title mb-0">Deer Feeder Tank Level</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="d-flex align-items-center justify-content-center mt-1 ">
                                                    <div className="tank bg-white position-relative d-flex justify-content-center align-items-center">
                                                        <div className={"feed w-100 position-absolute bottom-0 " + (tankCapacity <= 40 && tankCapacity >= 20 ? "bg-yellow" : (tankCapacity < 20 ? "bg-red" : "bg-green"))} style={{ height: tankCapacity + "%" }}></div>
                                                        <p className="percent fs-1" id="percent">{tankCapacity}%</p>
                                                    </div>
                                                    <div className="position-absolute" style={{ top: "80px" }}>
                                                        <img src={tankpic} width="220px" height="270px" />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>

                                    </Col>





                                </Row>


                                <Row>
                                    <SensorStatus temp1={temp1}
                                        hum1={hum1}
                                        temp2={temp2}
                                        hum2={hum2}
                                        pingDist={pingDist}
                                        irDist={irDist}
                                        vlDist={vlDist}
                                        btyVolt={btyVolt}
                                        solarVolt={solarVolt}
                                        btyCur={btyCur}
                                        solarCur={solarCur}
                                        motorCur={motorCur}
                                        pitch={pitch}
                                        roll={roll}
                                        imuVibX={imuVibX}
                                        imuVibY={imuVibY}
                                        imuVibZ={imuVibZ}
                                        imuVibG={imuVibG}
                                        peakRes={peakRes}

                                    />
                                </Row>
                                <Row>
                                    {/* DHT1=W,
                  DHT2=W,
                  Ping=W,
                  IR=W,
                  VL53=N,
                  BtyCurrent=W,
                  SolarCurrent=W,
                  MotorCurrent=W,
                  BtyVoltage=W,
                  SolarVoltage=N,
                  IMU=W */}

                                    <SensorWorking
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
                                    />
                                </Row>

                                <Row>
                                    <Col lg={8}>
                                        <Card>
                                            <CardHeader>
                                                <h4 className="card-title mb-0">Device Locators</h4>
                                            </CardHeader>
                                            <CardBody>
                                                <div id="gmaps-markers" className="gmaps" style={{ position: "relative" }}>
                                                    <Map
                                                        google={props.google}
                                                        zoom={5}
                                                        style={mapStyles}
                                                        initialCenter={{ lat: 25.0760224, lng: 55.2274879 }}
                                                    >
                                                        <Marker position={{ lat: 25.0760224, lng: 55.2274879 }} />
                                                        <Marker position={{ lat: 24.3870994, lng: 54.2289486 }} />
                                                    </Map>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <FeedDevices />
                                </Row>

                            </div>
                        </Col>

                        <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} />
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};
export default (
    GoogleApiWrapper({
        apiKey: "AIzaSyB7Bl8P6ChKx_l1OWR5aKT4l_h0NOhwXo4",
        LoadingContainer: LoadingContainer,
        v: "3",
    })(DashboardEcommerce)
)