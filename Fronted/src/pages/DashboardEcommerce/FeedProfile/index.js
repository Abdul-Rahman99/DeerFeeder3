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

import "../../../assets/scss/timer.css";
import "../../../assets/scss/tank.css";
import { api } from "../../../services/api";

const FeedProfile = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const { userId, currentFeederId } = useFeedProfileMainInfo();

  const [tankCapacity, setTankCapacity] = useState(800);
  const [feedPerSecond] = useState(0.4); // 0.4 kg per second, 0.8 kg for 2 seconds
  const [schedulesPerformed, setSchedulesPerformed] = useState(0);
  const [feedLevel, setFeedLevel] = useState(100);
  const [feedUsed, setFeedUsed] = useState(0);

  const { camPic, camPic2, updateCameras } = useCameras(currentFeederId);
  const { weatherInfo, deviceDetail, getDeviceDetails } =
    useEnvInfo(currentFeederId);

  const [schedulesActive, setSchedulesActive] = useState(false);

  const handleSchedulePerformed = (schedulesPerformed) => {
    setSchedulesPerformed(schedulesPerformed + 1);
  };

  const handleRefill = () => {
    setFeedLevel(100);
    setSchedulesPerformed(0);
  };

  useEffect(() => {
    const fetchFeedLevelData = async () => {
      try {
        const response = await api.get("getFeedLevelData");
        const feedLevelData = response.data.all.find(
          (item) => item.id === currentFeederId
        );
        // console.log(feedLevelData);
        if (feedLevelData) {
          setTankCapacity(800);
          // setSchedulesPerformed(0);
          setFeedLevel(feedLevelData.tankLevel);
          setFeedUsed((feedLevelData.tankLevel * 800) / 100);
        }
      } catch (error) {
        console.error("Error fetching feed level data:", error);
      }
    };
    fetchFeedLevelData();
  }, [currentFeederId]);

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
        <TankControl
          tankCapacity={tankCapacity}
          setTankCapacity={setTankCapacity}
          feedPerSecond={feedPerSecond}
          handleRefill={handleRefill}
          feedLevel={feedLevel}
          handleSchedulePerformed={handleSchedulePerformed}
          feedUsed={feedUsed}
          currentFeederId={currentFeederId}
        />
        <FeedInfo
          lastTime={lastTime}
          lastDate={lastDate}
          isExpired={isExpired}
          feederData={feederData}
          tankCapacity={tankCapacity}
          currentFeederId={currentFeederId}
          feedPerSecond={feedPerSecond}
          schedulesActive={schedulesActive}
          handleSchedulePerformed={handleSchedulePerformed}
          feedLevel={feedLevel}
          setSchedulesPerformed={setSchedulesPerformed}
          schedulesPerformed={schedulesPerformed}
        />
        <ScheduleFeed
          userId={userId}
          showLoader={showLoader}
          setIsExpired={setIsExpired}
          setShowLoader={setShowLoader}
          currentFeederId={currentFeederId}
          setSchedulesPerformed={setSchedulesPerformed}
          schedulesPerformed={schedulesPerformed}
        />
        <Charts currentFeederId={currentFeederId} />
        <Row>
          <SensorStatus {...feederData} />
        </Row>
      </Container>
    </div>
  );
};

export default FeedProfile;
