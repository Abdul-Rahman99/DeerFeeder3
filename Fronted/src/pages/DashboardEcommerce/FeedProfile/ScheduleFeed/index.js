import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import React, { useState } from "react";

import { SchedulGlobalActions } from "./SchedulGlobalActions";
import { useScheduleFeed } from "./hooks/useScheduleFeed";
import { SchedulsTable } from "./SchedulsTable";
import { ScheduleModal } from "./ScheduleModal";

export const ScheduleFeed = ({
  currentFeederId,
  setShowLoader,
  setIsExpired,
  showLoader,
  userId,
  handleSchedulePerformed,
  setSchedulesPerformed,
  schedulesPerformed
}) => {
  const {
    mySchedules,
    scheduleData,
    getSchedules,
    tog_backdrop,
    schedulesLimit,
    modal_backdrop,
    scheduledRowInd,
    setScheduleData,
    setScheduleArray,
    setmodal_backdrop,
    resetFeedTimerHTML,
    resetScheduleTimer,
    feederStopStatus,
    getFeederStopStatus,
  } = useScheduleFeed({ currentFeederId, setIsExpired });

  const [schedulesActive, setSchedulesActive] = useState(true);

  return (
    <React.Fragment>
      <ScheduleModal
        resetScheduleTimer={resetScheduleTimer}
        setmodal_backdrop={setmodal_backdrop}
        setScheduleArray={setScheduleArray}
        currentFeederId={currentFeederId}
        setScheduleData={setScheduleData}
        modal_backdrop={modal_backdrop}
        schedulesLimit={schedulesLimit}
        scheduleData={scheduleData}
        getSchedules={getSchedules}
        userId={userId}
      />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <SchedulGlobalActions
                getFeederStopStatus={getFeederStopStatus}
                feederStopStatus={feederStopStatus}
                currentFeederId={currentFeederId}
                schedulesLimit={schedulesLimit}
                setShowLoader={setShowLoader}
                tog_backdrop={tog_backdrop}
                showLoader={showLoader}
                userId={userId}
                schedulesActive={schedulesActive}
                setSchedulesActive={setSchedulesActive}
                mySchedules={mySchedules}
                setSchedulesPerformed={setSchedulesPerformed}
                schedulesPerformed={schedulesPerformed}
              />
            </CardHeader>
            <CardBody>
              <SchedulsTable
                userId={userId}
                mySchedules={mySchedules}
                tog_backdrop={tog_backdrop}
                getSchedules={getSchedules}
                schedulesLimit={schedulesLimit}
                scheduledRowInd={scheduledRowInd}
                setScheduleData={setScheduleData}
                currentFeederId={currentFeederId}
                setScheduleArray={setScheduleArray}
                stopStatus={!!feederStopStatus?.status}
                resetFeedTimerHTML={resetFeedTimerHTML}
                resetScheduleTimer={resetScheduleTimer}
                schedulesActive={schedulesActive}
                setSchedulesActive={setSchedulesActive}
                handleSchedulePerformed={handleSchedulePerformed}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ScheduleFeed;
