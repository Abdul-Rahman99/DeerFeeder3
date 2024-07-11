import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment/moment";

import {
  getSensorDataApi,
  getFeedsTimingsApi,
} from "../../../../services/feedProfile.services";

export const useFeeder = ({
  currentFeederId,
  showLoader,
  setShowLoader,
  schedulesPerformed,
  setSchedulesPerformed,
}) => {
  const [tankCapacity, setTankCapacity] = useState();
  const [StrTimings, setStrTimings] = useState();
  const [lastTime, setLastTime] = useState();
  const [lastDate, setLastDate] = useState();

  const [feederData, setFeederData] = useState({
    solarVolt: 0,
    solarCur: 0,
    motorCur: 0,
    pingDist: 0,
    btyVolt: 0,
    btyCur: 0,
    irDist: 0,
    vlDist: 0,
    temp1: 0,
    temp2: 0,
    hum1: 0,
    hum2: 0,
  });

  const getFeedsTimings = useCallback(() => {
    getFeedsTimingsApi(currentFeederId).then((result) => {
      let myData = result.data;
      let newStrTimings = result.StrTimings;
      setStrTimings(newStrTimings);
      try {
        configureFeedTimings(JSON.parse(myData?.client_message), newStrTimings);
      } catch (e) {
        console.log(e);
      }
    });
  }, [currentFeederId]);

  const getSensorData = useCallback(() => {
    getSensorDataApi(currentFeederId).then((result) => {
      try {
        updateSensorData(JSON.parse(result?.data.client_message));
      } catch (e) {
        console.log(e);
      }
    });
  }, [currentFeederId]);

  const configureFeedTimings = useCallback(
    (CmData, StrTimings) => {
      // Here Feed Done
      if (showLoader) {
        setShowLoader(false);
        toast("Feed Done Successfully", {
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
          className: "bg-success text-white",
        });
        setSchedulesPerformed(
          (prevSchedulesPerformed) => prevSchedulesPerformed + 1
        );
      }
      var dateString = moment
        .unix(CmData[65])
        .utcOffset("+0000")
        .format("dddd, MMMM D, YYYY, H:mm:ss");
      var formattedDateString = moment(dateString).format("dddd, MMMM D, YYYY");
      var formattedTimeString = moment(dateString).format("H:mm:ss");

      setLastDate(formattedDateString);
      setLastTime(formattedTimeString);
    },
    [currentFeederId]
  );

  const getTankCapacity = (ping_dist) => {
    // sensors needs some modifications "Abdelrahman"
    // console.log(ping_dist);
     let ping_dist_p = (130 - ping_dist) / (1 * 1.3);
    // console.log(ping_dist_p);
     let truncated_ping_dist_p = ping_dist_p.toFixed(0).toString().slice(0, 2);
    // console.log(truncated_ping_dist_p);
     if (ping_dist_p <= 0 || ping_dist_p === 255) {
       setTankCapacity(0);
       return;
     }
    // else
    //  if (ping_dist_p < 255 && ping_dist_p > 0) {
    //    if (ping_dist_p >= 64) {
    //      setTankCapacity(0);
    //    } else if (ping_dist_p >= 55) {
    //      setTankCapacity(20);
    //    } else if (ping_dist_p >= 44) {
    //      setTankCapacity(40);
    //    } else if (ping_dist_p >= 35) {
    //      setTankCapacity(60);
    //    } else if (ping_dist_p >= 20) {
    //      setTankCapacity(80);
    //    } else {
    //      setTankCapacity(100);
    //    }
    // }
    // console.log(ping_dist);
    //if (ping_dist >= 64) {
      //setTankCapacity(0);
    //} else if (ping_dist >= 55) {
      //setTankCapacity(20);
    //} else if (ping_dist >= 44) {
      //setTankCapacity(40);
    //} else if (ping_dist >= 35) {
      //setTankCapacity(60);
    //} else if (ping_dist >= 20) {
      //setTankCapacity(80);
    //} else {
      //setTankCapacity(100);
    //}
  };

  const updateSensorData = (message) => {
    getTankCapacity(message["5"]);

    setFeederData({
      solarVolt: message["9"],
      solarCur: message["12"],
      motorCur: message["13"],
      pingDist: message["5"],
      btyVolt: message["8"],
      btyCur: message["10"],
      irDist: message["6"],
      vlDist: message["7"],
      temp1: message["1"],
      temp2: message["3"],
      hum1: message["2"],
      hum2: message["4"],
    });
  };

  const handleFeederUpdate = (feeder_id, topic, message) => {
    if (currentFeederId == feeder_id) {
      if (topic == "sensorstatus") {
        updateSensorData(message);
      } else if (topic == "sensorworking") {
        // action here
      } else if (topic == "feedingdone") {
        console.log({ message });
        toast("Feed Done Successfully", {
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
          className: "bg-success text-white",
        });
        configureFeedTimings(message, StrTimings);
        setSchedulesPerformed(
          (prevSchedulesPerformed) => prevSchedulesPerformed + 1
        );
      }
    }
  };

  return {
    handleFeederUpdate,
    getFeedsTimings,
    getSensorData,
    tankCapacity,
    feederData,
    lastDate,
    lastTime,
  };
};
