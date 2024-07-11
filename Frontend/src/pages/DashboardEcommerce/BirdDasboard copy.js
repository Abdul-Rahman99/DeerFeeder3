import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Label, Input, Modal, ModalBody, ModalHeader, ModalFooter, Table } from 'reactstrap';
// import Widget from "./Widgets";
import SensorWorking from "./SensorWorking";
// import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
// import RecentOrders from "./RecentOrders";
// import Revenue from "./Revenue";
import FeedDevices from "./FeedDevices";
// import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import { Icon } from '@iconify/react';
import CountUp from "react-countup";
import axios from "axios";
import { DashedLine } from "./LineCharts";
import 'react-notifications/lib/notifications.css';
import { api } from "../../config";
import { io } from 'socket.io-client';

import capture1 from "../../assets/images/capture1.png";
import capture2 from "../../assets/images/capture2.png";
import Processed1 from "../../assets/images/Processed1.png";
import Processed2 from "../../assets/images/Processed2.png";
import avtarImage6 from '../../assets/images/users/avatar-6.jpg';
import { SortingTable, DefaultTable } from './ReactTable'
import { ecomWidgets } from "../../common/data";
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

    const [camPic, setPicture] = useState(0)

    useEffect(() => {
        socket = io.connect(api.SOCKET_API_URL)
        mySocketSystem();
        getSchedules();
        console.log("Use Effect")

        return () => {
            socket.off(`custom-event`)
            socket.off("connect")
            socket.disconnect()
         }
    }, [])

    const getTankCapacity = (ping_dist) => {
        let total_cm = 70;
        return Math.round((total_cm - ping_dist) * 100 / total_cm);
    }


    const mySocketSystem = () => {
        socket.on("connect", () => {
            var chunks = { 'capture1': [], 'capture2': [], 'Processed1': [], 'Processed2': [] };
            // socket.on("cam-event", (topic, stream) => {
            //     console.log("received camera message: ", topic);
            //     // chunks[topic].push(stream);
            //     var img = document.getElementById("myCam");
            //     if (topic == "capture1") {
            //         chunks.capture1.push(stream);
            //         // img.setAttribute("src", 'data:image/png;base64,' + window.btoa(chunks.capture1));
            //         // setPicture(chunks.capture1)
            //     } else if (topic == "capture2") {
            //         chunks.capture2.push(stream);

            //         // setPicture2(chunks.capture2)
            //     } else if (topic == "Processed1") {
            //         chunks.Processed1.push(stream);
            //         // img.setAttribute("src", 'data:image/png;base64,' + window.btoa(chunks.Processed1));
            //         setPicture(chunks.Processed1)
            //     } else if (topic == "Processed2") {
            //         chunks.Processed2.push(stream);
            //         // setPicture2(chunks.Processed2)
            //     }
            // });
            socket.on("custom-event", (topic, message) => {

                console.log("received socket message: ", topic, message)
                if (topic == "Processed1") {
                    if (message !== null)
                        setPicture(message["key"])
                } else if (topic == "Processed2") {
                    if (message !== null)
                        setPicture(message["key"])
                }
            });

        })

    }
    const [rightColumn, setRightColumn] = useState(false);
    const toggleRightColumn = () => {
        setRightColumn(!rightColumn);
    };
    //var [img_id, setImgId] = useState(0);


    {/*  title, quantity, feed_schedule, feed_time, feed_day  */ }

    const [title, setTitle] = useState();
    const [quantity, setQuantity] = useState();
    const [feed_schedule, setFeedSchedule] = useState();
    const [feed_time, setFeedTime] = useState();
    const [feed_day, setFeedDay] = useState();
    const [tankCapacity, setTankCapacity] = useState();
    const [tableData, setTableData] = useState();




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
    const imgShow = () => {
        // return <img className={"card-img-top"} style={{ width: "100%" }} id={"myCam"} />
        if (camPic == 0) {
            return <div className="d-flex justify-content-center"><Icon icon="ri:loop-right-fill" color="#ccc" width="50" height="50" /></div>
        } else {
            // return <img src={'data:image/png;base64,' + window.btoa(camPic)} className={"card-img-top"} style={{ width: "100%" }} id={Math.random()} />
            return <img src={api.API_URL + '/' + camPic} className={"card-img-top"} style={{ width: "100%" }} />
        }
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
          backdrop={"static"}
          id="staticBackdrop"
          centered
        >
          <ModalHeader
            className="modal-title"
            id="staticBackdropLabel"
            toggle={() => {
              tog_backdrop();
            }}
          >
            Feed Level
            {/*  title, quantity, feed_schedule, feed_time, feed_day  */}
          </ModalHeader>
          <ModalBody className="p-5">
            <Row>
              <Col xl={6}>
                <input
                  type="text"
                  name="title"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Set Schedule Name"
                  className="form-control"
                />
              </Col>
              <Col xl={6}>
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Set Food Quantity"
                  className="form-control"
                />
              </Col>
            </Row>
            <Row>
              <h3>Time of Day</h3>
              <Col xl={4}>Sunset</Col>
              <Col xl={4}>Sunrise</Col>
              <Col xl={4}>Fixed Time</Col>
            </Row>
            <Row>
              <Col xl={12}>
                <select
                  onChange={(e) => setFeedSchedule(e.target.value)}
                  className="form-control"
                  id="feed_schedule"
                  name="feed_schedule"
                >
                  <option value={""}>Select Schedule</option>
                  <option value={"Sunset"}>Sunset</option>
                  <option value={"Sunrise"}>Sunrise</option>
                  <option value={"FixedTime"}>FixedTime</option>
                </select>
              </Col>
            </Row>
            <Row>
              <Col xl={12}>
                <input
                  type="text"
                  onChange={(e) => setFeedTime(e.target.value)}
                  id="feed_time"
                  placeholder="Fixed Time"
                  name="feed_time"
                />
              </Col>
            </Row>
            <Row>
              <h3>
                Time of Day ({feed_day}
                {feed_time})
              </h3>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Mon"}
                  name="food_day"
                />
                Mon
              </Col>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Tue"}
                  name="food_day"
                />
                Tue
              </Col>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Wed"}
                  name="food_day"
                />
                Wed
              </Col>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Thu"}
                  name="food_day"
                />
                Thu
              </Col>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Fri"}
                  name="food_day"
                />
                Fri
              </Col>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Sat"}
                  name="food_day"
                />
                Sat
              </Col>
              <Col xl={3}>
                <input
                  onChange={(e) => setFeedDay(e.target.value)}
                  type="radio"
                  value={"Sun"}
                  name="food_day"
                />
                Sun
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-center">
              <button className="btn btn-success" onClick={saveInfo}>
                Save Schedule
              </button>
            </div>
          </ModalFooter>
        </Modal>

        <div className="page-content">
          <Container fluid>
            <Row>
              <Col>
                <div className="h-100">
                  <Row>
                    {ecomWidgets.map((item, key) => (
                      <Col xl={3} md={6} key={key}>
                        <Card className="card-animate">
                          <CardBody>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 overflow-hidden">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                  {item.label}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                              <div>
                                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                  <span
                                    className="counter-value"
                                    data-target="559.25"
                                  >
                                    <CountUp
                                      start={0}
                                      prefix={item.prefix}
                                      suffix={item.suffix}
                                      separator={item.separator}
                                      end={item.counter}
                                      decimals={item.decimals}
                                      duration={4}
                                    />
                                  </span>
                                </h4>
                                <Link
                                  to="#"
                                  className="text-decoration-underline"
                                >
                                  {item.link}
                                </Link>
                              </div>
                              <div className="avatar-sm flex-shrink-0">
                                <span
                                  className={
                                    "avatar-title rounded fs-3 bg-" +
                                    item.bgcolor +
                                    "-subtle"
                                  }
                                >
                                  <i
                                    className={`text-${item.bgcolor} ${item.icon}`}
                                  ></i>
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <Row>
                    <Col xl={6}>
                      <Card>
                        <CardHeader>
                          <h4 className="card-title mb-0">Feed Consumption</h4>
                        </CardHeader>
                        <CardBody>
                          <DashedLine dataColors='["--vz-primary", "--vz-danger", "--vz-success"]' />
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={6}>
                      <Card>
                        <CardHeader>
                          <h4 className="card-title mb-0">Map</h4>
                        </CardHeader>
                        <CardBody>
                          <div
                            id="gmaps-markers"
                            className="gmaps"
                            style={{ position: "relative" }}
                          >
                            <Map
                              google={props.google}
                              zoom={12}
                              style={mapStyles}
                              initialCenter={DubaiCoordinates}
                            >
                              <Marker position={DubaiCoordinates} />
                              <Marker position={DubaiCoordinates_1} />
                              <Marker position={DubaiCoordinates_2} />
                            </Map>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={12}>
                      <Card>
                        <CardHeader>
                          <h4 className="card-title mb-0">Feed Available</h4>
                        </CardHeader>
                        <CardBody>
                          <SortingTable />
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  {/* <Row>

                                    <Col xl={12}>
                                        <Card>
                                            <CardHeader>
                                                <h4 className="card-title mb-0">Camera</h4>
                                            </CardHeader>
                                            <CardBody>
                                                {imgShow(0)}
                                            </CardBody>
                                        </Card>
                                    </Col>

                                </Row> */}

                  <Row>
                    <Col xl={5}>
                      <Card>
                        <CardHeader>
                          <Row>
                            <Col lg={6} className="align-middle">
                              <h5 className="card-title mb-0 align-middle">
                                Food Schedules
                              </h5>
                            </Col>
                            <Col lg={6}>
                              <Icon
                                icon="ri:add-box-line"
                                color="#1732ca"
                                width="30"
                                height="30"
                                style={{ cursor: "pointer", float: "right" }}
                                onClick={() => tog_backdrop()}
                              />
                            </Col>
                          </Row>
                        </CardHeader>
                        <CardBody>
                          {mySchedules && Object.keys(mySchedules).length > 0
                            ? mySchedules.map((val, i) => {
                                return (
                                  <Row key={i}>
                                    <Col lg={3}>
                                      <h7>
                                        {val.title}, {val.feed_schedule}
                                      </h7>
                                    </Col>
                                    <Col lg={3}>
                                      <h7>{val.quantity} KG</h7>
                                    </Col>
                                    <Col lg={3}>
                                      <h7>
                                        {val.feed_time} on {val.feed_day}
                                      </h7>
                                    </Col>
                                    <Col lg={3}>
                                      <div
                                        className="form-check form-switch form-switch-sm float-right"
                                        dir="ltr"
                                      >
                                        <Input
                                          type="checkbox"
                                          onChange={(e) =>
                                            updateSchedule(
                                              val.id,
                                              e.target.checked
                                            )
                                          }
                                          defaultChecked={val.is_enabled}
                                          className="form-check-input"
                                          id="customSwitchsizelg"
                                        />
                                        {/* <Label className="form-check-label" htmlFor="customSwitchsizelg">Large Size Switch</Label> */}
                                      </div>
                                    </Col>
                                    <hr></hr>
                                  </Row>
                                );
                              })
                            : ""}
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={7} style={{ marginBottom: "20px" }}>
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
                                        <img
                                          src={avtarImage6}
                                          alt=""
                                          className="avatar-xs rounded-circle"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>Curtis Weaver</td>
                                  <td>4</td>
                                  <td>Nov 14, 2021</td>
                                  <td>
                                    <span className="badge bg-success">
                                      View
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex gap-2 align-items-center">
                                      <div className="flex-shrink-0">
                                        <img
                                          src={avtarImage6}
                                          alt=""
                                          className="avatar-xs rounded-circle"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>Curtis Weaver</td>
                                  <td>4</td>
                                  <td>Nov 14, 2021</td>
                                  <td>
                                    <span className="badge bg-success">
                                      View
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex gap-2 align-items-center">
                                      <div className="flex-shrink-0">
                                        <img
                                          src={avtarImage6}
                                          alt=""
                                          className="avatar-xs rounded-circle"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>Curtis Weaver</td>
                                  <td>4</td>
                                  <td>Nov 14, 2021</td>
                                  <td>
                                    <span className="badge bg-success">
                                      View
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex gap-2 align-items-center">
                                      <div className="flex-shrink-0">
                                        <img
                                          src={avtarImage6}
                                          alt=""
                                          className="avatar-xs rounded-circle"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>Curtis Weaver</td>
                                  <td>4</td>
                                  <td>Nov 14, 2021</td>
                                  <td>
                                    <span className="badge bg-success">
                                      View
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>

              <RecentActivity
                rightColumn={rightColumn}
                hideRightColumn={toggleRightColumn}
              />
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
};

export default (
    GoogleApiWrapper({
        apiKey: "AIzaSyB7Bl8P6ChKx_l1OWR5aKT4l_h0NOhwXo4",
        LoadingContainer: LoadingContainer,
        v: "3",
    })(DashboardEcommerce)
)