import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment/moment";

import {
    getSchedulesApi,
    getFeederStopStatusApi,
    getSunriseSunsetRangeApi,
} from '../../../../../services/feedProfile.services';

export const useScheduleFeed = ({
    currentFeederId,
    setIsExpired,
}) => {
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const [sunrisesSunsets, setSunrisesSunsets] = useState([]);
    const [feederStopStatus, setFeederStopStatus] = useState()
    const [nextSchedule, setNextSchedule] = useState(null);
    const [scheduleArray, setScheduleArray] = useState([])
    const [mySchedules, setSchedules] = useState([]);

    const [scheduleData, setScheduleData] = useState({
        feedTimeType: 'fixed',
        feed_schedule: null,
        feed_time: null,
        quantity: null,
        feed_day: [],
        title: null,
        isNew: '',
    });

    const scheduleTimerInterval = useRef(null);
    
    const schedulesLimit = {
        limit: 20,
        isReachLimit: () => !(schedulesLimit.limit - schedulesLimit.count),
        count: mySchedules.reduce((cnt, {feed_time}) => cnt + `${feed_time}`?.split(',').length, 0),
    }

    useEffect(() => {
        getSchedules();
        
        getSunriseSunsetRangeApi({eDay: moment().add(6, 'days')}).then(({data}) => {
            setSunrisesSunsets(data)
        })

        return () => { resetScheduleTimer() }
    }, [currentFeederId])

    useEffect(() => {// timer instead of defining it globally
        if(nextSchedule) {
            setScheduleArray([...scheduleArray, nextSchedule])
            let countDownDate = moment(nextSchedule).utcOffset("+0400");
            
            scheduleTimerInterval.current = setInterval(function () {
                let now = moment().utcOffset("+0400");
                let distance = countDownDate - now;
                let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

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
                if (document.getElementById("days") != null && parseInt(document.getElementById("days").innerHTML) == 0 &&
                    document.getElementById("hours") != null && parseInt(document.getElementById("hours").innerHTML) == 0 &&
                    document.getElementById("minutes") != null && parseInt(document.getElementById("minutes").innerHTML) == 0 &&
                    document.getElementById("seconds") != null && parseInt(document.getElementById("seconds").innerHTML) == 0) {
                    resetScheduleTimer()
                    getSchedules()
                }
            }, 1000);
        }
    }, [nextSchedule])

    const scheduledRowInd = useMemo(() => {
        if(!nextSchedule) return -1;
        
        const date = moment(nextSchedule);
        const [day, time] = [date.format('ddd'), date.format('HH:mm')];
        const sunriseSunset = sunrisesSunsets?.find(ss => date.format('YYYY-MM-DD') == ss.day)

        const selectedInd = mySchedules.findIndex(({
            feed_time_type,
            feed_schedule,
            is_enabled,
            feed_time,
            feed_day,
        }) => (
            JSON.parse(feed_day).includes(day) &&
            is_enabled &&
            (
                feed_schedule == "FixedTime"
                ? (feed_time.includes(time))
                : (
                   time == moment(sunriseSunset?.[feed_schedule], 'HH:mm')
                            .add(+feed_time * (feed_time_type == 'before' ? -1 : 1), 'minutes')
                            .format('HH:mm')
                )
            )
        ))

        return selectedInd;
    }, [nextSchedule, mySchedules, sunrisesSunsets])
    
    const getFeederStopStatus = () => {
        getFeederStopStatusApi(currentFeederId).then(res => {
            setFeederStopStatus(res)
        })
    }

    const resetScheduleTimer = () => {
        clearInterval(scheduleTimerInterval.current)
        setNextSchedule(null)
        setScheduleArray([])
    }
    
    const getSchedules = (id, value) => {
        getSchedulesApi(currentFeederId)
            .then(res => {
                setSchedules(res.data)
                setIsExpired(false)
                if (res.schedule_data !== false) {
                    // setIsExpired(false)
                    ReviseSchedules(res.schedule_data)
                } else {
                    // setIsExpired(true)
                    resetScheduleTimer()
                }
            })
    }

    const ReviseSchedules = (StrTimings) => {
        if (!StrTimings?.length) return;

        var CurrentdateString = moment().utcOffset('+0400').format("dddd, MMMM D, YYYY, H:mm:ss");

        for (let i = 0; i < StrTimings.length; i++) {
            var commingSchedule = moment(StrTimings[i]).format("dddd, MMMM D, YYYY, H:mm:ss");

            if (moment(commingSchedule).isAfter(CurrentdateString)) {
                resetScheduleTimer()
                resetFeedTimerHTML()
                setNextSchedule(commingSchedule)
                break;
            }
        }
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

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }

    return ({
        mySchedules,
        scheduleData,
        getSchedules,
        tog_backdrop,
        schedulesLimit,
        modal_backdrop,
        scheduledRowInd,
        setScheduleData,
        feederStopStatus,
        setScheduleArray,
        setmodal_backdrop,
        resetFeedTimerHTML,
        resetScheduleTimer,
        getFeederStopStatus,
    });
};