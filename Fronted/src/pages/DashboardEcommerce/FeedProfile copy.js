

import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import tankpic from "../../assets/images/1.svg";
import { api } from "../../config";
import CountUp from "react-countup";
import { Card, CardBody, CardHeader, Col, Container, Row, Label, Input, Modal, ModalBody, ModalHeader, ModalFooter, Table, Spinner } from 'reactstrap';
import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns } from './ReactTable'
import {
    BasicColumn,
} from "./ColumnCharts";
import { DashedLine } from "./LineCharts";
import { Icon } from '@iconify/react';
import "../../assets/scss/tank.css";
import io from 'socket.io-client'

import SensorWorking from "./SensorWorking";
import SensorStatus from "./SensorStatus";
import avtarImage6 from '../../assets/images/users/avatar-6.jpg';
var socket = io.connect(api.SOCKET_API_URL)
const FeedProfile = () => {
    document.title = "Feed Profile";
    const [tableData, setData] = useState([])


    const location = useLocation();

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


    useEffect(() => {
        socket = io.connect(api.SOCKET_API_URL)
        mySocketSystem();
        getSchedules();
        getSensorData();
    }, [])
    const getSensorData = () => {
        axios.get(api.API_URL + "/api/getSensorData")
            .then(result => {
                updateSensorData(JSON.parse(result.data.client_message));
                // console.log("Result:\n" + result)
            })
            .catch(err => console.log("Error:\n\n" + err))
    }
    const getTankCapacity = (ping_dist) => {
        let total_cm = 70;
        if (ping_dist > total_cm) {
            ping_dist = 70;
        }
        setTankCapacity(Math.round((total_cm - ping_dist) * 100 / total_cm));
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
    var chunks = { 'capture1': [], 'capture2': [], 'Processed1': [], 'Processed2': [] };
    const mySocketSystem = () => {

        socket.on("connect", () => {
            console.log('socket is connected with id: ' + socket.id)



            socket.on("cam-event", (topic, isProcessing, stream) => {

                // chunks[topic].push(stream);
                if (topic == "capture1") {
                    console.log("received camera message: ", topic, isProcessing);
                    if (isProcessing) {
                        chunks.capture1.push(stream);
                    }
                    else {
                        imgProcessing("capture1", chunks.capture1);
                        chunks.capture1 = []
                    }
                } else if (topic == "capture2") {
                    if (isProcessing) {
                        chunks.capture2.push(stream);
                    }
                    else {
                        imgProcessing("capture2", chunks.capture2);
                        chunks.capture2 = []
                    }
                } else if (topic == "Processed1") {
                    if (isProcessing) {
                        chunks.Processed1.push(stream);
                    }
                    else {
                        imgProcessing("capture1", chunks.Processed1);
                        chunks.Processed1 = []
                    }
                } else if (topic == "Processed2") {
                    if (isProcessing) {
                        chunks.Processed2.push(stream);
                    }
                    else {
                        imgProcessing("capture2", chunks.Processed2);
                        chunks.Processed2 = []
                    }
                }
            });


            socket.on("custom-event", (topic, message) => {
                console.log("received socket message: ", topic)
                if (topic == "sensorstatus") {
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
                }
            });
        });
    };

    {/*  title, quantity, feed_schedule, feed_time, feed_day  */ }

    const [title, setTitle] = useState();
    const [quantity, setQuantity] = useState();
    const [feed_schedule, setFeedSchedule] = useState();
    const [feed_time, setFeedTime] = useState();
    const [feed_day, setFeedDay] = useState();
    const [tankCapacity, setTankCapacity] = useState();




    const [mySchedules, setSchedules] = useState([]);

    const saveInfo = () => {
        let data = {
            title: title,
            quantity: quantity,
            feed_schedule: feed_schedule,
            feed_time: feed_time,
            feed_day: feed_day
        };
        axios.post(api.API_URL + "/api/addSchedule", data)
            .then(res => {
                console.log(res);
                setSchedules(res.data)
            })
            .catch(err => console.log(err))
    }
    const updateSchedule = (id, value) => {
        // console.log("Schedule", id, (value ? "1" : "0"));
        let is_enabled = (value ? "1" : "0");
        axios.post(api.API_URL + "/api/updateScheduleStatus/" + id, { is_enabled: is_enabled })
            .then(res => {
                console.log(res);
                setSchedules(res.data)
            })
            .catch(err => console.log(err))

    }
    const getSchedules = (id, value) => {
        // console.log("Schedule", id, (value ? "1" : "0"));
        axios.get(api.API_URL + "/api/getSchedules")
            .then(res => {
                console.log(res);
                setSchedules(res.data)
            })
            .catch(err => console.log(err))

    }
    const imgProcessing = (id, value) => {

        var img1 = document.getElementById(id);
        var newImg = new Image();
        newImg.src = "data:image/jpeg; base64, " + window.btoa(value);
        newImg.id = id;
        newImg.className = 'card-img-top'
        newImg.style = 'width:100%';
        if (img1 != null && img1 != "undefined")
            img1.parentNode.replaceChild(newImg, img1);
    }
    const imgShow = () => {

        return <img className={"card-img-top"} style={{ width: "100%" }} id="capture1" />
        // if (camPic == 0) {
        //     return <div className="d-flex justify-content-center">
        //         <Spinner size="lg" color="light" className='me-2'> Loading... </Spinner>
        //     </div>
        // } else {

        //     //let img = JSON.parse(camPic);
        //     //let base64ImageString = Buffer.from(camPic, 'binary').toString('base64')
        //     //let base64ImageString = Buffer.from(camPic, 'base64');
        //     // return <div className="d-flex justify-content-center">Image Loading...</div>
        //     // return <img src={'data:image/png;base64,' + camPic} width={"350"} height={"280"} />
        //     //setImgId(img_id++)
        //     // return <img src={api.API_URL + '/' + camPic} className={"card-img-top"} style={{ width: "100%" }} />
        //     return <img src={'data:image/png;base64,' + window.btoa(camPic)} className={"card-img-top"} style={{ width: "100%" }} id="capture1" />


        // }
    };
    const imgShow2 = () => {
        return <img id="capture2" className={"card-img-top"} style={{ width: "100%" }} />
        // if (camPic2 == 0) {
        //     return <div className="d-flex justify-content-center">
        //         <Spinner size="lg" color="light" className='me-2'> Loading... </Spinner>
        //     </div>
        // } else {

        //     //let img = JSON.parse(camPic);
        //     //let base64ImageString = Buffer.from(camPic, 'binary').toString('base64')
        //     //let base64ImageString = Buffer.from(camPic, 'base64');
        //     // return <div className="d-flex justify-content-center">Image Loading...</div>
        //     // return <img src={'data:image/png;base64,' + camPic} width={"350"} height={"280"} />
        //     //setImgId(img_id++)
        //     // return <img src={api.API_URL + '/' + camPic} className={"card-img-top"} style={{ width: "100%" }} />
        //     return <img id="capture2" src={'data:image/png;base64,' + window.btoa(camPic2)} className={"card-img-top"} style={{ width: "100%" }} />


        // }
    };
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }
    return (

        <React.Fragment>


            {/* Static Backdrop Modal */}
            <Modal
                isOpen={modal_backdrop}
                toggle={() => {
                    tog_backdrop();
                }}
                backdrop={'static'}
                id="staticBackdrop"
                centered
            >
                <ModalHeader className="modal-title" id="staticBackdropLabel" toggle={() => {
                    tog_backdrop();
                }}>
                    Feed Level

                    {/*  title, quantity, feed_schedule, feed_time, feed_day  */}
                </ModalHeader>
                <ModalBody className="p-5">
                    <Row>
                        <Col xl={6}>
                            <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} placeholder="Set Schedule Name" className="form-control" />
                        </Col>
                        <Col xl={6}>
                            <input type="text" name="quantity" id="quantity" onChange={(e) => setQuantity(e.target.value)} placeholder="Set Food Quantity" className="form-control" />
                        </Col>
                    </Row>
                    <Row>
                        <h3>Time of Day</h3>
                        <Col xl={4}>
                            Sunset
                        </Col>
                        <Col xl={4}>
                            Sunrise
                        </Col>
                        <Col xl={4}>
                            Fixed Time
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <select onChange={(e) => setFeedSchedule(e.target.value)} className="form-control" id="feed_schedule" name="feed_schedule">
                                <option value={""}>Select Schedule</option>
                                <option value={"Sunset"}>Sunset</option>
                                <option value={"Sunrise"}>Sunrise</option>
                                <option value={"FixedTime"}>FixedTime</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <input type="text" onChange={(e) => setFeedTime(e.target.value)} id="feed_time" placeholder="Fixed Time" name="feed_time" />
                        </Col>
                    </Row>
                    <Row>
                        <h3>Time of Day ({feed_day}{feed_time})</h3>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Mon"} name="food_day" />Mon</Col>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Tue"} name="food_day" />Tue</Col>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Wed"} name="food_day" />Wed</Col>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Thu"} name="food_day" />Thu</Col>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Fri"} name="food_day" />Fri</Col>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Sat"} name="food_day" />Sat</Col>
                        <Col xl={3}><input onChange={(e) => setFeedDay(e.target.value)} type="radio" value={"Sun"} name="food_day" />Sun</Col>
                    </Row>


                </ModalBody>
                <ModalFooter>

                    <div className="hstack gap-2 justify-content-center">
                        <button className="btn btn-success" onClick={saveInfo}>Save Schedule</button>
                    </div>
                </ModalFooter>
            </Modal>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={6}>

                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">Bird Feeder Tank Level</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg={6}>
                                            <Row className="mb-3">
                                                <Col lg={2}>
                                                    <div className="bg-success bg-gradient p-2" style={{ width: "20px" }}></div>
                                                </Col>
                                                <Col lg={5}>
                                                    Highest
                                                </Col>
                                                <Col lg={5} className="text-end">
                                                    60 - 100
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col lg={2}>
                                                    <div className="bg-warning bg-gradient p-2" style={{ width: "20px" }}></div>
                                                </Col>
                                                <Col lg={5}>
                                                    Medium
                                                </Col>
                                                <Col lg={5} className="text-end">
                                                    30 - 60
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col lg={2}>
                                                    <div className="bg-danger bg-gradient p-2" style={{ width: "20px" }}></div>
                                                </Col>
                                                <Col lg={5}>
                                                    Low
                                                </Col>
                                                <Col lg={5} className="text-end">
                                                    0 - 30
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="d-flex align-items-center justify-content-center mt-1 ">
                                                <div className="tank bg-white position-relative d-flex justify-content-center align-items-center">
                                                    <div className={"feed w-100 position-absolute bottom-0 " + (tankCapacity <= 40 && tankCapacity >= 20 ? "bg-yellow" : (tankCapacity < 20 ? "bg-red" : "bg-green"))} style={{ height: tankCapacity + "%" }}></div>
                                                    <p className="percent fs-1" id="percent">{tankCapacity}%</p>
                                                </div>
                                                <div className="position-absolute">
                                                    <img src={tankpic} width="220px" height="270px" />
                                                </div>
                                            </div>

                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Bird Feeder Tank Level</h5>
                                        </Col>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0 float-end">
                                                <Icon icon="ri:add-box-line" color="#ca1e17" width="30" height="30" style={{ cursor: "pointer" }} onClick={() => tog_backdrop()} />
                                            </h5>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    {
                                        (mySchedules && Object.keys(mySchedules).length > 0) ?
                                            (mySchedules.map((val, i) => {
                                                return (
                                                    <Row key={i}>
                                                        <Col lg={3}>
                                                            <h6>{val.title}, {val.feed_schedule}</h6>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <h6>{val.quantity} KG</h6>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <h6>{val.feed_time} on {val.feed_day}</h6>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <div className="form-check form-switch form-switch-sm float-right" dir="ltr">
                                                                <Input type="checkbox" onChange={(e) => updateSchedule(val.id, e.target.checked)} defaultChecked={val.is_enabled} className="form-check-input" id="customSwitchsizelg" />
                                                                {/* <Label className="form-check-label" htmlFor="customSwitchsizelg">Large Size Switch</Label> */}
                                                            </div>
                                                        </Col>
                                                        <hr></hr>
                                                    </Row>
                                                );
                                            })) : ('')
                                    }
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>
                    <Row>


                        <Col lg={6}>
                            <Card className="myCards">
                                <CardHeader>
                                    <h5 className="card-title mb-0">Camera1</h5>
                                </CardHeader>
                                <CardBody>
                                    <img id="capture1" className={"card-img-top"} style={{ width: "100%" }} />
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card className="myCards">
                                <CardHeader>
                                    <h5 className="card-title mb-0">Camera2</h5>
                                </CardHeader>
                                <CardBody>
                                    <img id="capture2" className={"card-img-top"} style={{ width: "100%" }} />
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

                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Feed Available</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Image</th>
                                                    <th scope="col">Bird Name</th>
                                                    <th scope="col">Qty</th>
                                                    <th scope="col">Date & Time</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Curtis Weaver</td>
                                                    <td>4</td>
                                                    <td>Nov 14, 2021</td>
                                                    <td><span className="badge bg-success">View</span></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Curtis Weaver</td>
                                                    <td>4</td>
                                                    <td>Nov 14, 2021</td>
                                                    <td><span className="badge bg-success">View</span></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Curtis Weaver</td>
                                                    <td>4</td>
                                                    <td>Nov 14, 2021</td>
                                                    <td><span className="badge bg-success">View</span></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Curtis Weaver</td>
                                                    <td>4</td>
                                                    <td>Nov 14, 2021</td>
                                                    <td><span className="badge bg-success">View</span></td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>





                    </Row>


                </Container>
            </div>
        </React.Fragment>
    );
};

export default FeedProfile