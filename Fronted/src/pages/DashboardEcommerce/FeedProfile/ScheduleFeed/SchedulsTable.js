import { Input, Table } from "reactstrap";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";

import {
  deleteScheduleApi,
  updateScheduleStatusApi,
} from "../../../../services/feedProfile.services";

export const SchedulsTable = ({
  resetScheduleTimer,
  resetFeedTimerHTML,
  setScheduleArray,
  scheduledRowInd,
  currentFeederId,
  setScheduleData,
  getSchedules,
  tog_backdrop,
  mySchedules,
  stopStatus,
  userId,
  schedulesActive,
  setSchedulesActive,
  setSchedulesPerformed,
  schedulesPerformed,
  ongetSchedule,
}) => {
  useEffect(() => {
    if (mySchedules && mySchedules.length > 0) {
      const anyActive = mySchedules.some((schedule) => schedule.is_enabled);
      setSchedulesActive(anyActive);
      ongetSchedule && ongetSchedule(anyActive);
    }
  }, [mySchedules, setSchedulesActive, ongetSchedule]);

  const updateFields = (id, { feed_time_type, feed_day, ...fields }) =>
    setScheduleData({
      ...fields,
      isNew: id,
      feedTimeType: feed_time_type,
      feed_day: JSON.parse(feed_day),
    });

  const getWeekStatus = (days) => {
    let daysAr = JSON.parse(days);
    if (
      daysAr.includes("Mon") &&
      daysAr.includes("Tue") &&
      daysAr.includes("Wed") &&
      daysAr.includes("Thu") &&
      daysAr.includes("Fri") &&
      daysAr.includes("Sat") &&
      daysAr.includes("Sun")
    ) {
      return "All Days";
    } else {
      return daysAr.join();
    }
  };

  const getFullDesc = (feed_schedule, feed_time, feed_time_type, feed_day) => {
    if (feed_schedule !== "FixedTime") {
      let new_feed_time;
      if (feed_time >= 60) {
        let getHours = feed_time / 60;
        new_feed_time = getHours > 1 ? getHours + " hours" : getHours + " hour";
      } else {
        new_feed_time = feed_time + ` minute${feed_time === 1 ? "" : "s"}`;
      }
      return feed_time_type + " " + new_feed_time + " on " + feed_day;
    } else {
      return "At " + feed_time + " on " + feed_day;
    }
  };

  const resetScheduleArray = () => {
    resetScheduleTimer();
    resetFeedTimerHTML();
    setScheduleArray([]);
  };

  const updateSchedule = async (id, value) => {
    resetScheduleArray();
    let is_enabled = value ? "1" : "0";
    await updateScheduleStatusApi(userId, currentFeederId, {
      id: id,
      is_enabled: is_enabled,
    })
      .then((res) => {
        toast("Feed Schedule Status Updated Successfully", {
          className: "bg-success text-white",
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
        });
        getSchedules();

        setSchedulesPerformed(schedulesPerformed + 1);
        console.log(schedulesPerformed);
      })
      .catch((err) => {});
  };

  const deleteSchedule = (id) => {
    if (window.confirm("Are you sure you wish to delete?")) {
      resetScheduleArray();
      deleteScheduleApi(userId, currentFeederId, { id: id }).then((res) => {
        getSchedules();
        toast("Feed Schedule Deleted Successfully", {
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
          className: "bg-success text-white",
        });
      });
    }
  };

  return (
    <div className="table-responsive">
      <Table className="table-striped table-nowrap align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Type</th>
            <th scope="col">Time</th>
            <th scope="col">Feed Quantity</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mySchedules && mySchedules.length > 0 ? (
            mySchedules.map((val, i) => {
              return (
                <tr
                  key={i}
                  {...(scheduledRowInd === i && {
                    style: {
                      backgroundColor: stopStatus ? "#0080002e" : "#d51a211c",
                    },
                  })}
                >
                  <td>{i + 1}</td>
                  <td className="ellapse-txt">
                    <strong style={{ fontSize: "1.1em" }}>{val.title}</strong>
                  </td>
                  <td>
                    <strong>{val.feed_schedule}</strong>
                  </td>
                  <td>
                    (
                    {getFullDesc(
                      val.feed_schedule,
                      val.feed_time,
                      val.feed_time_type,
                      getWeekStatus(val.feed_day)
                    )}
                    )
                  </td>
                  <td>{val.quantity} KG</td>
                  <td>
                    <div
                      className="form-check form-switch form-switch-sm float-right"
                      dir="ltr"
                    >
                      <Input
                        type="checkbox"
                        onChange={async (e) => {
                          await updateSchedule(val.id, e.target.checked);
                          // ongetSchedule &&
                          //   ongetSchedule(
                          //     mySchedules.some(
                          //       (schedule) =>
                          //         schedule.id !== val.id && schedule.is_enabled
                          //     ) || e.target.checked
                          //   );
                          setSchedulesActive(
                            mySchedules.some(
                              (schedule) =>
                                schedule.id !== val.id && schedule.is_enabled
                            ) || e.target.checked
                          );
                        }}
                        defaultChecked={val.is_enabled && schedulesActive}
                        className="form-check-input"
                        id="customSwitchsizelg"
                      />
                    </div>
                  </td>
                  <td>
                    <Icon
                      icon="ri:edit-fill"
                      className="float-right"
                      color="#a33"
                      width="20"
                      height="20"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        tog_backdrop();
                        updateFields(val.id, val);
                      }}
                    />
                    &nbsp; &nbsp;
                    <Icon
                      icon="ri:delete-bin-5-line"
                      className="float-right"
                      color="#a33"
                      width="20"
                      height="20"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteSchedule(val.id)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} align="center">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
