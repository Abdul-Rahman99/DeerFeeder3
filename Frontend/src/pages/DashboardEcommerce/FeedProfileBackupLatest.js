

import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import moment from "moment/moment";
import Flatpickr from "react-flatpickr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import hum_pic from "../../assets/images/humidity_icon.png";
import temp_pic from "../../assets/images/Thermometer_icon.png";
import bird_pic from "../../assets/images/bird_detect.jpg";
import battery_pic from "../../assets/images/battery.png";
import battery_pic_no from "../../assets/images/battery_no.png";

import tankpic from "../../assets/images/1.svg";
import time_sunrise from "../../assets/images/sunrise.png";
import time_sunrise_c from "../../assets/images/sunrise-01.png";
import time_sunset from "../../assets/images/sunset.png";
import time_sunset_c from "../../assets/images/sunset-01.png";
import time_day from "../../assets/images/fixed-time.png";
import time_day_c from "../../assets/images/fixed-time-01.png";
import { api } from "../../config";
import CountUp from "react-countup";
import { UncontrolledDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, Button, Card, CardBody, CardHeader, Col, Container, Row, Label, Input, Modal, Progress, ModalBody, ModalHeader, ModalFooter, Table, Spinner } from 'reactstrap';

import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns } from './ReactTable'
import {
    BasicColumn,
} from "./ColumnCharts";
import {
    BasicScatterChart,
} from "./ECharts";
import {
    Basic,
    Datetime,
    ImagesChart
} from "./ScatterCharts";

import { DashedLine, BasicLineCharts, LinewithDataLabels, LinewithDataLabelsSecond } from "./LineCharts";
import { Icon } from '@iconify/react';
import "../../assets/scss/tank.css";
import io from 'socket.io-client'

