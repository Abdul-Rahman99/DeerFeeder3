import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { addScheduleApi } from "../../../../../../services/feedProfile.services";

import {
  time_day,
  time_day_c,
  time_sunset,
  time_sunrise,
  time_sunset_c,
  time_sunrise_c,
} from "../../../../../../assets/images";

export const useScheduleModal = ({
  resetScheduleTimer,
  setmodal_backdrop,
  setScheduleArray,
  currentFeederId,
  setScheduleData,
  scheduleData: {
    feed_schedule,
    feedTimeType,
    feed_time,
    quantity,
    feed_day,
    title,
    isNew,
  },
  modal_backdrop,
  schedulesLimit,
  getSchedules,
  userId,
}) => {
  const [hoursMinutesList, setHoursMinutesList] = useState([]);
  const [btnStatus, setBtnStatus] = useState(false);
  const [timeMinute, setTimeMinute] = useState("");
  const [timeHours, setTimeHours] = useState("");
  const [feed_day2, setFeed_day2] = useState([]);

  const { current: dayTimesData } = useRef([
    { name: "Sunset", imgTime: time_sunset, imgTimeC: time_sunset_c },
    { name: "Sunrise", imgTime: time_sunrise, imgTimeC: time_sunrise_c },
    { name: "FixedTime", imgTime: time_day, imgTimeC: time_day_c },
  ]);

  const allowedScheduls = schedulesLimit.limit - schedulesLimit.count;

  const updateScheduleField = (name, value) =>
    setScheduleData((oldFields) => ({
      ...oldFields,
      [name]: value,
    }));

  const resetFeedTimerHTML = () => {
    if (
      document.getElementById("days") != null &&
      document.getElementById("hours") != null &&
      document.getElementById("minutes") != null &&
      document.getElementById("seconds") != null
    ) {
      document.getElementById("days").innerHTML = "";
      document.getElementById("hours").innerHTML = "";
      document.getElementById("minutes").innerHTML = "";
      document.getElementById("seconds").innerHTML = "";
    }
  };

  const setFeedDay = (val) => {
    const allFeedDay = [...new Set([...feed_day, ...feed_day2])];

    const updatedFeedDay = allFeedDay.includes(val)
      ? allFeedDay.filter((d) => d !== val)
      : [...allFeedDay, val];

    updateScheduleField("feed_day", updatedFeedDay);
    setFeed_day2(updatedFeedDay);
    validateField();
  };

  const saveInfo = () => {
    resetScheduleArray();
    let data = {
      userId: userId,
      isNew: isNew,
      title: title?.trim(),
      quantity: quantity,
      feed_schedule: feed_schedule,
      feed_time_type: feedTimeType,
      feed_time: feed_time,
      feed_day: feed_day,
    };

    addScheduleApi(currentFeederId, data).then((res) => {
      toast(`Feed Schedule ${isNew ? "Updated" : "Added"} Successfully`, {
        className: "bg-success text-white",
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: false,
      });
      getSchedules();
      resetForm();
      tog_backdrop();
    });
  };

  const resetForm = () => {
    setHoursMinutesList([]);
    setTimeMinute("");
    setTimeHours("");
    setFeed_day2([]);

    setScheduleData({
      feedTimeType: "fixed",
      feed_schedule: null,
      feed_time: null,
      quantity: null,
      feed_day: [],
      title: null,
      isNew: "",
    });
  };

  const resetScheduleArray = () => {
    resetScheduleTimer();
    resetFeedTimerHTML();
    setScheduleArray([]);
  };

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const handleClick = (radioId) => {
    const radioInputs = document.querySelectorAll(".radio-input");
    const labels = document.querySelectorAll(".radio-label");
    radioInputs.forEach((input) => {
      if (input.id === radioId) {
        input.checked = true;
        updateScheduleField("feed_schedule", input.value);
        validateField();
        labels.forEach((label) => {
          if (label.previousElementSibling.id === radioId) {
            label.children[0].style.display = "none";
            label.children[1].style.display = "block";
          } else {
            label.children[0].style.display = "block";
            label.children[1].style.display = "none";
          }
        });
      } else {
        input.checked = false;
      }
    });
  };

  const execFeedTime = () => {
    if (hoursMinutesList.length > 0) {
      let getVal = hoursMinutesList.join();
      document.getElementById("feed_time").value = getVal;
      updateScheduleField("feed_time", getVal);
    }
  };

  const updateFeedTime = () => {
    const hourMin = `${timeHours}:${timeMinute}`;
    if (
      timeMinute &&
      timeHours &&
      timeHours !== "undefined" &&
      timeMinute !== "undefined" &&
      !hoursMinutesList.includes(hourMin)
    ) {
      if (hoursMinutesList.length <= 20) {
        const newList = [...hoursMinutesList, hourMin];
        setHoursMinutesList(newList);
        document.getElementById("feed_time").value = newList.join();
        updateScheduleField("feed_time", newList.join());
      } else alert("Limit Exceeding");
    }
  };

  const CloseModel = () => {
    resetForm();
    tog_backdrop();
  };

  const validateField = () => {
    let toProcess = false;
    let toProcessTimer = false;
    let toProcessTitle = false;
    let toProcessQty = false;
    let toProcessFeedTime = false;
    let toProcessSchedulesLimit = false;

    var element_title = document.getElementById("title");
    var element_qty = document.getElementById("quantity");
    var element_time = document.getElementById("feed_time");

    if (feed_schedule != "FixedTime") {
      if (feed_day.length > 0) {
        // alert(feed_day.length)
        toProcess = true;
      }
      if (element_time != null && element_time.value != "") {
        // alert(element_time.value)
        toProcessFeedTime = true;
      }
      toProcessTimer = true;
    } else {
      toProcess = true;
      toProcessFeedTime = true;
      if (feed_schedule == "FixedTime") {
        let txtAr = element_time.value.split(",");
        let eachCheck = true;
        if (txtAr.length > 0 && txtAr.length <= 20) {
          txtAr.forEach((elem) => {
            let indTime = elem.split(":");
            if (
              !indTime ||
              indTime.length == 0 ||
              indTime.length > 2 ||
              indTime[0] > 23 ||
              indTime[1] > 59
            ) {
              eachCheck = false;
            }
          });
          if (eachCheck) toProcessTimer = true;
        }
      }
    }

    let regex_title = /.*[a-zA-Z].*/;
    if (element_title.value.match(regex_title)) {
      toProcessTitle = true;
    }
    // let regex_qty = /^[0-9]{1,2}$/;
    // // if ((element_qty.value.match(regex_qty)) && element_qty.value <= 12) {
    // if (element_qty.value.match(regex_qty)) {
    //   toProcessQty = true;
    // }
    if (+element_time?.value?.split(",").length <= allowedScheduls) {
      toProcessSchedulesLimit = true;
    }

    document.getElementById("errorbox").innerHTML = "";
    if (
      toProcess &&
      // toProcessQty &&
      toProcessTimer &&
      toProcessTitle &&
      toProcessSchedulesLimit
    ) {
      setBtnStatus(true);
    } else {
      if (!toProcessTitle) {
        document.getElementById("errorbox").innerHTML =
          "Title must has at least one letter";
        // alert("Title must not have numbers")
      }
      //  else if (!toProcessQty) {
      //   // alert("Quantity must be less than or equal to 12 KG")
      //   document.getElementById("errorbox").innerHTML =
      //     "Quantity must be less than or equal to 12 KG";
      // }
      else if (!toProcessTimer) {
        document.getElementById("errorbox").innerHTML =
          "Fixed time must be CSV with format of HH:mm,HH:mm (min=2, max=20). Spaces are not allowed";
        // alert("Fixed time must be CSV with format of HH:mm,HH:mm (min=2, max=20")
      } else if (!toProcessFeedTime) {
        document.getElementById("errorbox").innerHTML =
          "Please select Time Type";
        // alert("Please select Time Type / Days of the week")
      } else if (!toProcess) {
        document.getElementById("errorbox").innerHTML =
          "Please select Week Days";
        // alert("Please select Time Type / Days of the week")
      } else if (!toProcessSchedulesLimit) {
        document.getElementById(
          "errorbox"
        ).innerHTML = `You can only add ${allowedScheduls} schedules`;
      }
      setBtnStatus(false);
    }
  };

  return {
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
    updateFeedTime,
    modal_backdrop,
    setHoursMinutesList,
    updateScheduleField,
  };
};
