import {
  Col,
  Row,
  Button,
  Spinner,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  executeFeedNowApi,
  updateScheduleStopStatusApi,
} from "../../../../services/feedProfile.services";

export const SchedulGlobalActions = ({
  getFeederStopStatus,
  feederStopStatus,
  currentFeederId,
  schedulesLimit: { isReachLimit, limit, count },
  setShowLoader,
  tog_backdrop,
  showLoader,
  userId,
  schedulesActive,
  setSchedulesActive,
  handleSchedulePerformed,
  schedulesPerformed,
  setSchedulesPerformed,
}) => {
  const [showstopLoader, setShowstopLoader] = useState(false);
  const [feedNowQuantity, setFeedNowQuantity] = useState(10);

  // console.log("Handle Schedule Performed: " + handleSchedulePerformed);
  // console.log("Schedules Performed" + schedulesPerformed);
  useEffect(() => {
    getFeederStopStatus();
  }, [currentFeederId]);

  const executeFeedNow = () => {
    if (isNaN(feedNowQuantity)) return;
    setShowLoader(true);
    setSchedulesPerformed(schedulesPerformed + 1);
    executeFeedNowApi(userId, currentFeederId, { quantity: feedNowQuantity })
      .then((res) => {
        toast("Feed Command Executed, waiting for feed response now", {
          className: "bg-success text-white",
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
        });
        setShowLoader(false);
      })
      .catch((err) => {
        setShowLoader(false);
      });
  };

  const UpdateScheduleStopStatus = () => {
    setShowstopLoader(true);
    let is_started = feederStopStatus.status;
    updateScheduleStopStatusApi(userId, currentFeederId, {
      is_started: is_started,
    })
      .then((res) => {
        toast("Motor stop setting updated successfully", {
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
          className: "bg-success text-white",
        });
        getFeederStopStatus();
        setShowstopLoader(false);
      })
      .catch((err) => {
        setShowstopLoader(false);
      });
  };

  const toggleSchedulesActive = () => {
    UpdateScheduleStopStatus();
    setSchedulesActive((prevState) => !prevState);
  };

  return (
    <Row>
      <Col lg={9} style={{ display: "flex", alignItems: "center" }}>
        <h5 className="card-title mb-0">Feed Schedule</h5>
        <h3
          className={`card-title mb-0 ${isReachLimit() ? "color-danger" : ""}`}
          style={{ marginInlineStart: "20px" }}
        >
          ({count} / {limit}) schedule{count === 1 ? "" : "s"}
        </h3>
      </Col>
      <Col lg={3} style={{ display: "flex", justifyContent: "end" }}>
        <Button
          color="success"
          alt="Add Schedule"
          className="btn-icon m-2"
          disabled={isReachLimit()}
          style={{ flexShrink: 0 }}
          onClick={() => !isReachLimit() && tog_backdrop()}
        >
          <i className="ri-add-fill" />
        </Button>

        <Button
          className="btn-icon m-2"
          style={{ flexShrink: 0 }}
          onClick={toggleSchedulesActive}
          color={schedulesActive ? "danger" : "success"}
        >
          {showstopLoader ? (
            <Spinner size="sm" color="success" className="me-2" type="grow">
              {" "}
              Loading...{" "}
            </Spinner>
          ) : (
            <i className={`ri-${schedulesActive ? "pause" : "play"}-fill`} />
          )}
        </Button>

        <InputGroup style={{ margin: "0.5rem 0 0.5rem 0.5rem", width: "36%" }}>
          <Button
            disabled={typeof feedNowQuantity !== "number"}
            color={showLoader ? "success" : "primary"}
            onClick={() => !showLoader && executeFeedNow()}
          >
            {showLoader ? (
              <Spinner size="sm" color="success" className="me-2" type="grow">
                {" "}
                Loading...{" "}
              </Spinner>
            ) : (
              <i className="ri-refresh-line" />
            )}
          </Button>
          <Input
            max={50}
            min={10}
            type="number"
            value={feedNowQuantity}
            placeholder="default quantity 10"
            onChange={({ target: { value } }) => setFeedNowQuantity(+value)}
          />
          <InputGroupText>Kg</InputGroupText>
        </InputGroup>
      </Col>
    </Row>
  );
};
