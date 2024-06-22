import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Button
} from "reactstrap";
import SimpleBar from "simplebar-react";
import moment from "moment/moment";
import { isEmpty, map } from "lodash";

//Import Icons
import FeatherIcon from "feather-icons-react";
import PersonalInfo from "./PersonalInfo";
import { api } from "../../config";

import { chatContactData } from "../../common/data";

//redux


import avatar2 from "../../assets/images/users/avatar-2.jpg";
import userDummayImage from "../../assets/images/users/user-dummy-img.jpg";

//Import Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";
import { createSelector } from "reselect";
import * as io from 'socket.io-client'

var socket = io.connect(api.SOCKET_API_URL)

const ServerCommands = () => {

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [Chat_Box_Username, setChat_Box_Username] = useState("Lisa Parker");
  const [Chat_Box_Image, setChat_Box_Image] = useState(avatar2);
  const [messageBox, setMessageBox] = useState(null);


  // Inside your component
  const [messages, updateMessages] = useState([])
  //Toggle Chat Box Menus
  useEffect(() => {
    socket = io.connect(api.SOCKET_API_URL)
    fetchData("", "")
  }, []);


  const scrollToBottom = useCallback(() => {
    if (messageBox) {
      messageBox.scrollToBottom = messageBox.scrollHeight + 1000;
    }
  }, [messageBox]);


  socket.on("connect", () => {
    console.log('socket is connected with id: ' + socket.id)
    socket.on("custom-event", (topic, message) => {
      if ("feedsetting" == topic || topic == "ctrlHB") {
        console.log('socket message', topic, message)
        fetchData("", "");
        scrollToBottom();
      }
    });
  });



  document.title = "Server Commands";

  const [topic, setClientTopic] = useState(0)


  const [feedDuration, setFeedDuration] = useState("")
  const [feedInterval, setFeedInterval] = useState("")
  const [feedMode, setFeedMode] = useState(0)
  const [feedTime, setFeedTime] = useState("")
  const [clientAll, setClientAll] = useState("")
  const [motorPower, setMotorPower] = useState("")

  //BF_3485186abfc8
  var i = 0;
  const publishData = () => {
    let message;
    if (topic == "ctrl/feedsetting") {
      if (feedMode == "interval") {

        message = "0<ctrl_feed>0," +
          "1<" + clientAll + ">1," +
          "31<" + feedDuration + ">31," +
          "32<" + motorPower + ">32," +
          "34<" + feedInterval + ">34";
      } else if (feedMode == "time") {
        // let alltimes = feedTime.split(",");
        // alltimes.length>1 ?
        message = "0<ctrl_feed_timings>0," +
          "1<" + clientAll + ">1," +
          "81<" + feedTime + ">81";
      }
    } else if (topic == "ctrl/testsettings") {
      message = "Test";

    } else if (topic == "ctrl/jerk") {
      message = "";
    } else if (topic == "ctrl/query") {
      message = "0<ctrl_query>0," +
        "1<" + clientAll + ">1";
    } else if (topic == "BF/ctrl/HB") {
      message = "1";
    }
    fetchData(topic, message);
  }
  const fetchData = (topic, message) => {
    axios.post(api.API_URL + "/api/publishMessage", { topic, message })
      .then(result => {
        updateMessages(result);
        scrollToBottom()
        console.log("Result:\n" + result)
      })
      .catch(err => console.log("Error:\n\n" + err))

  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="chat-leftsidebar border bg-transparent">
              <div className="px-4 pt-4 mb-3">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="mb-4">Commands</h5>
                  </div>

                </div>

                <div className="mb-2">
                  <select className="form-control select2" onChange={(e) => setClientTopic(e.target.value)}>
                    <option value="0">Select Topic</option>
                    <option value="ctrl/feedsetting">Feed Setting</option>
                    <option value="ctrl/testsettings">Test Settings</option>
                    <option value="ctrl/jerk">Jerk</option>
                    <option value="ctrl/query">Query</option>
                    <option value="BF/ctrl/HB">Heart Beat</option>
                  </select>
                </div>

                {
                  topic == "ctrl/feedsetting" ? (
                    <div>
                      <div className="mb-2">
                        <select className="form-control select2" onChange={(e) => setFeedMode(e.target.value)}>
                          <option value="0">Feed Mode</option>
                          <option value="interval">Interval Based</option>
                          <option value="time">Time Based</option>
                        </select>
                      </div>

                      {
                        feedMode == "interval" && feedMode != 0 ? (
                          <div>
                            <div className="mb-2">
                              <label>ClientID/All</label>
                              <input type="text" onChange={(e) => setClientAll(e.target.value)} placeholder="Enter All/ClientID" className="form-control" />
                            </div>
                            <div className=" mb-2">
                              <label>Feed Duration</label>
                              <input type="number" min={"1000"} max={"2000"} id="feed_duration" onChange={(e) => setFeedDuration(e.target.value)} placeholder="Feed Duration (1000ms to 2000ms)" className="form-control" />
                            </div>
                            <div className=" mb-2">
                              <label>Motor Power</label>
                              <input type="number" min={"30"} max={"95"} id="motor_power" onChange={(e) => setMotorPower(e.target.value)} placeholder="Motor Power (30 to 95)" className="form-control" />
                            </div>
                            <div className=" mb-2">
                              <label>Feed Interval</label>
                              <input type="number" min={"1"} max={"300"} id="feed_interval" onChange={(e) => setFeedInterval(e.target.value)} placeholder="Feed Interval (Minutes)" className="form-control" />
                            </div>
                          </div>

                        ) : feedMode == 0 ? ('') : (
                          <div>
                            <div className="mb-2">
                              <label>ClientID/All</label>
                              <input type="text" onChange={(e) => setClientAll(e.target.value)} placeholder="Enter All/ClientID" className="form-control" />
                            </div>
                            <div className=" mb-2">
                              <label>Feed Time</label>
                              <textarea type="text" rows={5} id="feed_time" onChange={(e) => setFeedTime(e.target.value)} placeholder="Feed Time (hh:mm,hh:mm,hh:mm,hh:mm... (atleast 2 to 20))" className="form-control" ></textarea>
                            </div>
                          </div>

                        )
                      }
                    </div>

                  ) : ('')
                }
                <div className="flex-shrink-0 mb-2">
                  <Button onClick={publishData}
                    color=""
                    id="publish"
                    className="btn btn-primary col-md-12"
                  >
                    Publish Message <i className="ri-send-plane-2-fill align-bottom float-right"></i>
                  </Button>
                </div>

              </div>
            </div>

            <div className="user-chat w-100 overflow-hidden border">
              <div className="chat-content d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                  <div className="position-relative">
                    Total {Object.keys(messages).length}


                    <div className="position-relative" id="users-chat">
                      <SimpleBar
                        className="chat-conversation p-3 p-lg-12"
                        id="chat-conversation"
                      >
                        <div id="elmLoader"></div>
                        <ul
                          className="list-unstyled chat-conversation-list"
                          id="users-conversation"
                        >

                          {messages &&
                            map(messages, (message, key) => (
                              <li
                                className={
                                  message.topic == "feedingdone" || message.topic == "ctrlHB"
                                    ? " chat-list left"
                                    : "chat-list right"
                                }
                                key={key}
                              >
                                <div className="conversation-list">
                                  <div className="user-chat-content">
                                    <small className="text-muted time">
                                      Topic: <strong>{message.topic}</strong>
                                    </small>{" "}

                                    <div className="ctext-wrap">
                                      <div className="ctext-wrap-content">
                                        <p className="mb-0 ctext-content">
                                          {message.message?.key ? message.message.key : message.message}

                                        </p>
                                      </div>
                                    </div>
                                    <div className="conversation-name">
                                      <small className="text-muted time">
                                        {moment(message.createdAt).format('YYYY-MM-DD h:mm:ss a')}
                                      </small>{" "}
                                      <span className="text-success check-message-icon">
                                        <i className="ri-check-double-line align-bottom"></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}

                        </ul>
                      </SimpleBar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div >

    </React.Fragment >
  );
};

export default ServerCommands;
