import { GoogleApiWrapper, Map, Marker, InfoWindow } from "google-maps-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownMenu,
  TabContent,
  TabPane,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Table,
  Button,
} from "reactstrap";
// import Widget from "./Widgets";
import bell from "../../assets/images/svg/bell.svg";
import SimpleBar from "simplebar-react";
import SensorWorking from "./SensorWorking";
// import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
import moment from "moment/moment";
// import RecentOrders from "./RecentOrders";
// import Revenue from "./Revenue";
import FeedDevices from "./FeedDevices";
// import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";
import axios from "axios";
import { DashedLine } from "./LineCharts";
import "react-notifications/lib/notifications.css";
import { api } from "../../config";
import { io } from "socket.io-client";

import capture1 from "../../assets/images/capture1.png";
import capture2 from "../../assets/images/capture2.png";
import Processed1 from "../../assets/images/Processed1.png";
import Processed2 from "../../assets/images/Processed2.png";
import avtarImage6 from "../../assets/images/users/avatar-6.jpg";
import { SortingTable, DefaultTable } from "./ReactTable";
import { ecomWidgets } from "../../common/data";
import { OtherWidgetsCharts, MyPortfolioCharts } from "./WidgetsCharts";
import { SimpleDonut } from "./PieCharts";
const mapStyles = {
  width: "100%",
  height: "100%",
};
const LoadingContainer = () => <div>Loading...</div>;
var socket = io.connect(api.SOCKET_API_URL);
const DashboardEcommerce = (props) => {
  document.title = "Dashboard";
  const navigate = useNavigate();
  const DubaiCoordinates = { lat: 25.207964, lng: 55.265867 };

  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const [feedLevelData, setFeedLevelData] = useState([]);
  const [notificationsData, setNotificationsData] = useState({});

  useEffect(() => {
    getAllNotificationsList();
    socket = io.connect(api.SOCKET_API_URL);
    mySocketSystem();
    getFeedLevelData();
    // getSchedulesSummary()

    // console.log("Use Effect")
  }, []);

  // Start Socket Data
  const mySocketSystem = () => {
    socket.on("connect", () => {
      // console.log('socket is connected with id: ' + socket.id)
      socket.on("notification", (notification) => {
        // console.log("received socket notification: ", notification)
        setNotificationsData(notification);
      });
    });
  };

  // End Socket Data

  const getAllNotificationsList = () => {
    axios
      .get(api.API_URL + "/api/getAllNotificationsList")
      .then((res) => {
        setNotificationsData(res);
      })
      .catch((err) => console.log(err));
  };
  const getFeedLevelData = () => {
    axios
      .get(api.API_URL + "/api/getFeedLevelData")
      .then((res) => {
        // console.log(res);
        setFeedLevelData(res);
      })
      .catch((err) => console.log(err));
  };

  const [rightColumn, setRightColumn] = useState(false);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  const [schedulesSummaryData, setSchedulesSummaryData] = useState([]);
  const getSchedulesSummary = () => {
    axios
      .get(api.API_URL + "/api/getSchedulesSummary")
      .then((res) => {
        // console.log(res);
        setSchedulesSummaryData(res);
      })
      .catch((err) => console.log(err));
  };

  const [modal_backdrop, setmodal_backdrop] = useState(false);
  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const setupCoordinates = (coo_info) => {
    let myCoords = JSON.parse(coo_info);
    // console.log(myCoords);
    return { lat: myCoords.latitude, lng: myCoords.longitude };
  };
  const ForwardToProfile = (feeder_id) => {
    console.log("feeder_id");
    console.log(feeder_id);

    let navigate = useNavigate();
    // to = "/feed-profile" state = {{ feederId: selectedElement.feeder_id }

    navigate("/feed-profile", { state: { feederId: feeder_id } });
  };
  const [currentVal, setCurrentVal] = useState({});
  const setCurrentData = (val) => {
    setCurrentVal(val);
    tog_backdrop();
  };
  const getTime = (createdAt) => {
    return moment(createdAt).format("MMM D, YYYY, h:mm A");
  };

  const [modal_notification, setmodal_notification] = useState(false);
  const [modalNotificationData, setModalNotificationData] = useState();
  function tog_notification() {
    setmodal_notification(!modal_notification);
  }
  
  return (
    <React.Fragment>
      {/* Static Backdrop Modal */}
      <Modal
        isOpen={modal_notification}
        toggle={() => {
          tog_notification();
        }}
        backdrop={"static"}
        id="staticNotification"
        centered
      >
        <ModalHeader
          className="modal-title"
          id="staticNotificationLabel"
          toggle={() => {
            tog_notification();
          }}
        >
          Notification Detail
          {/*  title, quantity, feed_schedule, feed_time, feed_day  */}
        </ModalHeader>
        <ModalBody className="p-5">
          <Row>
            <Col xl={3}>Device:</Col>
            <Col xl={9}>
              {modalNotificationData?.title} ({modalNotificationData?.feeder_id}
              )
            </Col>
          </Row>
          <Row>
            <Col xl={3}>Notification:</Col>
            <Col xl={9}>{modalNotificationData?.message_text}</Col>
          </Row>
          <Row>
            <Col xl={3}>Time:</Col>
            <Col xl={9}>{getTime(modalNotificationData?.createdAt)}</Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-center">
            <button
              className="btn btn-primary"
              onClick={() => tog_notification()}
            >
              Close
            </button>
          </div>
        </ModalFooter>
      </Modal>
      {/* Modal code exited */}

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
            <Col xl={3}>Title:</Col>
            <Col xl={9}>{currentVal.title}</Col>
          </Row>
          <Row>
            <Col xl={3}>Feeder ID:</Col>
            <Col xl={9}>{currentVal.feeder_id}</Col>
          </Row>
          <Row>
            <Col xl={3}>Location:</Col>
            <Col xl={9}>{currentVal.location}</Col>
          </Row>
          <Row>
            <Col xl={3}>Tank Level:</Col>
            <Col xl={9}>{currentVal.tankLevel}%</Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-center">
            <button className="btn btn-primary" onClick={() => tog_backdrop()}>
              Close
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section
                  rightClickBtn={toggleRightColumn}
                  notificationsData={notificationsData}
                />
                <Row>
                  <Col xl={6} md={6}>
                    <Card style={{ padding: "0" }}>
                      <CardBody>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 overflow-hidden">
                                <p className="text-uppercase mb-0">
                                  Total Active Devices
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <a href="#devicestable">
                                <div className="align-items-center">
                                  <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                                    <span
                                      className="counter-value align-items-center"
                                      data-target="100"
                                    >
                                      {feedLevelData.all_c}
                                    </span>
                                  </h6>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col xl={6} md={6}>
                    <Card style={{ padding: "0" }}>
        <CardBody>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <p className="text-uppercase mb-0">Devices Need Refill</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <a href="#devicestable">
              <div className="align-items-center">
                <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                  <span className="counter-value align-items-center" data-target="100">
                    {feedLevelData.low_c}
                  </span>
                </h6>
              </div>
            </a>
          </div>
        </CardBody>
      </Card>
                  </Col>
                </Row>

                <Row>
                  <Col xl={8}>
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
                            zoom={7}
                            style={mapStyles}
                            initialCenter={DubaiCoordinates}
                          >
                            {feedLevelData.all?.map((val, i) => {
                              return (
                                <Marker
                                  key={i}
                                  title={val.title}
                                  position={setupCoordinates(val.other_info)}
                                  onClick={(props, marker) => {
                                    // to = "/feed-profile" state = {{ feederId: selectedElement.feeder_id }

                                    navigate("/feed-profile", {
                                      state: { feederId: val.id },
                                    });
                                  }}
                                />
                              );
                            })}
                          </Map>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card>
                      <CardHeader>
                        <h4 className="card-title mb-0">Notifications</h4>
                      </CardHeader>
                      <CardBody style={{ padding: "0" }}>
                        {Object.keys(notificationsData).length > 0 ? (
                          <SimpleBar style={{ maxHeight: "330px" }}>
                            {notificationsData.map((val, i) => {
                              return (
                                <div
                                  key={i}
                                  className="text-reset notification-item d-block dropdown-item position-relative"
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="d-flex">
                                    <div className="flex-grow-1">
                                      <h6
                                        className="mt-0 mb-2 lh-base stretched-link"
                                        onClick={() => {
                                          setModalNotificationData(val);
                                          tog_notification();
                                        }}
                                      >
                                        <strong>{val.title}</strong>&nbsp;
                                        {val.message_text}
                                      </h6>
                                      <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                        <span>
                                          <i className="mdi mdi-clock-outline"></i>{" "}
                                          {getTime(val.createdAt)}{" "}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </SimpleBar>
                        ) : (
                          <TabPane
                            tabId="1"
                            className="p-4"
                            style={{ display: "block" }}
                          >
                            <div className="w-25 w-sm-50 pt-3 mx-auto">
                              <img
                                src={bell}
                                className="img-fluid"
                                alt="user-pic"
                              />
                            </div>
                            <div className="text-center pb-5 mt-2">
                              <h6 className="fs-18 fw-semibold lh-base">
                                Hey! You have no any notifications{" "}
                              </h6>
                            </div>
                          </TabPane>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row id="devicestable">
                  <Col xl={12}>
                    <Card>
                      <CardHeader>
                        <h4 className="card-title mb-0">Bird Feeders List</h4>
                      </CardHeader>
                      <CardBody>
                        <SortingTable myData={feedLevelData.all} />
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

export default GoogleApiWrapper({
  apiKey: "AIzaSyB7Bl8P6ChKx_l1OWR5aKT4l_h0NOhwXo4",
  LoadingContainer: LoadingContainer,
  v: "3",
})(DashboardEcommerce);
