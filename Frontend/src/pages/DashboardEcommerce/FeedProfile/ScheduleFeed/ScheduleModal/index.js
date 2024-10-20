import React, { useState } from "react";
import {
  Col,
  Row,
  Card,
  Label,
  Input,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { weekdays } from "moment/moment";

import { Series } from "../../../../../Components/Common/Series";
import { FieldsbyTime } from "./FieldsbyTime";
import { HoursMinutesDDL } from "./HoursMinutesDDL";
import { useScheduleModal } from "./hooks/useScheduleModal";

export const ScheduleModal = (props) => {
  const {
    title,
    quantity,
    saveInfo,
    feed_day,
    btnStatus,
    feed_time,
    setFeedDay,
    CloseModel,
    handleClick,
    setTimeHours,
    tog_backdrop,
    feedTimeType,
    execFeedTime,
    dayTimesData,
    setTimeMinute,
    feed_schedule,
    validateField,
    modal_backdrop,
    updateFeedTime,
    setHoursMinutesList,
    updateScheduleField,
  } = useScheduleModal(props);

  // State for managing validation errors
  const [timeError, setTimeError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [feedDayError, setFeedDayError] = useState("");

  // Function to validate time input
  const validateTime = (time) => {
    const times = time.split(",");
    for (let t of times) {
      t = t.trim();
      const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeFormat.test(t)) {
        return "Each time must be in HH:MM format and within 00:00 to 23:59.";
      }
    }
    return "";
  };

  // Function to validate title input
  const validateTitle = (title) => {
    if (!title) {
      return "Title is required.";
    }
    return "";
  };

  // Function to validate quantity input
  const validateQuantity = (quantity) => {
    if (!quantity) {
      return "Quantity is required.";
    }
    if (isNaN(quantity)) {
      return "Quantity must be a number.";
    }
    if (quantity <= 0) {
      return "Quantity must be greater than zero.";
    }
    return "";
  };

  // Function to validate feed day input
  const validateFeedDay = (feed_day) => {
    if (feed_day.length === 0) {
      return "At least one feed day must be selected.";
    }
    return "";
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const error = validateTime(newTime);
    setTimeError(error);
    if (!error) {
      updateScheduleField("feed_time", newTime);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const error = validateTitle(newTitle);
    setTitleError(error);
    if (!error) {
      updateScheduleField("title", newTitle);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    const error = validateQuantity(newQuantity);
    setQuantityError(error);
    if (!error) {
      updateScheduleField("quantity", newQuantity);
    }
  };

  const handleFeedDayChange = (e) => {
    const newFeedDay = e.target.value;
    const error = validateFeedDay(newFeedDay);
    setFeedDayError(error);
    if (!error) {
      setFeedDay(newFeedDay);
    }
  };

  const handleSaveInfo = () => {
    const timeError = validateTime(feed_time);
    const titleError = validateTitle(title);
    const quantityError = validateQuantity(quantity);
    const feedDayError = validateFeedDay(feed_day);

    setTimeError(timeError);
    setTitleError(titleError);
    setQuantityError(quantityError);
    setFeedDayError(feedDayError);

    if (!timeError && !titleError && !quantityError && !feedDayError) {
      saveInfo();
    }
  };

  return (
    <Modal
      isOpen={modal_backdrop}
      toggle={tog_backdrop}
      backdrop={"static"}
      id="staticBackdrop"
      centered
      onLoad={() => {
        validateField();
        handleClick(feed_schedule);
      }}
    >
      <ModalHeader
        className="modal-title"
        id="staticBackdropLabel"
        toggle={CloseModel}
      >
        Feed Schedule
      </ModalHeader>
      <ModalBody className="p-3">
        <Row>
          <span id="errorbox" style={{ color: "#c44", fontSize: "8px" }}></span>
        </Row>
        <Row className="mt-2">
          <Col xl={6}>
            <label>Title:</label>
            <input
              id="title"
              type="text"
              name="title"
              value={title}
              className="form-control"
              placeholder="Set Schedule Name"
              onChange={handleTitleChange}
            />
            {titleError && (
              <span id="title-error" style={{ color: "#c44", fontSize: "8px" }}>
                {titleError}
              </span>
            )}
          </Col>
          <Col xl={6}>
            <label>Quantity:</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={quantity}
              className="form-control"
              placeholder="Set Food Quantity"
              onChange={handleQuantityChange}
            />
            {quantityError && (
              <span
                id="quantity-error"
                style={{ color: "#c44", fontSize: "8px" }}
              >
                {quantityError}
              </span>
            )}
          </Col>
        </Row>
        <Row className="mt-2">
          {dayTimesData.map(({ name, imgTime, imgTimeC }) => (
            <Col key={name} lg={4}>
              <Card>
                <input
                  type="radio"
                  id={name}
                  name="day_time"
                  value={name}
                  className="radio-input"
                  onChange={(e) => {
                    /** action here */
                  }}
                />
                <label
                  htmlFor={name}
                  className="radio-label"
                  id={`${name}_click`}
                  onClick={() => handleClick(name)}
                >
                  <img
                    src={imgTime}
                    style={{ width: "80px", height: "70px", margin: "0 auto" }}
                    alt={name}
                  />
                  <img
                    src={imgTimeC}
                    alt={name}
                    style={{
                      display: "none",
                      width: "80px",
                      height: "70px",
                      margin: "0 auto",
                    }}
                  />
                </label>
                <h7 className="text-center">{name}</h7>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          {feed_schedule &&
            feed_schedule != "FixedTime" &&
            ["before", "after"].map((duration) => (
              <Col key={duration} xl={6}>
                <div className="form-check form-radio-primary mb-3">
                  <Input
                    type="radio"
                    value={duration}
                    name="formradiocolor1"
                    id={`formradio_${duration}`}
                    className="form-check-input"
                    defaultChecked={feedTimeType === duration}
                    onChange={(e) =>
                      updateScheduleField("feedTimeType", e.target.value)
                    }
                  />
                  <Label
                    className="form-check-label"
                    for={`formradio_${duration}`}
                  >
                    {duration.charAt(0).toUpperCase() + duration.slice(1)}{" "}
                    {feed_schedule}
                  </Label>
                </div>
              </Col>
            ))}
        </Row>
        <Row>
          <Col xl={12}>
            <FieldsbyTime
              feedTimeType={feedTimeType}
              feed_schedule={feed_schedule}
              TimesDropDown={
                <select
                  onChange={(e) => {
                    validateField();
                    updateScheduleField("feed_time", e.target.value);
                  }}
                  className="form-select rounded-pill"
                  value={feed_time}
                  id="feed_time"
                >
                  <option value={""}>Please Select</option>
                  <Series
                    data={[1, 15, 30, 45, 60, 120, 180, 240, 300]}
                    component={(val) => {
                      const displayed =
                        val >= 60
                          ? { val: val / 60, typ: "hour" }
                          : { val, typ: "minute" };

                      const singleOrPloral = displayed.val == 1 ? "" : "s";

                      return (
                        <option value={val}>
                          {feedTimeType} {displayed.val}{" "}
                          {displayed.typ + singleOrPloral}
                        </option>
                      );
                    }}
                  />
                </select>
              }
              FixedTime={
                <div>
                  <Row style={{ marginBottom: "1.3rem" }}>
                    {[0, 1].map((value) => (
                      <Col key={value} xl={4}>
                        <HoursMinutesDDL
                          type={value}
                          setTimeHours={setTimeHours}
                          setTimeMinute={setTimeMinute}
                        />
                      </Col>
                    ))}
                    <Col
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        color="primary"
                        className="btn-icon rounded-pill"
                        onClick={() => {
                          updateFeedTime();
                          validateField();
                        }}
                      >
                        {" "}
                        <i className="ri-add-fill" />
                      </Button>
                      <Button
                        color="danger"
                        className="btn-icon rounded-pill"
                        onClick={() => setHoursMinutesList([])}
                      >
                        {" "}
                        <i className=" ri-delete-back-2-fill" />
                      </Button>
                      <Button
                        color="success"
                        className="btn-icon rounded-pill"
                        onClick={() => execFeedTime()}
                      >
                        {" "}
                        <i className="  ri-check-fill" />
                      </Button>
                    </Col>
                  </Row>

                  <input
                    type="text"
                    value={feed_time}
                    onChange={handleTimeChange}
                    id="feed_time"
                    placeholder="Fixed Time (e.g., 06:00, 06:02, 06:04)"
                    name="feed_time"
                    className="form-control"
                  />
                  {timeError && (
                    <span
                      id="time-error"
                      style={{ color: "#c44", fontSize: "8px" }}
                    >
                      {timeError}
                    </span>
                  )}
                </div>
              }
            />
          </Col>
        </Row>
        <Row className="mt-3">
          {[...weekdays().slice(1), weekdays()[0]].map((day) => {
            const dayAbbr = day.slice(0, 3);

            return (
              <Col key={day} xl={3}>
                <div className="form-check form-check-success mb-3">
                  <Input
                    value={dayAbbr}
                    type="checkbox"
                    className="form-check-input"
                    defaultChecked={feed_day.includes(dayAbbr)}
                    id={`formcheck_${dayAbbr.toLocaleLowerCase()}`}
                    onChange={handleFeedDayChange}
                  />
                  <Label
                    className="form-check-label"
                    for={`formcheck_${dayAbbr.toLocaleLowerCase()}`}
                  >
                    {day}
                  </Label>
                  {feedDayError && (
                    <span
                      id="feed-day-error"
                      style={{ color: "#c44", fontSize: "8px" }}
                    >
                      {feedDayError}
                    </span>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-center">
          <button
            className="btn btn-success"
            disabled={!btnStatus}
            onClick={handleSaveInfo}
          >
            Save Schedule
          </button>
          <button className="btn btn-danger" onClick={CloseModel}>
            Close
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