import SensorWorking from "./SensorWorking";
import SensorStatus from "./SensorStatus";
import '../../assets/scss/timer.css';
import avtarImage6 from '../../assets/images/users/avatar-6.jpg';
import sunrise_ico from '../../assets/images/sun-rise.png';
import sunset_ico from '../../assets/images/sunset-icon.png';
var socket = io.connect(api.SOCKET_API_URL)
const feed_day2 = [];
let isTimerOn = false;
var dateRangeNew = []
// var dateRangeBirdsNew = []
var FilterType = ""
var HoursMinutesList = []
const FeedProfile = (props) => {
    document.title = "Feed Profile";
    const [tableData, setData] = useState([])


    const location = useLocation();
    window.sessionStorage.setItem("feederId", location.state.feederId);
    const currentFeederId = location.state.feederId;

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
    var [camPic, setPicture] = useState(0)
    var [camPic2, setPicture2] = useState(0)

    const [deviceDetail, setDeviceDetails] = useState();
    const [weatherInfo, setWeatherInfo] = useState()
    useEffect(() => {
        console.log(weatherInfo)
    }, [weatherInfo])
    const getWeatherInfo = async (lat, lon) => {
        let api_key = "e0e1705375a62298c79d713a320acb4b";
        let weather_url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + api_key;

        await fetch(weather_url)
            .then(res => res.json())
            .then(result => {
                setWeatherInfo(result)
                getFeedsTimings(result?.sys?.sunrise, result?.sys?.sunset)
                console.log("WeatherResult:\n", weather_url, result)
            }).catch((err) => {

            });

    }
    const KelvinToCelsius = (temp) => {
        return Math.floor(temp - 273.15);
    }
    const FahrenheitToCelsius = (temp_f) => {
        // (32°F − 32) × 5 / 9 = 0°C
        return (temp_f - 32) * 5 / 9;
    }
    const [dateRangeBirdsNew, setDateRangeBirdsNew] = useState()
    const [FilterTypeBirdsNew, setFilterTypeBirdsNew] = useState("Daily")
    const [userId, setUserId] = useState()
    useEffect(() => {
        setUpDefaultDateRange();
        socket = io.connect(api.SOCKET_API_URL)
        console.log("myprops", window.sessionStorage.getItem("feederId"))
        let authUser = window.sessionStorage.getItem("authUser")
        if (authUser && authUser != null) {
            let userdata = JSON.parse(authUser);
            setUserId(userdata.data.id);
        }
        mySocketSystem();
        getDeviceDetails();

        // updateVOLTCURRENT();
        getSchedules();
        getFeederStopStatus();
        getSensorData();
        getFeedConsumptionData();
        // getBirdsData();
        getBirdsDataForGraph();

        // setTimeout(myTimer(), 5000)

    }, [])

    const [voltCurrentData, getVoltCurrentData] = useState([]);
    const updateVOLTCURRENT = () => {
        axios.get(api.API_URL + "/api/getVoltCurrentData/" + currentFeederId)
            .then(result => {
                getVoltCurrentData(result);
            })
            .catch(err => console.log("Error:\n\n" + err))

    }
    const [birdsData, setBirdsData] = useState();
    const getBirdsData = () => {
        axios.get(api.API_URL + "/api/getBirdsData/" + currentFeederId)
            .then(result => {
                setBirdsData(result.data)
            })
            .catch(err => console.log("Error:\n\n" + err))

    }

    const [BirdsDataForGraph, setBirdsDataForGraph] = useState()
    const getBirdsDataForGraph = () => {
        let url = api.API_URL + "/api/getBirdsDataForGraph/" + currentFeederId;
        console.log("FilterTypeBirdsNew", FilterTypeBirdsNew)
        if (dateRangeBirdsNew && dateRangeBirdsNew.length > 0 && FilterTypeBirdsNew && FilterTypeBirdsNew != "" && FilterTypeBirdsNew != "0") {
            let dateF = moment(dateRangeBirdsNew[0]).format("YYYY-MM-DD");



            url = url + "/" + dateF + "/" + FilterTypeBirdsNew
            // url = url + "/" + FilterTypeBirdsNew
            setMyGraphLoader(true)
            axios.get(url)
                .then(res => {
                    setMyGraphLoader(false)
                    console.log(res);
                    setBirdsDataForGraph(res.data)
                })
                .catch(err => console.log(err))
        } else {
            setMyGraphLoader(true)
            axios.get(url)
                .then(res => {
                    setMyGraphLoader(false)
                    console.log(res);
                    setBirdsDataForGraph(res.data)
                })
                .catch(err => console.log(err))

        }
    }

    const myTimer = (myTime) => {
        isTimerOn = true;

        var countDownDate = moment(myTime).zone("+0400");
        // alert(countDownDate)

        var x = setInterval(function () {

            // var now = new Date().getTime();
            var now = moment().zone("+0400");

            var distance = countDownDate - now;
            // var distance = now - countDownDate;
            console.log("myTime", distance)
            console.log("myTime", myTime, countDownDate, now)
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add leading zeros

            if (days < 0) days = 0
            if (hours < 0) hours = 0
            if (minutes < 0) minutes = 0
            if (seconds < 0) seconds = 0
            days = days < 10 && days >= 0 ? "0" + days : days;
            hours = hours < 10 && hours >= 0 ? "0" + hours : hours;
            minutes = minutes < 10 && minutes >= 0 ? "0" + minutes : minutes;
            seconds = seconds < 10 && seconds >= 0 ? "0" + seconds : seconds;

            if (document.getElementById("days") != null &&
                document.getElementById("hours") != null &&
                document.getElementById("minutes") != null &&
                document.getElementById("seconds") != null) {

                document.getElementById("days").innerHTML = days + " ";
                document.getElementById("hours").innerHTML = hours + " ";
                document.getElementById("minutes").innerHTML = minutes + " ";
                document.getElementById("seconds").innerHTML = seconds + " ";
            }
            // if (distance < 0) {
            // clearInterval(x);
            if (document.getElementById("days") != null && parseInt(document.getElementById("days").innerHTML) == 0 &&
                document.getElementById("hours") != null && parseInt(document.getElementById("hours").innerHTML) == 0 &&
                document.getElementById("minutes") != null && parseInt(document.getElementById("minutes").innerHTML) == 0 &&
                document.getElementById("seconds") != null && parseInt(document.getElementById("seconds").innerHTML) == 0) {
                clearInterval(x);
                // getDeviceDetails()
            }

            // }
        }, 1000);
        window.sessionStorage.setItem("intervalId", x)
    }

    const [showDataLabels, updateGraphLabels] = useState(true)
    // const [dateRangeNew, setDateRangeNew] = useState([])
    const setDateRangeNew = (selectedDates) => {
        dateRangeNew = []
        dateRangeNew.push(selectedDates[0]);
        dateRangeNew.push(selectedDates[1]);
    }

    const [feedConsumptionData, setFeedConsumptionData] = useState()
    const setFilterType = (val) => {
        FilterType = val
    }
    const getFormatted = (str) => {
        // let newDate = str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate() + " " + str.getHours() + ":" + str.getMinutes() + ":" + str.getSeconds();
        let newDate = str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate();
        return newDate;
    }

    const setUpDefaultDateRange = () => {
        let date_now = new Date();
        // date_now = date_now - 86400000;
        let date_pre = date_now - 604800000; //518400000; //432000000;
        // let date_pre = date_now - 518400000; //432000000;

        date_now = new Date(date_now)
        date_pre = new Date(date_pre)

        let sdatefrom = getFormatted(date_pre);
        let sdateto = getFormatted(date_now);

        dateRangeNew.push(sdatefrom);
        dateRangeNew.push(sdateto);

        setDateRangeBirdsNew([sdateto])

    }

    const [myGraphLoader, setMyGraphLoader] = useState(false)
    useEffect(() => {
        console.log('myGraphLoader is now: ', myGraphLoader);
    }, [myGraphLoader]);
    const getFeedConsumptionData = () => {
        let url = api.API_URL + "/api/getFeedConsumptionData/" + currentFeederId;
        if (FilterType && FilterType != "0" && FilterType != "undefined" && dateRangeNew && dateRangeNew.length == 2) {
            let dateF = moment(dateRangeNew[0]).format("YYYY-MM-DD");
            let dateT = moment(dateRangeNew[1]).format("YYYY-MM-DD");
            url = url + "/" + FilterType + "/" + dateF + "/" + dateT
            setMyGraphLoader(true)
            axios.get(url)
                .then(res => {
                    setMyGraphLoader(false)
                    console.log(res);
                    setFeedConsumptionData(res)
                })
                .catch(err => console.log(err))
        } else {
            setMyGraphLoader(true)
            axios.get(url)
                .then(res => {
                    setMyGraphLoader(false)
                    console.log(res);
                    setFeedConsumptionData(res)
                })
                .catch(err => console.log(err))

        }

    }

    const getDeviceDetails = async () => {
        await axios.get(api.API_URL + "/api/getDeviceDetails/" + currentFeederId)
            .then(result => {
                setDeviceDetails(result.data);
                let coords = JSON.parse(result.data.other_info);
                getWeatherInfo(coords.latitude, coords.longitude);
                // console.log("Result:\n" + result)
            })
            .catch(err => console.log("Error:\n\n" + err))
    }
    const [feedsTimings, setFeedsTimings] = useState()
    const [nextTime, setNextTime] = useState()
    const [lastTime, setLastTime] = useState()
    const [lastDate, setLastDate] = useState()
    const [HourTime, setHourTime] = useState()
    const configureFeedTimings = (CmData, StrTimings) => {
        // Here Feed Done
        if (showLoader) {
            setShowLoader(false)
            toast("Feed Done Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
        }
        var dateString = moment.unix(CmData[65]).zone('+0000').format("dddd, MMMM D, YYYY, H:mm:ss");
        // var dateString = moment.unix(CmData[65]).format("dddd, MMMM D, YYYY, H:mm:ss");
        var formattedDateString = moment(dateString).format("dddd, MMMM D, YYYY");
        var formattedTimeString = moment(dateString).format("H:mm:ss");
        var formattedHourString = moment(dateString).format("H");
        var LastFeedHourString = moment(dateString).format("Hmm");
        setLastDate(formattedDateString)
        setLastTime(formattedTimeString)
        setHourTime(formattedHourString)
        var nextTurn = moment(dateString).add(CmData[68], 'minutes').format("dddd, MMMM D, YYYY, H:mm:ss");
        // if (isTimerOn) {
        // clearInterval(x)
        // }
        clearInterval(window.sessionStorage.getItem("intervalId"))
        resetFeedTimerHTML()
        myTimer(nextTurn)


        // var CurrentdateString = moment().zone('+0400').format("dddd, MMMM D, YYYY, H:mm:ss");
        // var CurrentHourString = moment().zone('+0400').format("Hmm");

        // if (StrTimings && StrTimings != null) {
        //     let isItDone = false;
        //     for (let i = 0; i < StrTimings.length; i++) {
        //         let ArVal = StrTimings[i].split(":");
        //         let NextPossible = ArVal[0] + "" + ArVal[1];
        //         console.log("CheckTime", i)
        //         console.log("CheckTime", LastFeedHourString, NextPossible)
        //         console.log("CheckTime CurrentHourString", CurrentHourString)
        //         console.log("CheckTime LastFeedHourString < NextPossible", LastFeedHourString < NextPossible)
        //         console.log("CheckTime CurrentHourString < NextPossible", CurrentHourString < NextPossible)
        //         if (LastFeedHourString < NextPossible && CurrentHourString < NextPossible) {
        //             nextTurn = formattedDateString + ", " + formattedTimeString

        //             console.log("CheckTime nextTurn", nextTurn)
        //             isItDone = true;
        //             break;
        //         }
        //     }

        //     for (let i = 0; i < StrTimings.length; i++) {
        //         let ArVal = StrTimings[i].split(":");
        //         let NextPossible = ArVal[0] + "" + ArVal[1];
        //         console.log("CheckTime", i)
        //         console.log("CheckTime", CurrentHourString, NextPossible)
        //         console.log("CheckTime CurrentHourString < NextPossible", CurrentHourString < NextPossible)
        //         if (CurrentHourString < NextPossible) {
        //             // alert(NextPossible);
        //             isItDone = true;
        //             nextTurn = moment().zone('+0400').format("dddd, MMMM D, YYYY") + ", " + StrTimings[i] + ":00";

        //             console.log("CheckTime nextTurn", nextTurn)
        //             break;
        //         }
        //     }
        //     if (!isItDone) {
        //         let NextStrTimings = StrTimings[0];
        //         let MomentNextTime = moment(CurrentdateString).add("1", 'days').format("dddd, MMMM D, YYYY") + ", " + NextStrTimings + ":00";
        //         nextTurn = MomentNextTime
        //         console.log("CheckTime nextTurn", nextTurn)
        //     }
        //     resetFeedTimerHTML()
        //     myTimer(nextTurn)
        // } else {
        //     resetFeedTimerHTML()
        //     myTimer(nextTurn)

        // }
    }
    const resetFeedTimerHTML = () => {
        if (document.getElementById("days") != null &&
            document.getElementById("hours") != null &&
            document.getElementById("minutes") != null &&
            document.getElementById("seconds") != null) {

            document.getElementById("days").innerHTML = "";
            document.getElementById("hours").innerHTML = "";
            document.getElementById("minutes").innerHTML = "";
            document.getElementById("seconds").innerHTML = "";
        }
    }
    const [StrTimings, setStrTimings] = useState()
    const getFeedsTimings = async (sunrise, sunset) => {
        await axios.post(api.API_URL + "/api/getFeedsTimings/" + currentFeederId, {
            sunrise: sunrise,
            sunset: sunset
        })
            .then(result => {
                let myData = result.data;
                let StrTimings = result.StrTimings;
                setStrTimings(StrTimings)
                configureFeedTimings(JSON.parse(myData.client_message), StrTimings)
            })
            .catch(err => console.log("Error:\n\n" + err))
    }
    const getSensorData = () => {
        axios.get(api.API_URL + "/api/getSensorData/" + currentFeederId)
            .then(result => {
                updateSensorData(JSON.parse(result.data.client_message));
                // console.log("Result:\n" + result)
            })
            .catch(err => console.log("Error:\n\n" + err))
    }
    const getTankCapacity = (ping_dist) => {
        if (ping_dist >= 64) {
            setTankCapacity(0);
        } else if (ping_dist >= 55) {
            setTankCapacity(20);
        } else if (ping_dist >= 44) {
            setTankCapacity(40);
        } else if (ping_dist >= 35) {
            setTankCapacity(60);
        } else if (ping_dist >= 20) {
            setTankCapacity(80);
        } else {
            setTankCapacity(100);
        }
        // let total_cm = 70;
        // if (ping_dist > total_cm) {
        //     ping_dist = 70;
        // }
        // setTankCapacity(Math.round((total_cm - ping_dist) * 100 / total_cm));
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
    // var chunks = { 'capture1': [], 'capture2': [], 'Processed1': [], 'Processed2': [] };
    const mySocketSystem = () => {

        socket.on("connect", () => {
            console.log('socket is connected with id: ' + socket.id)



            socket.on("custom-event", (topic, message, feeder_id) => {
                // console.log("received socket message: ", topic)
                if (currentFeederId == feeder_id) {
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
                    } else if (topic == "feedingdone") {
                        configureFeedTimings(message, StrTimings);
                    }
                    // else if (topic == "capture1") {
                    //     setPicture(message.key)
                    // } else if (topic == "capture2") {
                    //     setPicture2(message.key)
                    // } else if (topic == "Processed1") {
                    //     setPicture(message.key)
                    // } else if (topic == "Processed2") {
                    //     setPicture2(message.key)
                    // }
                }
                if (topic == "capture1") {
                    // console.log("received socket message: ", topic)
                    if (message.key != null && message.key != "undefined") {
                        console.log("received socket message: ", message.key)
                        setPicture(message.key)
                    }
                } else if (topic == "capture2") {
                    if (message.key != null && message.key != "undefined") {
                        console.log("received socket message: ", message.key)
                        setPicture2(message.key)
                    }
                } else if (topic == "Processed1") {
                    console.log("received socket message: ", topic)
                    console.log("received socket message: ", message.key)
                    if (message.key != null && message.key != "undefined") {
                        setPicture(message.key)
                    }
                } else if (topic == "Processed2") {
                    console.log("received socket message: ", topic)
                    console.log("received socket message: ", message.key)
                    if (message.key != null && message.key != "undefined") {
                        setPicture2(message.key)
                    }
                }
            });
        });
    };

    {/*  title, quantity, feed_schedule, feed_time, feed_day  */ }
    const [isNew, setIsNew] = useState("")
    const [title, setTitle] = useState();
    const [quantity, setQuantity] = useState();
    const [feed_schedule, setFeedSchedule] = useState();
    const [feed_time, setFeedTime] = useState();
    const [feed_day, setMyFeedday] = useState([]);

    const setFeedDay = (val, is_enabled) => {
        if (is_enabled == true) {
            if (feed_day2.includes(val) == false)
                feed_day2.push(val)
        } else {
            if (feed_day2.includes(val) == true) {
                console.log("FeedDay", feed_day2, feed_day2.indexOf(val));
                feed_day2.splice(feed_day2.indexOf(val), 1);
            }
        }
        setMyFeedday(feed_day2);
        validateField()
        console.log("FeedDay", feed_day2, feed_day, val, is_enabled);
    }

    const [tankCapacity, setTankCapacity] = useState();
    const showBatteryLevel = () => {
        let myText = "";

        if (btyVolt < 11.5) {
            return myText + "0%";
        } else if (btyVolt >= 11.5 && btyVolt < 12) {
            return myText + "10%";
        } else if (btyVolt >= 12 && btyVolt < 13) {
            return myText + "60%";
        } else {
            return myText + "100%";
        }

    }


    const getFullDesc = (feed_schedule, feed_time, feed_time_type, feed_day) => {
        // Here it is
        if (feed_schedule != "FixedTime") {
            let new_feed_time;
            if (feed_time >= 60) {
                let getHours = feed_time / 60;
                new_feed_time = getHours > 1 ? getHours + " hours" : getHours + " hour";
            } else {
                new_feed_time = feed_time + " minutes";
            }
            return feed_time_type + " " + (new_feed_time) + " on " + feed_day
        } else {
            return "At " + feed_time + " on " + feed_day
        }

    }

    const [mySchedules, setSchedules] = useState([]);

    const saveInfo = () => {
        let data = {
            userId: userId,
            isNew: isNew,
            title: title,
            quantity: quantity,
            feed_schedule: feed_schedule,
            feed_time_type: FeedTimeType,
            feed_time: feed_time,
            feed_day: feed_day,
            sunrise: weatherInfo?.sys?.sunrise,
            sunset: weatherInfo?.sys?.sunset
        };
        axios.post(api.API_URL + "/api/addSchedule/" + currentFeederId, data)
            .then(res => {
                toast("Feed Schedule Added Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
                console.log(res);
                getSchedules()
                resetForm()
                tog_backdrop()
            })
            .catch(err => console.log(err))
    }
    const [feederStopStatus, setFeederStopStatus] = useState()
    const getFeederStopStatus = () => {
        axios.get(api.API_URL + "/api/getFeederStopStatus/" + currentFeederId)
            .then(res => {
                console.log(res);
                setFeederStopStatus(res)
            })
            .catch(err => console.log(err))

    }
    const UpdateScheduleStopStatus = () => {
        // console.log("Schedule", id, (value ? "1" : "0"));
        setShowstopLoader(true)
        let is_started = (feederStopStatus.status);
        axios.post(api.API_URL + "/api/UpdateScheduleStopStatus/" + userId + "/" + currentFeederId, { is_started: is_started })
            .then(res => {
                toast("Motor stop setting updated successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
                console.log(res);
                getFeederStopStatus();
                setShowstopLoader(false)
            })
            .catch(err => {
                setShowstopLoader(false)
                console.log(err)
            })

    }
    const updateSchedule = (id, value) => {
        // console.log("Schedule", id, (value ? "1" : "0"));
        let is_enabled = (value ? "1" : "0");
        axios.post(api.API_URL + "/api/updateScheduleStatus/" + userId + "/" + currentFeederId, {
            id: id,
            is_enabled: is_enabled,
            sunrise: weatherInfo?.sys?.sunrise,
            sunset: weatherInfo?.sys?.sunset
        })
            .then(res => {
                console.log(res);
                toast("Feed Schedule Status Updated Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
                getSchedules()
            })
            .catch(err => {
                console.log(err)
            })

    }
    const updateFields = (id, val) => {
        setIsNew(id)
        setTitle(val.title)
        setQuantity(val.quantity)
        setFeedSchedule(val.feed_schedule)

        setFeedTimeType(val.feed_time_type)
        setFeedTime(val.feed_time)
        setMyFeedday(JSON.parse(val.feed_day))
    }
    const resetForm = () => {
        setIsNew("")
        setTitle("")
        setQuantity("")
        setFeedSchedule("")
        setFeedTimeType("")
        setFeedTime("")
        setFeedDay("")

    }
    const deleteSchedule = (id) => {
        // console.log("Schedule", id, (value ? "1" : "0"));
        if (window.confirm('Are you sure you wish to delete?')) {
            axios.post(api.API_URL + "/api/deleteSchedule/" + userId + "/" + currentFeederId, {
                id: id,
                sunrise: weatherInfo?.sys?.sunrise,
                sunset: weatherInfo?.sys?.sunset
            })
                .then(res => {
                    console.log(res);
                    getSchedules()
                    toast("Feed Schedule Deleted Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
                })
                .catch(err => console.log(err))
        }

    }
    const getSchedules = (id, value) => {
        // console.log("Schedule", id, (value ? "1" : "0"));
        axios.get(api.API_URL + "/api/getSchedules/" + currentFeederId)
            .then(res => {
                console.log(res);
                setSchedules(res.data)
            })
            .catch(err => console.log(err))

    }
    const handlePauseStatus = (is_stopped) => {

        if (is_stopped) {
            return <Icon icon="ri:toggle-line" color="#b22" width="30" height="30" style={{ cursor: "pointer" }} onClick={() => tog_backdrop()} />
        } else {
            return <Icon icon="ri:toggle-fill" color="#2b2" width="30" height="30" style={{ cursor: "pointer" }} onClick={() => tog_backdrop()} />
        }
    }
    let [showLoader, setShowLoader] = useState(false)
    let [showstopLoader, setShowstopLoader] = useState(false)

    useEffect(() => {
        console.log('myGraphLoader is now: ', myGraphLoader);
    }, [showLoader, showstopLoader]);

    const ExecuteFeedNow = () => {
        setShowLoader(true)
        // toast("Feed Done Successfully", { position: "top-center", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
        axios.post(api.API_URL + "/api/ExecuteFeedNow/" + userId + "/" + currentFeederId)
            .then(res => {
                console.log(res);
                toast("Feed Command Executed, waiting for feed response now", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
                setShowLoader(false)
            })
            .catch(err => {
                console.log(err)
                setShowLoader(false)
            })
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

        // return <img className={"card-img-top"} style={{ width: "100%" }} id="capture1" />
        if (camPic == 0) {
            return <div className="d-flex justify-content-center">
                <Spinner size="lg" color="light" className='me-2'> Loading... </Spinner>
            </div>
        } else if (camPic != "undefined") {

            //let img = JSON.parse(camPic);
            //let base64ImageString = Buffer.from(camPic, 'binary').toString('base64')
            //let base64ImageString = Buffer.from(camPic, 'base64');
            // return <div className="d-flex justify-content-center">Image Loading...</div>
            // return <img src={'data:image/png;base64,' + camPic} width={"350"} height={"280"} />
            //setImgId(img_id++)
            return <img src={api.API_URL + '/' + camPic} className={"card-img-top"} style={{ width: "100%" }} />
            // return <img src={'data:image/png;base64,' + window.btoa(camPic)} className={"card-img-top"} style={{ width: "100%" }} id="capture1" />


        }
    };
    const imgShow2 = () => {
        // return <img id="capture2" className={"card-img-top"} style={{ width: "100%" }} />
        if (camPic2 == 0) {
            return <div className="d-flex justify-content-center">
                <Spinner size="lg" color="light" className='me-2'> Loading... </Spinner>
            </div>
        } else if (camPic2 != "undefined") {

            //let img = JSON.parse(camPic);
            //let base64ImageString = Buffer.from(camPic, 'binary').toString('base64')
            //let base64ImageString = Buffer.from(camPic, 'base64');
            // return <div className="d-flex justify-content-center">Image Loading...</div>
            // return <img src={'data:image/png;base64,' + camPic} width={"350"} height={"280"} />
            //setImgId(img_id++)
            return <img src={api.API_URL + '/' + camPic2} className={"card-img-top"} style={{ width: "100%" }} />
            // return <img id="capture2" src={'data:image/png;base64,' + window.btoa(camPic2)} className={"card-img-top"} style={{ width: "100%" }} />


        }
    };
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }

    const handleClick = (radioId) => {

        console.log("test: ", radioId)
        const radioInputs = document.querySelectorAll('.radio-input');
        const labels = document.querySelectorAll('.radio-label');
        radioInputs.forEach(input => {

            if (input.id == radioId) {
                console.log("test1: ", radioId)
                input.checked = true;
                setFeedSchedule(input.value)
                validateField()
                labels.forEach(label => {
                    console.log("test2: ", label.previousElementSibling.id, radioId)
                    if (label.previousElementSibling.id == radioId) {

                        label.children[0].style.display = 'none';
                        label.children[1].style.display = 'block';
                    } else {
                        label.children[0].style.display = 'block';
                        label.children[1].style.display = 'none';
                    }
                });
            } else {
                console.log("test3: ", radioId)
                input.checked = false;
            }
        });
    }

    const execFeedTime = () => {
        if (HoursMinutesList.length > 0) {
            let getVal = HoursMinutesList.join();
            document.getElementById("feed_time").value = getVal
            setFeedTime(getVal)
        }
    }

    const updateFeedTime = () => {
        let hourMin = timeHours + ":" + timeMinute
        if (timeMinute && timeHours && timeHours != "undefined" && timeMinute != "undefined" && HoursMinutesList.includes(hourMin) == false) {
            if (HoursMinutesList.length <= 20) {
                HoursMinutesList.push(timeHours + ":" + timeMinute)
                let getVal = HoursMinutesList.join();
                document.getElementById("feed_time").value = getVal
                setFeedTime(getVal)
            }
            else
                alert("Limit Exceeding")
        }

        console.log("HoursMinutesList", HoursMinutesList)
        // document.getElementById("feed_time").value = ""
    }
    const clearFeedTime = () => {
        HoursMinutesList = []
        // document.getElementById("feed_time").value = ""
    }
    const [TimeFrame, setTimeFrame] = useState("Sunrise")
    const [FeedTimeType, setFeedTimeType] = useState("fixed")
    const [timeMinute, setTimeMinute] = useState("")
    const [timeHours, setTimeHours] = useState("")
    const getHoursMinutesDDL = (type) => {
        if (type == 0) {
            return (<select id="feed_time2" className="form-select rounded-pill" onChange={(e) => setTimeHours(e.target.value)}>
                <option value={''}>Hours</option>
                <option value={'00'}>{'00'}</option>
                <option value={'01'}>{'01'}</option>
                <option value={'02'}>{'02'}</option>
                <option value={'03'}>{'03'}</option>
                <option value={'04'}>{'04'}</option>
                <option value={'05'}>{'05'}</option>
                <option value={'06'}>{'06'}</option>
                <option value={'07'}>{'07'}</option>
                <option value={'08'}>{'08'}</option>
                <option value={'09'}>{'09'}</option>
                <option value={'10'}>{'10'}</option>
                <option value={'11'}>{'11'}</option>
                <option value={'12'}>{'12'}</option>
                <option value={'13'}>{'13'}</option>
                <option value={'14'}>{'14'}</option>
                <option value={'15'}>{'15'}</option>
                <option value={'16'}>{'16'}</option>
                <option value={'17'}>{'17'}</option>
                <option value={'18'}>{'18'}</option>
                <option value={'19'}>{'19'}</option>
                <option value={'20'}>{'20'}</option>
                <option value={'21'}>{'21'}</option>
                <option value={'22'}>{'22'}</option>
                <option value={'23'}>{'23'}</option>
            </select>)
        } else {
            return (<select className="form-select rounded-pill" onChange={(e) => setTimeMinute(e.target.value)}>
                <option value={''}>Minutes</option>
                <option value={'00'}>{'00'}</option>
                <option value={'01'}>{'01'}</option>
                <option value={'02'}>{'02'}</option>
                <option value={'03'}>{'03'}</option>
                <option value={'04'}>{'04'}</option>
                <option value={'05'}>{'05'}</option>
                <option value={'06'}>{'06'}</option>
                <option value={'07'}>{'07'}</option>
                <option value={'08'}>{'08'}</option>
                <option value={'09'}>{'09'}</option>
                <option value={'10'}>{'10'}</option>
                <option value={'11'}>{'11'}</option>
                <option value={'12'}>{'12'}</option>
                <option value={'13'}>{'13'}</option>
                <option value={'14'}>{'14'}</option>
                <option value={'15'}>{'15'}</option>
                <option value={'16'}>{'16'}</option>
                <option value={'17'}>{'17'}</option>
                <option value={'18'}>{'18'}</option>
                <option value={'19'}>{'19'}</option>
                <option value={'20'}>{'20'}</option>
                <option value={'21'}>{'21'}</option>
                <option value={'22'}>{'22'}</option>
                <option value={'23'}>{'23'}</option>
                <option value={'24'}>{'24'}</option>
                <option value={'25'}>{'25'}</option>
                <option value={'26'}>{'26'}</option>
                <option value={'27'}>{'27'}</option>
                <option value={'28'}>{'28'}</option>
                <option value={'29'}>{'29'}</option>
                <option value={'30'}>{'30'}</option>
                <option value={'31'}>{'31'}</option>
                <option value={'32'}>{'32'}</option>
                <option value={'33'}>{'33'}</option>
                <option value={'34'}>{'34'}</option>
                <option value={'35'}>{'35'}</option>
                <option value={'36'}>{'36'}</option>
                <option value={'37'}>{'37'}</option>
                <option value={'38'}>{'38'}</option>
                <option value={'39'}>{'39'}</option>
                <option value={'40'}>{'40'}</option>
                <option value={'41'}>{'41'}</option>
                <option value={'42'}>{'42'}</option>
                <option value={'43'}>{'43'}</option>
                <option value={'44'}>{'44'}</option>
                <option value={'45'}>{'45'}</option>
                <option value={'46'}>{'46'}</option>
                <option value={'47'}>{'47'}</option>
                <option value={'48'}>{'48'}</option>
                <option value={'49'}>{'49'}</option>
                <option value={'50'}>{'50'}</option>
                <option value={'51'}>{'51'}</option>
                <option value={'52'}>{'52'}</option>
                <option value={'53'}>{'53'}</option>
                <option value={'54'}>{'54'}</option>
                <option value={'55'}>{'55'}</option>
                <option value={'56'}>{'56'}</option>
                <option value={'57'}>{'57'}</option>
                <option value={'58'}>{'58'}</option>
                <option value={'59'}>{'59'}</option>
            </select>)
        }
    }
    const getFieldsbyTime = () => {
        // if(FeedTimeType=="")
        switch (feed_schedule) {
            case "Sunrise":
            case "Sunset":
                if (FeedTimeType != "fixed" && FeedTimeType != "") {
                    return <div><select onChange={(e) => { validateField(); setFeedTime(e.target.value); }} value={feed_time} id="feed_time" className="form-select rounded-pill">
                        <option value={""}>Please Select</option>
                        <option value={"1"}>{FeedTimeType} 1 minute</option>
                        <option value={"15"}>{FeedTimeType} 15 minutes</option>
                        <option value={"30"}>{FeedTimeType} 30 minutes</option>
                        <option value={"45"}>{FeedTimeType} 45 minutes</option>
                        <option value={"60"}>{FeedTimeType} 1 hour</option>
                        <option value={"120"}>{FeedTimeType} 2 hours</option>
                        <option value={"180"}>{FeedTimeType} 3 hours</option>
                        <option value={"240"}>{FeedTimeType} 4 hours</option>
                        <option value={"300"}>{FeedTimeType} 5 hours</option>
                    </select></div>
                } else {
                    return;
                }
            case "FixedTime":
                return (
                    <div>
                        <Row>
                            <Col xl={4}>
                                {/* <select onChange={(e) => { validateField(); setFeedTime(e.target.value); }} value={feed_time} id="feed_time2" className="form-select rounded-pill">
                                    {
                                        // 
                                        
                                    }
                                </select> */}
                                {
                                    // 
                                    getHoursMinutesDDL(0)
                                }
                            </Col>
                            <Col xl={4}>
                                {/* <select onChange={(e) => { validateField(); setFeedTime(e.target.value); }} value={feed_time} id="feed_time3" className="form-select rounded-pill">
                                    {
                                        // 
                                        getHoursMinutesDDL()
                                    }
                                </select> */}
                                {
                                    // 
                                    getHoursMinutesDDL(1)
                                }
                            </Col>
                            <Col xl={4}>
                                <Button color="primary" className="btn-icon rounded-pill" onClick={() => updateFeedTime()}> <i className="ri-add-fill" /></Button>
                                <Button color="danger" className="btn-icon rounded-pill" onClick={() => clearFeedTime()}> <i className=" ri-delete-back-2-fill" /></Button>
                                <Button color="success" className="btn-icon rounded-pill" onClick={() => execFeedTime()}> <i className="  ri-check-fill" /></Button>
                            </Col>
                        </Row>

                        <input type="text" value={feed_time} onChange={(e) => { validateField(); setFeedTime(e.target.value) }} id="feed_time" placeholder="Fixed Time" name="feed_time" className="form-control" />
                        <span id="time-error" style={{ color: "#c44", fontSize: "8px" }}></span>
                    </div >)

        }
    }
    const CloseModel = () => {
        resetForm();
        tog_backdrop();
    }

    const [btnStatus, setBtnStatus] = useState(false)
    const validateField = () => {
        // console.log("valid", id, val, type)
        let regex;
        let toProcess = false;
        let toProcessTimer = false;
        let toProcessTitle = false;
        let toProcessQty = false;
        let toProcessFeedTime = false;


        var element_title = document.getElementById("title");
        var element_qty = document.getElementById("quantity");
        var element_time = document.getElementById("feed_time");

        if (feed_schedule != "FixedTime") {
            if (feed_day.length > 0) {
                // alert(feed_day.length)
                toProcess = true
            }
            if (element_time != null && element_time.value != "") {
                // alert(element_time.value)
                toProcessFeedTime = true;
            }
            toProcessTimer = true;
        } else {
            toProcess = true;
            toProcessFeedTime = true
            console.log("checkfix", element_time.value);
            if (feed_schedule == "FixedTime") {
                let txtAr = element_time.value.split(",");
                console.log("checkfix", txtAr);
                let eachCheck = true;
                if (txtAr.length > 0 && txtAr.length <= 20) {
                    txtAr.forEach((elem) => {
                        let indTime = elem.split(":")
                        if (!indTime || indTime.length == 0 || indTime.length > 2 || indTime[0] > 23 || indTime[1] > 59) {
                            eachCheck = false;
                        }
                    })
                    if (eachCheck)
                        toProcessTimer = true;
                }
            }
        }

        let regex_title = /^[a-zA-Z]{1,15}$/;
        if (element_title.value.match(regex_title)) {
            toProcessTitle = true;
        }
        let regex_qty = /^[0-9]{1,2}$/;
        if ((element_qty.value.match(regex_qty)) && element_qty.value <= 12) {
            toProcessQty = true;
        }
        document.getElementById("errorbox").innerHTML = "";
        if (toProcess && toProcessQty && toProcessTimer && toProcessTitle) {
            setBtnStatus(true)
        } else {
            if (!toProcessQty) {
                // alert("Quantity must be less than or equal to 12 KG")
                document.getElementById("errorbox").innerHTML = "Quantity must be less than or equal to 12 KG";
            } else if (!toProcessTimer) {
                document.getElementById("errorbox").innerHTML = "Fixed time must be CSV with format of HH:mm,HH:mm (min=2, max=20). Spaces are not allowed";
                // alert("Fixed time must be CSV with format of HH:mm,HH:mm (min=2, max=20")
            } else if (!toProcessTitle) {
                document.getElementById("errorbox").innerHTML = "Title must not have numbers or spaces";
                // alert("Title must not have numbers")
            } else if (!toProcessFeedTime) {
                document.getElementById("errorbox").innerHTML = "Please select Time Type";
                // alert("Please select Time Type / Days of the week")
            } else if (!toProcess) {
                document.getElementById("errorbox").innerHTML = "Please select Week Days";
                // alert("Please select Time Type / Days of the week")
            }
            setBtnStatus(false)
        }
    }
    const getWeekStatus = (days) => {
        let daysAr = JSON.parse(days);
        if (daysAr.includes("Mon") && daysAr.includes("Tue") && daysAr.includes("Wed")
            && daysAr.includes("Thu") && daysAr.includes("Fri") && daysAr.includes("Sat") && daysAr.includes("Sun")) {
            return "All Days"
        } else {
            return daysAr.join();
        }
    }
    return (
        <React.Fragment>
            <ToastContainer />

            {/* Static Backdrop Modal */}
            <Modal
                isOpen={modal_backdrop}
                toggle={() => {
                    tog_backdrop();
                }}
                backdrop={'static'}
                id="staticBackdrop"
                centered
                onLoad={() => {
                    validateField();
                    handleClick(feed_schedule)
                }}
            >
                <ModalHeader className="modal-title" id="staticBackdropLabel" toggle={() => {
                    CloseModel();
                }}>
                    Feed Schedule
                </ModalHeader>
                <ModalBody className="p-3">
                    <Row><span id="errorbox" style={{ color: "#c44", fontSize: "8px" }}></span></Row>
                    <Row className="mt-2">
                        <Col xl={6}>
                            <label>Title:</label>
                            <input type="text" name="title" id="title" value={title} onChange={(e) => { validateField(); setTitle(e.target.value) }} placeholder="Set Schedule Name" className="form-control" />

                        </Col>
                        <Col xl={6}>
                            <label>Quantity:</label>
                            <input type="text" name="quantity" value={quantity} id="quantity" onChange={(e) => { validateField(); setQuantity(e.target.value) }} placeholder="Set Food Quantity" className="form-control" />

                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col lg={4} >
                            <Card>
                                <input type="radio" id="Sunset" name="day_time" value="Sunset" className="radio-input" onChange={(e) => setTimeFrame(e.target.value)} />

                                <label htmlFor="Sunset" className="radio-label" id="Sunset_click" onClick={() => handleClick('Sunset')}>
                                    <img src={time_sunset} style={{ width: "80px", height: "70px", margin: "0 auto" }} alt="Sunset" />
                                    <img src={time_sunset_c} alt="Sunset" style={{ display: "none", width: "80px", height: "70px", margin: "0 auto" }} />
                                </label>
                                <h7 className="text-center">Sunset</h7>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card>
                                <input type="radio" id="Sunrise" name="day_time" value="Sunrise" className="radio-input" onChange={(e) => setTimeFrame(e.target.value)} />
                                <label htmlFor="Sunrise" className="radio-label" id="Sunrise_click" onClick={() => handleClick('Sunrise')}>
                                    <img src={time_sunrise} style={{ width: "70px", height: "70px", margin: "0 auto" }} alt="Sunrise" />
                                    <img src={time_sunrise_c} alt="Sunrise" style={{ display: "none", width: "70px", height: "70px", margin: "0 auto" }} />
                                </label>
                                <h7 className="text-center">Sunrise</h7>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card>
                                <input type="radio" id="FixedTime" name="day_time" value="FixedTime" className="radio-input" onChange={(e) => setTimeFrame(e.target.value)} />
                                <label htmlFor="FixedTime" className="radio-label" id="FixedTime_click" onClick={() => handleClick('FixedTime')}>
                                    <img src={time_day} style={{ width: "70px", height: "70px", margin: "0 auto" }} alt="Fixed Time" />
                                    <img src={time_day_c} alt="Fixed Time" style={{ display: "none", width: "70px", height: "70px", margin: "0 auto" }} />

                                </label>
                                <h7 className="text-center">FixedTime</h7>
                            </Card>
                        </Col>
                    </Row>
                    {
                        feed_schedule && feed_schedule != "FixedTime" ? (
                            <Row >
                                <Col xl={6}>
                                    <div className="form-check form-radio-primary mb-3">
                                        <Input className="form-check-input" type="radio" name="formradiocolor1" id="formradio_before" value={"before"} onChange={(e) => setFeedTimeType(e.target.value)} defaultChecked={FeedTimeType == "before" ? true : false} />
                                        <Label className="form-check-label" for="formradio_before">
                                            Before {feed_schedule}
                                        </Label>
                                    </div>
                                </Col>
                                <Col xl={6}>

                                    <div className="form-check form-radio-primary mb-3">
                                        <Input className="form-check-input" type="radio" name="formradiocolor1" id="formradio_after" value={"after"} onChange={(e) => setFeedTimeType(e.target.value)} defaultChecked={FeedTimeType == "after" ? true : false} />
                                        <Label className="form-check-label" for="formradio_after">
                                            After {feed_schedule}
                                        </Label>
                                    </div>
                                </Col>
                            </Row>
                        ) : ("")
                    }
                    <Row >
                        <Col xl={12}>
                            {getFieldsbyTime()}
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Mon"} className="form-check-input" type="checkbox" id="formcheck_mon" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Mon")} />
                                <Label className="form-check-label" for="formcheck_mon">
                                    Monday
                                </Label>
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Tue"} className="form-check-input" type="checkbox" id="formcheck_tue" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Tue")} />
                                <Label className="form-check-label" for="formcheck_tue">
                                    Tuesday
                                </Label>
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Wed"} className="form-check-input" type="checkbox" id="formcheck_wed" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Wed")} />
                                <Label className="form-check-label" for="formcheck_wed">
                                    Wednesday
                                </Label>
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Thu"} className="form-check-input" type="checkbox" id="formcheck_thu" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Thu")} />
                                <Label className="form-check-label" for="formcheck_thu">
                                    Thursday
                                </Label>
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Fri"} className="form-check-input" type="checkbox" id="formcheck_fri" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Fri")} />
                                <Label className="form-check-label" for="formcheck_fri">
                                    Friday
                                </Label>
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Sat"} className="form-check-input" type="checkbox" id="formcheck_sat" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Sat")} />
                                <Label className="form-check-label" for="formcheck_sat">
                                    Saturday
                                </Label>
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="form-check form-check-success mb-3">
                                <Input value={"Sun"} className="form-check-input" type="checkbox" id="formcheck_sun" onChange={(e) => setFeedDay(e.target.value, e.target.checked)} defaultChecked={feed_day.includes("Sun")} />
                                <Label className="form-check-label" for="formcheck_sun">
                                    Sunday
                                </Label>
                            </div>
                        </Col>
                    </Row>


                </ModalBody>
                <ModalFooter>

                    <div className="hstack gap-2 justify-content-center">
                        <button className="btn btn-success" disabled={!btnStatus} onClick={() => { saveInfo() }}>Save Schedule</button>
                        <button className="btn btn-danger" onClick={() => {
                            CloseModel();
                        }}>Close</button>
                    </div>
                </ModalFooter>
            </Modal>
            <div className="page-content">
                <Container fluid>
                    <Row className="mb-3 pb-1" id="topprofile">
                        <Col xs={12}>
                            <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                <div className="flex-grow-1">
                                    <h4 className="fs-16 mb-1">{deviceDetail?.title}</h4>
                                </div>
                                <div className="mt-3 mt-lg-0">
                                    <form action="#">
                                        <Row className="g-3 mb-0 align-items-center">
                                            <div className="col-auto">
                                                <p className="btn mybtn mybtn-1" ><i className="ri-map-pin-fill align-middle me-1"></i> {deviceDetail?.location}</p>
                                                <p className="btn mybtn mybtn-2" ><i className="ri-temp-hot-line align-middle me-1"></i>{KelvinToCelsius(weatherInfo?.main?.temp)}&deg;c &nbsp;&nbsp;&nbsp;<i className="ri-water-flash-fill align-middle me-1"></i>{weatherInfo?.main?.humidity}%</p>
                                            </div>
                                        </Row>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Card className="myCards">
                                <CardHeader>
                                    <h5 className="card-title mb-0">Camera1</h5>
                                </CardHeader>
                                <CardBody>
                                    {/* <img id="capture1" className={"card-img-top"} style={{ width: "100%" }} /> */}
                                    {imgShow()}
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card className="myCards">
                                <CardHeader>
                                    <h5 className="card-title mb-0">Camera2</h5>
                                </CardHeader>
                                <CardBody>
                                    {/* <img id="capture2" className={"card-img-top"} style={{ width: "100%" }} /> */}
                                    {imgShow2()}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                    <Row>
                        <Col lg={4}>

                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">Feed Level</h5>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex align-items-center justify-content-center mt-1 ">
                                        <div className="tank bg-white position-relative d-flex justify-content-center align-items-center">
                                            <div className={"feed w-100 position-absolute bottom-0 " + (tankCapacity <= 40 && tankCapacity >= 20 ? "bg-yellow" : (tankCapacity < 20 ? "bg-red" : "bg-green"))} style={{ height: tankCapacity + "%" }}></div>
                                            <p className="percent fs-1" id="percent">{tankCapacity}%</p>
                                        </div>
                                        <div className="position-absolute">
                                            <img src={tankpic} width="220px" height="270px" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={8}>
                            <Row>
                                <Col xl={4} md={4} >
                                    <Card style={{ padding: "0" }}>
                                        <CardBody>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-uppercase mb-2">Feeder Temperature</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="align-items-center">
                                                    <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                                                        <span className="counter-value align-items-center" data-target="100">{Math.floor(temp1)} &deg;c</span>
                                                    </h6>
                                                </div>
                                                <div >
                                                    {/* <Icon icon="ri:temp-hot-line" color="#a33" width="40" height="40" /> */}
                                                    <img src={temp_pic} width="40" height="40" />
                                                </div>

                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={4} md={4} >
                                    <Card style={{ padding: "0" }}>
                                        <CardBody>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-uppercase mb-2">Feeder Humidity</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="align-items-center">
                                                    <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                                                        <span className="counter-value align-items-center" data-target="100">{Math.floor(hum1)} %</span>
                                                    </h6>
                                                </div>
                                                <div >
                                                    {/* <Icon icon="ri:water-percent-fill" color="#0c94e8" width="40" height="40" /> */}
                                                    <img src={hum_pic} width="40" height="40" />
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={4} md={4} >
                                    <Card style={{ padding: "0" }}>
                                        <CardBody>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-uppercase mb-2">Battery Charging</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="align-items-center">
                                                    <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                                                        <span className="counter-value align-items-center" data-target="100">{showBatteryLevel()}</span>
                                                    </h6>
                                                </div>
                                                <div >
                                                    {/* <Icon icon="ri:battery-2-charge-fill" color="#2c2" width="40" height="40" /> */}
                                                    {
                                                        btyCur < 0 ? <img src={battery_pic} width="25" height="40" /> : <img src={battery_pic_no} width="25" height="40" />
                                                    }

                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={6} md={6} >
                                    <Card className="last-feed text-white p-md-2">
                                        <CardBody>
                                            <p style={{ fontSize: "19px", fontWeight: "500" }}>Last Feed</p>

                                            {/* <h2>11:30:00</h2> */}
                                            <h2 className={"mt-4 ff-secondary fw-semibold text-white text-center"}>
                                                <span className="counter-value text-center">
                                                    {lastTime}
                                                </span>
                                            </h2>
                                            <div style={{ width: "94%" }}>
                                                <h4 className="d-flex justify-content-end text-white" style={{ fontSize: "14px" }}>{lastDate}</h4>
                                            </div>
                                            <div className="sun-rise d-flex align-items-center justify-content-end my-2" style={{ width: "94%" }}>
                                                <br></br>
                                                <br></br>
                                                {/* <img src={HourTime > 18 ? sunrise_ico : sunset_ico} alt="Sun Rise" width="50px" /> */}
                                                {/* <h5 className="text-center text-white" style={{ fontSize: "15px" }}>{HourTime > 18 ? "Sunrise" : "Sunset"}</h5> */}
                                                {/* <h5 className="text-center text-white" style={{ fontSize: "15px" }}>&nbsp;</h5> */}
                                            </div>
                                            {/* <div className="d-flex justify-content-center">
                                                <div className="gmt text-center text-dark fw-bold rounded-2 px-3" style={{ fontSize: "13px" }}>
                                                    <p>{deviceDetail?.location} - United Arab Emirates - (GMT+4)</p>
                                                </div>
                                            </div> */}


                                        </CardBody>
                                    </Card>
                                    {/* <div className="d-flex justify-content-between">
                                                <div style={{ margin: "0 auto" }}>
                                                    <p className={"mb-2 text-white"}>Last Feed Refill Date/Time</p>
                                                    <h2 className={"mt-4 ff-secondary fw-semibold text-white text-center"}>
                                                        <span className="counter-value">
                                                            11:30:00
                                                        </span>
                                                    </h2>
                                                    <p className={"mb-0 text-white-50 text-center"}>
                                                        <span className={"mb-0 badge white"} style={{ padding: "0px" }}>
                                                            Friday, November 3, 2023
                                                        </span>
                                                    </p>
                                                </div>
                                            </div> */}
                                </Col>
                                <Col xl={6} md={6} >
                                    <Card className={"next-feed text-white p-md-2"}>

                                        <CardBody>
                                            <p style={{ fontSize: "19px", fontWeight: "500" }}>Next Feed</p>
                                            <div id="countDown" className="d-flex" key={currentFeederId}>
                                                <div className="d-flex flex-column gap-2 align-items-stretch">
                                                    <span className="countdown-item" id="days"></span>
                                                    <span className="countdown-label" id="days-label">Days</span>
                                                </div>
                                                <div className="d-flex flex-column gap-2 align-items-stretch">
                                                    <span className="countdown-item" id="hours"></span>
                                                    <span className="countdown-label" id="hours-label">Hours</span>
                                                </div>
                                                <div className="d-flex flex-column gap-2 align-items-stretch">
                                                    <span className="countdown-item" id="minutes"></span>
                                                    <span className="countdown-label" id="minutes-label">Minutes</span>
                                                </div>
                                                <div className="d-flex flex-column gap-2 align-items-stretch">
                                                    <span className="countdown-item" id="seconds"></span>
                                                    <span className="countdown-label" id="seconds-label">Seconds</span>
                                                </div>
                                            </div>
                                            {/* 


                                            <div className="d-flex justify-content-between">
                                                <div style={{ margin: "0 auto" }}>
                                                    <p className={"mb-2 text-white"}>Next Feed Refill Countdown</p>
                                                    <h2 className={"mt-4 ff-secondary fw-semibold text-white text-center"}>
                                                        <span className="counter-value">
                                                            01 : 24 : 15 : 30
                                                        </span>
                                                    </h2>

                                                </div>
                                            </div> */}
                                        </CardBody>
                                    </Card>

                                </Col>
                            </Row>

                        </Col>

                    </Row>
                    {/*  */}

                    <Row>
                        {/* <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">Feed Consumed vs Birds Count</h5>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Feed Consumed</th>
                                                    <th scope="col">No. of Birds Detected</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (birdsData && Object.keys(birdsData).length > 0) ?
                                                        (birdsData.map((val, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{moment(val.date).format("DD MMM YYYY")}</td>
                                                                    <td>{moment((val.date + " " + val.time)).format("h:mm a")}</td>
                                                                    <td>{val.foodconsumption} KG</td>
                                                                    <td>{val.birdscount}</td>
                                                                </tr>

                                                            )
                                                        })) : (<tr><td colSpan={4} align="center">No Data</td></tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col> */}
                        {/* <Col xl={4}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col xl={6}>
                                            <h4 className="mb-0 fw-bold">Total New Bird Species Found</h4>
                                        </Col>
                                        <Col xl={6}>
                                            <h5 className="card-title mb-0 float-end">
                                                <img src={bird_pic} className="img-fluid" />
                                            </h5>
                                        </Col>

                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className="row text-center">
                                        <h2 style={{ fontSize: "80px" }} className="fw-bold">14</h2>
                                        Show List
                                    </div>
                                </CardBody>
                            </Card>
                        </Col> */}
                    </Row>


                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Feed Schedule</h5>
                                        </Col>
                                        <Col lg={6} >



                                            {
                                                // Run Feed Now
                                                showLoader ?
                                                    <Button color="success" classN3ame="btn-icon m-2" style={{ float: "right" }} outline> <Spinner size="sm" color="success" className='me-2' type="grow"> Loading... </Spinner></Button>
                                                    :
                                                    <Button color="primary" className="btn-icon m-2" style={{ float: "right" }} onClick={() => ExecuteFeedNow()}> <i className="ri-refresh-line" /></Button>
                                            }
                                            {
                                                // Stop Command
                                                showstopLoader ?
                                                    <Button color="success" className="btn-icon m-2" style={{ float: "right" }} outline> <Spinner size="sm" color="success" className='me-2' type="grow"> Loading... </Spinner></Button>
                                                    :
                                                    (
                                                        feederStopStatus?.status ?
                                                            <Button color="success" className="btn-icon m-2" style={{ float: "right" }} onClick={() => UpdateScheduleStopStatus()}> <i className="ri-play-fill" /></Button>
                                                            :
                                                            <Button color="danger" className="btn-icon m-2" style={{ float: "right" }} onClick={() => UpdateScheduleStopStatus()}> <i className="ri-pause-fill" /></Button>
                                                    )

                                            }


                                            {/* Add Schedule */}
                                            <Button color="success" className="btn-icon m-2" style={{ float: "right" }} alt="Add Schedule" onClick={() => tog_backdrop()}> <i className="ri-add-fill" /></Button>




                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>

                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sr#</th>
                                                    <th scope="col">Schedule Title & Time</th>
                                                    <th scope="col">Feed Quantity</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    // Here it is
                                                    (mySchedules && Object.keys(mySchedules).length > 0) ?
                                                        (mySchedules.map((val, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>
                                                                        <Row>
                                                                            <Col xl={2}><strong>{val.feed_schedule}</strong></Col>
                                                                            <Col xl={10}>({getFullDesc(val.feed_schedule, val.feed_time, val.feed_time_type, getWeekStatus(val.feed_day))})</Col>
                                                                        </Row>
                                                                        {/* {val.feed_schedule} ({getFullDesc(val.feed_time, val.feed_time_type, getWeekStatus(val.feed_day))}) */}
                                                                    </td>
                                                                    <td>{val.quantity} KG</td>
                                                                    <td>
                                                                        <div className="form-check form-switch form-switch-sm float-right" dir="ltr">
                                                                            <Input type="checkbox" onChange={(e) => updateSchedule(val.id, e.target.checked)} defaultChecked={val.is_enabled} className="form-check-input" id="customSwitchsizelg" />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <Icon icon="ri:edit-fill" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => {
                                                                            tog_backdrop();
                                                                            updateFields(val.id, val);

                                                                        }} />
                                                                        &nbsp;
                                                                        &nbsp;
                                                                        <Icon icon="ri:delete-bin-5-line" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => deleteSchedule(val.id)} />

                                                                    </td>
                                                                </tr>

                                                            )
                                                        })) : (<tr><td colSpan={5} align="center">No Data</td></tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>
                    {/* <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Feed Consumption</h4>
                                </CardHeader>
                                <CardBody>
                                    <DashedLine dataColors='["--vz-primary", "--vz-danger", "--vz-success"]' />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}
                    {/* <Row>

                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Feed Consumption</h5>
                                        </Col>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0 float-end">
                                                <ButtonGroup>
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle tag="button" className="btn btn-light">
                                                            Filter <i className="mdi mdi-chevron-down"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem>Today</DropdownItem>
                                                            <DropdownItem>Last Week</DropdownItem>
                                                            <DropdownItem>Last Month</DropdownItem>
                                                            <DropdownItem>Current Year</DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </ButtonGroup>
                                            </h5>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <BasicColumn dataColors='["--vz-primary", "--vz-success", "--vz-danger"]' myChartData={feedConsumptionData || []} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={4}>
                                            <h5 className="card-title mb-0">Feed Consumption</h5>
                                        </Col>
                                        <Col lg={8} style={{ float: "right" }}>

                                            <Row onLoad={setUpDefaultDateRange}>
                                                <Col xl={6}>
                                                    <div className="input-group">
                                                        <Flatpickr
                                                            className="form-control dash-filter-picker"

                                                            options={{
                                                                mode: "range",
                                                                dateFormat: "Y-m-d",
                                                                defaultDate: [moment().subtract("7", "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
                                                            }}
                                                            onChange={(selectedDates) => {
                                                                setDateRangeNew(selectedDates);
                                                            }}
                                                        />
                                                        <div className="input-group-text bg-dark border-dark text-white"><i className="ri-calendar-2-line"></i></div>
                                                    </div>
                                                </Col>
                                                <Col xl={4}>
                                                    <div className="input-group">
                                                        <select className="form-select" onChange={(e) => {
                                                            setFilterType(e.target.value)
                                                        }}>
                                                            {/* <option value={"0"}>Reset</option> */}
                                                            <option value={"Daily"}>Days</option>
                                                            <option value={"Weekly"}>Weekly</option>
                                                            <option value={"Monthly"}>Monthly</option>
                                                            <option value={"Yearly"}>Yearly</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                <Col xl={2}>
                                                    {
                                                        myGraphLoader ?
                                                            <Spinner size="sm" color="light"></Spinner>
                                                            :
                                                            <Button color="primary" className="btn-icon" onClick={() => getFeedConsumptionData()}> <i className="ri-filter-line" /></Button>
                                                    }
                                                </Col>

                                            </Row>

                                        </Col>
                                    </Row>
                                    {/* <h4 className="card-title mb-0">Feed Consumption</h4> */}
                                </CardHeader>
                                <CardBody>
                                    {/* {JSON.stringify(dateRangeNew)} */}
                                    <LinewithDataLabelsSecond dataColors='["#020202"]' myChartData={feedConsumptionData || []} FilterType={FilterType} showDataLabels={showDataLabels} />
                                    <Row>
                                        <Col xl={6}>
                                            <div className="form-check form-switch form-switch-sm float-start" dir="ltr">
                                                <label htmlFor={"show_datalabels"}>Show Labels</label>
                                                <Input type="checkbox" onChange={(e) => updateGraphLabels(e.target.checked)} defaultChecked={showDataLabels} className="form-check-input" id="show_datalabels" />
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div className="form-check form-switch form-switch-sm float-start" dir="ltr">
                                                <strong>Total Feed Consumed: {(feedConsumptionData?.max * 2)} Kgs</strong>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={4}>
                                            <h5 className="card-title mb-0">Average Birds Count</h5>
                                        </Col>
                                        <Col lg={8} style={{ float: "right" }}>

                                            <Row onLoad={setUpDefaultDateRange}>
                                                <Col xl={6}>
                                                    <div className="input-group">
                                                        <Flatpickr
                                                            className="form-control"
                                                            options={{
                                                                dateFormat: "Y-m-d",
                                                                defaultDate: dateRangeBirdsNew ? [dateRangeBirdsNew] : [moment().format("YYYY-MM-DD")]
                                                            }}
                                                            onChange={(selectedDates) => {
                                                                setDateRangeBirdsNew(selectedDates);
                                                            }}
                                                        />
                                                        <div className="input-group-text bg-dark border-dark text-white"><i className="ri-calendar-2-line"></i></div>
                                                    </div>
                                                </Col>
                                                <Col xl={4}>
                                                    <div className="input-group">
                                                        <select className="form-select" onChange={(e) => {
                                                            setFilterTypeBirdsNew(e.target.value)
                                                        }}>
                                                            {/* <option value={"0"}>Reset</option> */}
                                                            <option value={"Daily"}>Days</option>
                                                            <option value={"Weekly"}>Weekly</option>
                                                            <option value={"Monthly"}>Monthly</option>
                                                            <option value={"Yearly"}>Yearly</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                <Col xl={2}>
                                                    {
                                                        myGraphLoader ? <Spinner size="lg" color="light"></Spinner> :
                                                            <Button color="primary" className="btn-icon" onClick={() => getBirdsDataForGraph()}> <i className="ri-filter-line" /></Button>
                                                    }
                                                </Col>

                                            </Row>

                                        </Col>
                                    </Row>
                                    {/* <h4 className="card-title mb-0">Feed Consumption</h4> */}
                                </CardHeader>
                                <CardBody>
                                    <ImagesChart dataColors='["--vz-primary", "--vz-success", "--vz-warning"]' BirdsDataForGraph={BirdsDataForGraph} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col xl={12} style={{ marginBottom: "20px" }}>

                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Birds Found</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Image</th>
                                                    <th scope="col">Bird Name</th>
                                                    <th scope="col">Size (cm)</th>
                                                    <th scope="col">Found Location</th>
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

                                                    <td>Thrush Bird</td>
                                                    <td>18-25</td>
                                                    <td>Dubai</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Thrush Bird</td>
                                                    <td>18-25</td>
                                                    <td>Dubai</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Thrush Bird</td>
                                                    <td>18-25</td>
                                                    <td>Dubai</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img src={avtarImage6} alt="" className="avatar-xs rounded-circle" />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>Thrush Bird</td>
                                                    <td>18-25</td>
                                                    <td>Dubai</td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}


                    {/*  */}
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
                    {/* <Row>
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
                    </Row> */}
                    {/* <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Feed Consumed by this Feeder</h5>
                                        </Col>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0 float-end">1 Day Stats.</h5>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Schedule Title</th>
                                                    <th scope="col">Feed Quantity</th>
                                                    <th scope="col">Feed Time</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (mySchedules && Object.keys(mySchedules).length > 0) ?
                                                        (mySchedules.map((val, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{val.feed_schedule}</td>
                                                                    <td>{val.quantity} KG</td>
                                                                    <td>{val.feed_time} on {val.feed_day}</td>
                                                                    <td>
                                                                        <div className="float-right" dir="ltr">
                                                                            <Progress color={i == 0 ? "warning" : (i == 2 ? "danger" : "success")} value={i == 0 ? "75" : (i == 2 ? "50" : "25")} />

                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                            )
                                                        })) : ('No Schedules')
                                                }
                                            </tbody>
                                        </Table>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>

                    </Row> */}
                </Container>
            </div >
        </React.Fragment >
    );
};

export default FeedProfile