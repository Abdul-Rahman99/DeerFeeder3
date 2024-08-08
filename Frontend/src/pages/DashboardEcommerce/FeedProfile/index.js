import { Container, Row } from "reactstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  useFeeder,
  useSocket,
  useEnvInfo,
  useCameras,
  useFeedProfileMainInfo,
} from "./hooks";
import { Charts } from "./Charts";
import { EnvInfo } from "./EnvInfo";
import { Cameras } from "./Cameras";
import { FeedInfo } from "./FeedInfo";
import SensorStatus from "../SensorStatus";
import { ScheduleFeed } from "./ScheduleFeed";
import TankControl from "./TankControl";
import { SchedulsTable } from "./ScheduleFeed/SchedulsTable";

import PermissionGuard from "../../../Components/Common/PermissionGuard";

import "../../../assets/scss/timer.css";
import "../../../assets/scss/tank.css";
import { api } from "../../../services/api";
import { updateScheduleStopStatusApi } from "../../../services/feedProfile.services";
import { toast } from "react-toastify";

const FeedProfile = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const { userId, currentFeederId } = useFeedProfileMainInfo();

  const [tankCapacity, setTankCapacity] = useState(800);
  const [feedPerSecond] = useState(0.4); // 0.4 kg per second, 0.8 kg for 2 seconds
  const [schedulesPerformed, setSchedulesPerformed] = useState(0);
  const [feedLevel, setFeedLevel] = useState(100);
  const [tankLevel2, setFeedLevel2] = useState(0);

  
  const [feedUsed, setFeedUsed] = useState(0);

  const [Tray1, setTray1] = useState(0);
  const [Tray2, setTray2] = useState(0);
  const [Tray3, setTray3] = useState(0);
  const [Tray4, setTray4] = useState(0);
  const [hasCapacity, setHasCapacity] = useState(0);
  const [hasTray, setHasTray] = useState(0);



  const [feederId, setFeederId] = useState("");

  const { camPic, camPic2, updateCameras } = useCameras(currentFeederId);
  const { weatherInfo, deviceDetail, getDeviceDetails } =
    useEnvInfo(currentFeederId);

  const [schedulesActive, setSchedulesActive] = useState('n');

  const handleSchedulePerformed = (schedulesPerformed) => {
    setSchedulesPerformed(schedulesPerformed + 1);
  };
  // console.log("HEEEEE " + schedulesActive);  
  useEffect(() => {
    const fetchFeedLevelData = async () => {
      try {
        const response = await api.get("getFeedLevelWtData");
        const feedLevelData = response.data.all.find(
          (item) => item.id === currentFeederId
        );
        if (feedLevelData) {
          setTankCapacity(800);
          setFeedLevel(feedLevelData.tankLevel ?? 0);
          setFeedLevel2(feedLevelData.tankLevel2 < 0 ? 0 : Number(feedLevelData.tankLevel2.toFixed(1)) ?? 0);

          setTray1(feedLevelData.Tray1  < 0 ? 0 : Number(feedLevelData.Tray1).toFixed(1) ?? 0);
          setTray2(feedLevelData.Tray2  < 0 ? 0 : Number(feedLevelData.Tray2).toFixed(1) ?? 0);
          setTray3(feedLevelData.Tray3  < 0 ? 0 : Number(feedLevelData.Tray3).toFixed(1) ?? 0);
          setTray4(feedLevelData.Tray4  < 0 ? 0 : Number(feedLevelData.Tray4).toFixed(1) ?? 0);
          setHasCapacity(feedLevelData.has_capacity);
          setHasTray(feedLevelData.has_tray);
          setFeedUsed((feedLevelData.tankLevel * 800) / 100);
          setFeederId(feedLevelData.id);
        }
      } catch (error) {
        console.error("Error fetching feed level data:", error);
      }
    };
    fetchFeedLevelData();
    const interval = setInterval(fetchFeedLevelData, 210000);

    return () => clearInterval(interval);   
  }, [currentFeederId]);
  useEffect(() => {
    if (!schedulesActive) {
      updateScheduleStopStatusApi(userId, currentFeederId, {
        is_started: schedulesActive,
      })
        .then((res) => {
          toast("Motor stop setting updated successfully", {
            position: "top-right",
            hideProgressBar: true,
            closeOnClick: false,
            className: "bg-success text-white",
          });
          //  setShowstopLoader(false);
        })
        .catch((err) => {
          //  setShowstopLoader(false);
        });
    }
  }, [schedulesActive, userId, currentFeederId]);

  const handleRefill = async (currentFeederId) => {
    try {
      const currentFeederId = feederId;
      const response = await api.post(`/refill-tank/${currentFeederId}`);

      // const data = await response.json();
      if (response.ok) {
        alert("Tank refilled successfully");
      } else {
        // alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error("Error refilling tank:", error);
      alert("An error occurred while refilling the tank. Please try again.");
    }
  };
  const {
    handleFeederUpdate,
    getFeedsTimings,
    getSensorData,
    feederData,
    lastDate,
    lastTime,
  } = useFeeder({
    currentFeederId,
    setShowLoader,
    showLoader,
    tankCapacity,
    schedulesPerformed,
    setSchedulesPerformed,
  });

  useSocket({
    updateCameras,
    getSensorData,
    getFeedsTimings,
    getDeviceDetails,
    handleFeederUpdate,
  });

  return (
    <div className="page-content">
      <Container fluid>
        <EnvInfo weatherInfo={weatherInfo} deviceDetail={deviceDetail} />
        <Cameras camPic={camPic} camPic2={camPic2} />

        
        <FeedInfo
          lastTime={lastTime}
          lastDate={lastDate}
          isExpired={isExpired}
          feederData={feederData}
          tankCapacity={tankCapacity}
          currentFeederId={currentFeederId}
          feedPerSecond={feedPerSecond}
          handleSchedulePerformed={handleSchedulePerformed}
          feedLevel={feedLevel}
          has_capacity={hasCapacity}
          tray1={Tray1}
          tray2={Tray2}
          tray3={Tray3}
          tray4={Tray4}
          hasTray={hasTray}
          tankLevel2={tankLevel2}
          setSchedulesPerformed={setSchedulesPerformed}
          schedulesPerformed={schedulesPerformed}
        />
        <PermissionGuard permissionName={"/view-birds"}>
          <ScheduleFeed
            userId={userId}
            showLoader={showLoader}
            setIsExpired={setIsExpired}
            setShowLoader={setShowLoader}
            currentFeederId={currentFeederId}
            setSchedulesPerformed={setSchedulesPerformed}
            schedulesPerformed={schedulesPerformed}
            schedulesActive={schedulesActive}
            ongetSchedule={(val) => {
              setSchedulesActive(val);
            }}
          />
        </PermissionGuard>
        
        <Charts currentFeederId={currentFeederId} />
        <TankControl
          tankCapacity={tankCapacity}
          setTankCapacity={setTankCapacity}
          feedPerSecond={feedPerSecond}
          handleRefill={handleRefill}
          feedLevel={feedLevel}
          handleSchedulePerformed={handleSchedulePerformed}
          feedUsed={feedUsed}
          tray1={Tray1}
          tray2={Tray2}
          tray3={Tray3}
          tray4={Tray4}
          hasTray={hasTray}
          tankLevel2={tankLevel2}
          hasCapacity={hasCapacity}

          currentFeederId={currentFeederId}
        />
        <Row>
          <SensorStatus {...feederData} />
        </Row>
      </Container>
    </div>
  );
};

export default FeedProfile;
